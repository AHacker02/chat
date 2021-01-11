import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Chat from "../chat/chat";
import "./imessage.css";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser, userSlice } from "../../features/userSlice";
import { BASE_URL, SIGNALR } from "../../utils/endpoints";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  setChatList,
  addMessage,
  setStatus,
  selectedChat,
} from "../../features/chatSlice";

const Imessage = () => {
  const token = useSelector(selectToken);
  const [connection, setConnection] = useState(null);
  const chat = useSelector(selectedChat);
  const { clientId } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(BASE_URL + SIGNALR, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected");
        })
        .catch((e) => {
          console.log("Connection failed:", e);
        });

      connection.on("Chats", (chats) => {
        console.log("Chats", chats);
        dispatch(setChatList(chats));
      });
      connection.on("Message", (message) => {
        console.log("Message", message);
        dispatch(addMessage(message));
      });
      connection.on("UserStatus", (user) => {
        console.log("UserStatus", user);
        dispatch(setStatus(user));
      });
    }
  }, [connection]);

  const sendMessage = async (message) => {
    debugger;
    if (connection.connectionStarted) {
      try {
        await connection.send("SendMessage", chat.id, clientId, message);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  return (
    <div className="imessage">
      <Sidebar />
      <Chat sendMessage={sendMessage} />
    </div>
  );
};

export default Imessage;

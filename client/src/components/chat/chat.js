import React, { useEffect, useState } from "react";
import ContactPanel from "./contactpanel";
import MessageWindow from "./messagewindow";
import "./chat.css";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { BASE_URL, SIGNALR } from "../../utils/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../../actions/chatActions";
import { UPDATE_CHAT_LIST } from "../../actions/types";

const useStyles = makeStyles((theme) => ({
  contactPanel: { width: "30%", height: "100vh" },
  messagePanel: { width: "70%", height: "100vh" },
}));

const Chat = () => {
  const classes = useStyles();
  const [connection, setConnection] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.chat.selectedChat);
  const dispatch = useDispatch();
  const sendMessage = async ({ message }) => {
    await connection.send("SendMessage", user.id, user.clientId, message);
  };
  const registerTopics = () => {
    connection.on("Online", (user) => {
      console.log("Online");
      console.log(user);
      dispatch({
        type: UPDATE_CHAT_LIST,
        payload: [user],
      });
    });
    connection.on("Chats", (contacts) => {
      console.log("Chats");
      console.log(contacts);
      dispatch({
        type: UPDATE_CHAT_LIST,
        payload: contacts,
      });
    });
    connection.on("Offline", (user) => {
      console.log(user);
    });
    connection.on("Message", (msg) => {
      console.log(msg);
      dispatch(newMessage(msg));
    });
  };

  useEffect(() => {
    let conn = new HubConnectionBuilder()
      .withUrl(BASE_URL + SIGNALR, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    setConnection(conn);
  }, [token]);

  useEffect(() => {
    if (connection && !connection.connectionStarted) {
      connection
        .start()
        .then(() => {
          console.info("SignalR Connected");
          registerTopics();
        })
        .catch((err) => console.error("SignalR Connection Error: ", err));
    }
  }, [connection]);

  window.addEventListener("beforeunload", (ev) => {
    connection.stop();
  });

  return (
    <Grid container spacing={0}>
      <Grid item container className={classes.contactPanel}>
        <ContactPanel />
      </Grid>
      <Grid item container className={classes.messagePanel}>
        <MessageWindow sendMessage={sendMessage} />
      </Grid>
    </Grid>
  );
};

export default Chat;

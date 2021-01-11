import React, { useEffect, useState } from "react";
import "./chat.css";
import { IconButton } from "@material-ui/core";
import MicNoneIcon from "@material-ui/icons/MicNone";
import FlipMove from "react-flip-move";
import Message from "./message/message";
import { selectedChat } from "../../features/chatSlice";
import { useSelector } from "react-redux";
import db from "../../utils/firebase";
import { selectUser } from "../../features/userSlice";

const Chat = ({ sendMessage }) => {
  const [input, setInput] = useState("");
  const chat = useSelector(selectedChat);

  return (
    <div className="chat">
      <div className="chat__header">
        <h4>
          To:{" "}
          <span className="chat__name">{`${chat?.firstName} ${chat?.lastName}`}</span>
        </h4>
        <strong>Details</strong>
      </div>
      <div className="chat__messages">
        <FlipMove>
          {chat?.messages.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </FlipMove>
      </div>
      <div className="chat__input">
        <form
          onSubmit={() => {
            sendMessage(input);
            setInput(null);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button type="submit">Send Message</button>
        </form>
        <IconButton>
          <MicNoneIcon className="chat__mic" />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;

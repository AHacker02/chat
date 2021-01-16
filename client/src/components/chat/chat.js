import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { IconButton } from "@material-ui/core";
import MicNoneIcon from "@material-ui/icons/MicNone";
import FlipMove from "react-flip-move";
import Message from "./message/message";
import { selectedChat } from "../../features/chatSlice";
import { useSelector } from "react-redux";
import _ from "lodash";

const Chat = ({ sendMessage }) => {
  const [input, setInput] = useState("");
  const chat = useSelector(selectedChat);
  let messages;
  if (chat) {
    try {
      messages = chat.messages;
      messages = _.orderBy(messages, ["sentAt"], ["asc"]);
    } catch (e) {
      console.log(e);
    }
  }

  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="chat">
      <div className="chat__header">
        <h4>
          To:{" "}
          <span className="chat__name">
            {chat ? `${chat?.firstName} ${chat?.lastName}` : null}
          </span>
        </h4>
        {/*<strong>Details</strong>*/}
      </div>
      <div className="chat__messages">
        <FlipMove>
          {messages?.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </FlipMove>
        <div ref={bottomRef} className="list-bottom" />
      </div>
      <div className="chat__input">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
            setInput("");
          }}
        >
          <input
            value={input}
            disabled={!chat}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button type="submit">Send Message</button>
        </form>
        {/*<IconButton>
          <MicNoneIcon className="chat__mic" />
        </IconButton>*/}
      </div>
    </div>
  );
};

export default Chat;

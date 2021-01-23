import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import FlipMove from "react-flip-move";
import Message from "./message/message";
import { clearChatSelection, selectedChat } from "../../features/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useScrollToBttom } from "../../utils/scrollHook";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const Chat = ({ sendMessage }) => {
  //#region Variable setup
  const [input, setInput] = useState("");
  const [bottomRef, scrollToBottom] = useScrollToBttom();
  const chat = useSelector(selectedChat);
  const isMobile = window.innerWidth <= 768;
  const [hide, setHide] = useState(false);
  const dispatch = useDispatch();
  let messages;
  //#endregion

  const renderBack = () => {
    if (isMobile) {
      return (
        <ArrowBackIosIcon onClick={() => dispatch(clearChatSelection())} />
      );
    }
  };

  // Sort messages in descending order by  time
  if (chat) {
    try {
      messages = chat.messages;
      messages = _.orderBy(messages, ["sentAt"], ["asc"]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isMobile && !chat) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [chat]);

  //#region Scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, []);
  //#endregion

  return (
    <div className={hide ? "chat hide" : "chat"}>
      <div className="chat__header">
        {renderBack()}
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

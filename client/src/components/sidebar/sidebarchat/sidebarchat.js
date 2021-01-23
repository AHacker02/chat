import React from "react";
import { Avatar } from "@material-ui/core";
import "./sidebarchat.css";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, selectedChat } from "../../../features/chatSlice";
import moment from "moment";

const SidebarChat = ({ contact }) => {
  //#region Variable setup
  const dispatch = useDispatch();
  const selected = useSelector(selectedChat);
  //#endregion

  return (
    <div
      onClick={() => {
        dispatch(selectChat(contact));
      }}
      className={`sidebarChat ${
        selected?.id === contact.id ? "sidebarChat__selected" : null
      }`}
    >
      <Avatar
        src={
          contact.photo ??
          `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`
        }
      />
      <div className="sidebarChat__info">
        <h3>{`${contact.firstName} ${contact.lastName}`}</h3>
        <p>
          {contact.lastMessage}
          {/*<small>{moment(contact.lastMessageTime).calendar()}</small>*/}
        </p>
        <small>
          {contact.status
            ? contact.status === "Online"
              ? "Online"
              : moment(contact.status).calendar()
            : null}
        </small>
      </div>
    </div>
  );
};

export default SidebarChat;

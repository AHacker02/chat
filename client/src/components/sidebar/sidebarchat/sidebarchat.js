import React from "react";
import { Avatar } from "@material-ui/core";
import "./sidebarchat.css";
import { useDispatch } from "react-redux";
import { selectChat, setChatList } from "../../../features/chatSlice";

const SidebarChat = ({ contact }) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => {
        dispatch(selectChat(contact));
      }}
      className="sidebarChat"
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
          {contact.lastMessage} <small>{contact.lastMessageTime}</small>
        </p>
        <small>{contact.Status}</small>
      </div>
    </div>
  );
};

export default SidebarChat;

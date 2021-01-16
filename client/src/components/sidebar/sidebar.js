import React from "react";
import { Avatar, IconButton } from "@material-ui/core";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import "./sidebar.css";
import SidebarChat from "./sidebarchat/sidebarchat";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  searchContact,
  selectChat,
  selectChatList,
  selectSearchResult,
} from "../../features/chatSlice";
import { selectLoading, setLoading } from "../../features/appSlice";
import SearchUser from "../common/SearchUser";

const Sidebar = ({ signOut }) => {
  const user = useSelector(selectUser);
  const chats = Object.values(useSelector(selectChatList));
  const dispatch = useDispatch();

  const selectResult = (value) => {
    dispatch(selectChat(value));
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar
          onClick={signOut}
          src={
            user.photo ??
            `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
          }
          className="sidebar__avatar"
        />
        <div className="sidebar__input">
          {/* <SearchIcon />*/}
          {/*<input placeholder="Search" />*/}
          <SearchUser variant="outlined" selectResult={selectResult} />
        </div>

        <IconButton
          onClick={() => dispatch(setLoading({ name: "group", loading: true }))}
        >
          <RateReviewOutlinedIcon />
        </IconButton>
      </div>
      <div className="sidebar__chat">
        {chats.map((chat) => (
          <SidebarChat key={chat.id} contact={chat} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

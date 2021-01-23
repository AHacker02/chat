import React, { useEffect, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import "./sidebar.css";
import SidebarChat from "./sidebarchat/sidebarchat";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  selectChat,
  selectChatList,
  selectedChat,
} from "../../features/chatSlice";
import { setLoading } from "../../features/appSlice";
import SearchUser from "../common/SearchUser";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import LanguageIcon from "@material-ui/icons/Language";

const Sidebar = ({ signOut }) => {
  //#region Variable setup
  const user = useSelector(selectUser);
  const chats = Object.values(useSelector(selectChatList));
  const chatSelected = useSelector(selectedChat);
  const dispatch = useDispatch();
  const isMobile = window.innerWidth <= 768;
  const [hide, setHide] = useState(false);
  //#endregion

  useEffect(() => {
    if (isMobile && chatSelected) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [chatSelected]);
  const selectResult = (value) => {
    dispatch(selectChat(value));
  };

  return (
    <div className={hide ? "sidebar hide" : "sidebar"}>
      <div className="sidebar__header">
        <Tooltip title="Sign Out" arrow>
          <Avatar
            onClick={signOut}
            src={
              user.photo ??
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
            }
            className="sidebar__avatar"
          />
        </Tooltip>
        <div className="sidebar__input">
          <SearchUser
            exclude={[user.id, ...chats?.map((x) => x.id)]}
            variant="outlined"
            selectResult={selectResult}
          />
        </div>
        <Tooltip title="Create Group" arrow>
          <IconButton
            onClick={() =>
              dispatch(setLoading({ name: "group", loading: true }))
            }
          >
            <RateReviewOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="sidebar__chat">
        {chats.map((chat) => (
          <SidebarChat key={chat.id} contact={chat} />
        ))}
      </div>
      <div className="sidebar__footer">
        <a
          href="https://www.linkedin.com/in/arghya-ghosh-dotnetbuilders"
          target="_blank"
        >
          <LinkedInIcon fontSize="large" />
        </a>
        <a href="https://www.dotnetbuilder.com" target="_blank">
          <LanguageIcon fontSize="large" />
        </a>
        <a href="https://github.com/AHacker02/imessage-clone" target="_blank">
          <GitHubIcon fontSize="large" />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

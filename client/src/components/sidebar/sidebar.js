import React, { useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import SearchIcon from "@material-ui/icons/Search";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import "./sidebar.css";
import SidebarChat from "./sidebarchat/sidebarchat";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import db, { auth } from "../../utils/firebase";
import {
  searchContact,
  selectChat,
  selectChatList,
  selectSearchResult,
} from "../../features/chatSlice";
import { selectLoading } from "../../features/appSlice";

const Sidebar = () => {
  const user = useSelector(selectUser);
  const chats = Object.values(useSelector(selectChatList));
  const dispatch = useDispatch();
  const loading = useSelector((state) => selectLoading(state, "search"));
  const searchResult = useSelector(selectSearchResult);

  const addChat = () => {
    const chatName = prompt("Please enter a chat name");
    if (chatName) {
      db.collection("chats").add({
        chatName: chatName,
      });
    }
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      dispatch(searchContact(e.target.value));
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar
          onClick={() => auth.signOut()}
          src={
            user.photo ??
            `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
          }
          className="sidebar__avatar"
        />
        <div className="sidebar__input">
          {/* <SearchIcon />*/}
          {/*<input placeholder="Search" />*/}
          <Autocomplete
            freeSolo
            disableClearable
            onChange={(event, value) => {
              dispatch(selectChat(value));
            }}
            loading={loading}
            filterOptions={(options, state) => options}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            options={searchResult}
            renderInput={(params) => (
              <TextField
                onChange={handleSearch}
                {...params}
                placeholder="Search user"
                margin="dense"
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>

        <IconButton>
          <RateReviewOutlinedIcon onClick={addChat} />
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

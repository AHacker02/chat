import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { openChat, searchUser, selectChat } from "../../actions/chatActions";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  input: { background: "#3C393F", margin: "0px" },
  header: {
    background: "120F13",
    boxShadow: "0px -5px 5px 5px #111",
    padding: "5px 15px",
    height: "67.09px",
  },
  chatHistory: {
    background: "120F13",
    //padding: "5px 15px",
    height: "calc(100% - 67px)",
  },
}));

const getStatus = (status) => {
  switch (status) {
    case "Online":
      return " (Online)";
    case null:
      return "";
    default:
      return ` (Last seen at ${status})`;
  }
};

const ContactPanel = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.application.isLoading);
  const searchResult = useSelector((state) => state.chat.search);
  const chats = _.values(useSelector((state) => state.chat.chatList));
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  const onClick = (chat) => {
    dispatch(selectChat(chat));
    dispatch(openChat(chat.id));
  };
  const renderContact = (contact) => {
    return (
      <>
        <ListItem
          selected={contact.isSelected}
          onClick={() => onClick(contact)}
        >
          <ListItemAvatar>
            <Avatar>{contact.firstName[0] + contact.lastName[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${contact.firstName} ${contact.lastName}${getStatus(
              contact.status
            )}`}
            secondary={contact.lastMessage}
          />
        </ListItem>
        <Divider />
      </>
    );
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      dispatch(searchUser(e.target.value));
    }
  };

  return (
    <>
      <Grid item container xs={12} className={classes.header}>
        <FormControl
          fullWidth
          margin={"dense"}
          size={"small"}
          variant={"outlined"}
        >
          <Autocomplete
            freeSolo
            disableClearable
            onChange={(event, value) => {
              dispatch(selectChat(value));
            }}
            loading={isLoading}
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
                className={classes.input}
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
        </FormControl>
      </Grid>
      <Grid item container xs={12} className={classes.chatHistory}>
        <List style={{ width: "100%" }}>
          {chats?.map((chat) => {
            chat.isSelected = selectedChat?.id === chat.id;
            return renderContact(chat);
          })}
        </List>
      </Grid>
    </>
  );
};

export default ContactPanel;

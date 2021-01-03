import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import sendIcon from "../../resources/send-icon.png";
import {
  Button,
  InputBase,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { openChat } from "../../actions/chatActions";
import { Field, reduxForm } from "redux-form";

const useStyles = makeStyles(() => ({
  input: { background: "#3C393F", margin: "0px" },
  header: {
    background: "#333333",
    boxShadow: "6px -5px 5px 5px #111",
    padding: "5px 15px",
    height: "67.09px",
    zIndex: "1",
  },
  chatHistory: {
    background: "#333333",
    padding: "5px 15px",
    height: "calc(100% - 134px)",
    overflow: "auto",
  },
  inputGrid: {
    background: "#333333",
    padding: "5px 15px",
    height: "67.09px",
  },
}));

const MessageWindow = (props) => {
  const classes = useStyles();
  const chat = useSelector((state) => state.chat.selectedChat);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  useEffect(() => {
    if (chat) {
      dispatch(openChat(chat.id));
    }
  }, [chat, dispatch]);

  const onSubmit = (message) => {
    props.sendMessage(message);
  };
  return (
    <>
      <Grid item container xs={12} className={classes.header}>
        <Typography align="justify" variant="h4">
          {chat ? `${chat.firstName} ${chat.lastName}` : "Messages"}
        </Typography>
      </Grid>
      <Grid item container xs={12} className={classes.chatHistory}>
        <List>
          {messages?.map((msg) => {
            return (
              <ListItem style={{ display: "flex", float: "right" }}>
                <Paper style={{ padding: "5px 10px" }}>
                  <ListItemText primary={msg.messageText} />
                </Paper>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item container xs={12} className={classes.inputGrid}>
        <Paper
          component="form"
          onSubmit={props.handleSubmit(onSubmit)}
          style={{
            maxHeight: "35px",
            padding: "5px",
            width: "100%",
            bottom: "10px",
            background: "#3C393F",
            display: "flex",
          }}
        >
          <Field
            name="message"
            component={({ input }) => {
              return (
                <InputBase
                  {...input}
                  fullWidth
                  placeholder="Type a message here"
                  style={{
                    top: "50%",
                    transform: "translate(0,-50%)",
                  }}
                />
              );
            }}
          />

          <Button
            type="submit"
            style={{
              background: "#2F80ED",
              float: "right",
              top: "50%",
              transform: "translate(0,-50%)",
            }}
          >
            <img src={sendIcon} alt="send_icon" />
          </Button>
        </Paper>
      </Grid>
    </>
  );
};

export default reduxForm({ form: "message" })(MessageWindow);

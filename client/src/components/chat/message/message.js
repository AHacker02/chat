import React, { forwardRef } from "react";
import "./message.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";

const Message = forwardRef(({ messageText, sentAt, fromUserId }, ref) => {
  const user = useSelector(selectUser);
  return (
    <div
      ref={ref}
      className={`message ${user.id === fromUserId && "message__sender"}`}
    >
      <p>{messageText}</p>
      <small>{sentAt?.toLocaleString()}</small>
    </div>
  );
});

export default Message;

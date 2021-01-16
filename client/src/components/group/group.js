import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  List,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormError,
  selectLoading,
  setLoading,
} from "../../features/appSlice";
import { selectUser } from "../../features/userSlice";
import { Field, reduxForm, reset } from "redux-form";
import FormTextField from "../common/formtextfield";
import SearchUser from "../common/SearchUser";
import "./group.css";
import { createGroup } from "../../features/chatSlice";

const formName = "group";

const Group = ({ group = null, handleSubmit }) => {
  const open = useSelector((state) => selectLoading(state, formName));
  const formError = useSelector((state) => selectFormError(state, formName));
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [users, setUsers] = useState([user]);
  const addUser = (value) => {
    setUsers((u) => [...u, value]);
  };

  const bottomRef = useRef();
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [users]);

  const close = () => {
    dispatch(setLoading({ name: "group", loading: false }));
    dispatch(reset(formName));
    setUsers([user]);
  };

  const addGroup = (group) => {
    let userIds = users.map((u) => u.id);
    dispatch(createGroup({ name: group.name, users: userIds }));
    dispatch(setLoading({ name: "group", loading: false }));
  };

  return (
    <Dialog
      aria-labelledby="group-form-title"
      open={open}
      onClose={close}
      className="group"
    >
      <DialogTitle id="group-form-title" className="group__title">
        <h3>{group ? "Add User to group" : "Create new group"}</h3>
      </DialogTitle>
      <DialogContent>
        <FormControl
          onSubmit={handleSubmit(addGroup)}
          component="form"
          margin="none"
          className="login__form"
        >
          {formError ? (
            <FormLabel error filled>
              {formError}
            </FormLabel>
          ) : null}
          <Field name="name" type="text" component={FormTextField} />
          <SearchUser selectResult={addUser} multiple />
          <Button type="submit">Create Group</Button>
          <ul className="group__list">
            {users.map((u) => {
              return (
                <div className="group__user">
                  <Avatar
                    src={
                      u.photo ??
                      `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random`
                    }
                  />
                  <h3>{`${u.firstName} ${u.lastName}`}</h3>
                </div>
              );
            })}
            <div ref={bottomRef} className="list-bottom"></div>
          </ul>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default reduxForm({ form: "group" })(Group);

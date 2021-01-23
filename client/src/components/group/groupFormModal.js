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
  setFormError,
  setLoading,
} from "../../features/appSlice";
import { selectUser } from "../../features/userSlice";
import { Field, reduxForm, reset } from "redux-form";
import FormTextField from "../common/formtextfield";
import SearchUser from "../common/SearchUser";
import "./group.css";
import { createGroup } from "../../features/chatSlice";
import { useScrollToBttom } from "../../utils/scrollHook";

const formName = "group";

const GroupFormModal = ({ group = null, handleSubmit }) => {
  //#region Variable setup
  const open = useSelector((state) => selectLoading(state, formName));
  const formError = useSelector((state) => selectFormError(state, formName));
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [users, setUsers] = useState([user]);
  const [bottomRef, scrollToBottom] = useScrollToBttom();
  //#endregion

  // Add new user to group
  const addUser = (value) => {
    setUsers((u) => [...u, value]);
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
    if (userIds.length <= 2) {
      dispatch(
        setFormError({
          name: formName,
          error: "Group must have minimum 3 members",
        })
      );
      return;
    }
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
        <strong>{group ? "Add User to group" : "Create new group"}</strong>
      </DialogTitle>
      <DialogContent>
        <FormControl
          onSubmit={handleSubmit(addGroup)}
          component="form"
          margin="standard"
          className="group__form"
        >
          {formError ? (
            <FormLabel error filled>
              {formError}
            </FormLabel>
          ) : null}
          <Field
            name="name"
            type="text"
            margin="none"
            component={FormTextField}
          />
          <SearchUser selectResult={addUser} exclude={users.map((u) => u.id)} />
          <Button type="submit">Create Group</Button>
          <ul className="group__list">
            {users.map((u) => {
              return (
                <div key={u.id} className="group__user">
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

export default reduxForm({ form: "group" })(GroupFormModal);

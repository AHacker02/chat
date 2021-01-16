import React, { useEffect, useState } from "react";
import { searchContact, selectSearchResult } from "../../features/chatSlice";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Autocomplete } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading } from "../../features/appSlice";

const SearchUser = ({ variant = "standard", selectResult }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => selectLoading(state, "search"));
  const searchResult = useSelector(selectSearchResult);
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    if (e.target.value) {
      setValue(e.target.value);
    }
  };

  useEffect(() => {
    if (value !== "") {
      dispatch(searchContact(value));
    }
  }, [value]);

  return (
    <Autocomplete
      inputValue={value}
      freeSolo
      disableClearable
      onChange={(event, value) => {
        selectResult(value);
        setValue("");
      }}
      loading={loading}
      filterOptions={(options, state) => options}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      options={searchResult}
      renderInput={(params) => (
        <TextField
          onChange={handleSearch}
          {...params}
          placeholder="Search user"
          margin="dense"
          fullWidth
          variant={variant}
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
  );
};

export default SearchUser;

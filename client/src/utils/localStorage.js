export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem("auth");
    if (serializedState === null) {
      return undefined;
    }
    return { auth: JSON.parse(serializedState) };
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("auth", serializedState);
  } catch {
    // ignore write errors
  }
};

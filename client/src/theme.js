import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2F80ED",
    },
  },
  typography: {
    fontFamily: ["Poppins", "Roboto"].join(","),
    allVariants: {
      color: "#E0E0E0",
    },
  },
});

export default theme;

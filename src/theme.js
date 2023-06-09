import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1760a5",
      light: "lightgrey",
    },
    secondary: {
      main: "#8860c5",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

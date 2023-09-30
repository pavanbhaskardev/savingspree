import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    body: "inter",
    heading: "inter",
  },
  body: {
    fontWeight: "400",
  },

  breakpoints: {
    sm: "360px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  colors: {
    primary: "#FDFBF7",
    secondary: "#F3F2E9",
    cardColor: "#BFB5FF",
    statColor1: "#C7F4C2",
    statColor2: "#FFBBD7",
    statColor3: "#FDDD8D",
    navBarColor: "#09AC7C",
  },
});

export default theme;

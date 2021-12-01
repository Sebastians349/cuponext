import { extendTheme, theme } from "@chakra-ui/react";
// asi se le pasaba los custom theme a chakra GANSOOOOOO

export default extendTheme({
  colors: {
    primary: theme.colors["teal"],
  },
  styles: {
    global: {
      body: {
        backgroundColor: "primary.50",
      },
    },
  },
});

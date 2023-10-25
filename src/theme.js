import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // Aquí puedes aplicar tus estilos de reseteo
      "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
      // Añade otros estilos globales si es necesario
    },
  },
});

export default theme;
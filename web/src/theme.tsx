import { theme as chakraTheme, extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { ...chakraTheme.fonts, mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
});

const theme = extendTheme({
  fonts,
  breakpoints,
  components: {
    Button: {
      baseStyle: {
        bg: "#316cb5",
        bgColor: "#316cb5",
        _hover: {
          color: "#316cb6"
        }
      },
      variants: {
        link: {
          color: "#f9fafc",
          bgColor: "rgba(0, 0, 0, 0)" 
        }
      }
    },
  },
  styles: {
    global: {
      body: {
        bg: "#5989c2",
        color: "#f9fafc",
      },
    },
  },
});

export default theme;

import { createTheme, CssBaseline } from "@mui/material"
import VKSans from "./public/fonts/vk-sans.woff"
import VKSansWoff2 from "./public/fonts/vk-sans.woff2"
import { ThemeProvider } from "@emotion/react"
import App from "./App"
import useThemeDetector from "./hooks/useThemeDetector"

const theme = createTheme({
  palette: {
    primary: {
      main: "#0077ff",
      dark: "#0077ff",
      light: "#0077ff",
    },
  },
  typography: {
    fontFamily: "VK Sans Display",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face{
        font-family:"VK Sans Display";
        src:url(${VKSansWoff2})
        format("woff2"),url(${VKSans})
        format("woff");
        font-weight:500;
        font-display:fallback
      }`,
    },
  },
})

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0077ff",
      dark: "#0077ff",
      light: "#0077ff",
    },
  },
  typography: {
    fontFamily: "VK Sans Display",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face{
        font-family:"VK Sans Display";
        src:url(${VKSansWoff2})
        format("woff2"),url(${VKSans})
        format("woff");
        font-weight:500;
        font-display:fallback
      }`,
    },
  },
})

export default function AppThemeWrapper() {
  const dark = useThemeDetector();
  return (
    <ThemeProvider theme={dark ? darkTheme : theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
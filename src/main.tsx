import { ThemeProvider } from "@emotion/react"
import { createTheme, CssBaseline } from "@mui/material"
import { AppRoot } from "@vkontakte/vkui"
import { StrictMode } from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import VKSans from "./public/fonts/vk-sans.woff"
import VKSansWoff2 from "./public/fonts/vk-sans.woff2"
import App from "./App"
import "./index.css"
import store from "./store/store"

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

render(
  <Provider store={store}>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoot mode="embedded">
          <App />
        </AppRoot>
      </ThemeProvider>
    </StrictMode>
  </Provider>,
  document.getElementById("root")
)

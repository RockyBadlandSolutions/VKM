import { AppRoot } from "@vkontakte/vkui"
import { StrictMode } from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import App from "./App"
import AppThemeWrapper from "./AppThemeWrapper"
import "./index.css"
import store from "./store/store"

render(
  <Provider store={store}>
    <StrictMode>
      <AppRoot mode="embedded">
        <AppThemeWrapper />
      </AppRoot>
    </StrictMode>
  </Provider>,
  document.getElementById("root")
)

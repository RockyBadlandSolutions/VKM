import {
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import {
  Icon16Search,
  Icon28Music,
  Icon28Search,
  Icon28Settings,
} from "@vkontakte/icons"
import { useEffect, useState } from "react"
import CaptchaHandler from "./components/CaptchaHandler"
import Player from "./components/Player"
import useVKAPI from "./hooks/useVKAPI"
import Login from "./screens/Login"
import MyMusic from "./screens/MyMusic"
import Search from "./screens/Search"
import Settings from "./screens/Settings"
import { updateScreen, updateSearch } from "./store/appStateSlice"
import { useAppDispatch, useAppSelector } from "./store/store"
import useLocalStore from "./hooks/useLocalStore"

const sxStyles = {
  player: {
    position: "fixed",
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    height: "70px",
    paddingBottom: 0,
    marginBottom: 0,
    zIndex: 9999,
  },
  drawer: {
    width: 200,
  },
  positive: {
    color: "#0077ff",
  },
  screen: {
    maxHeight: "calc(100vh - 70px)",
    flexGrow: 1,
  },
}

function App() {
  const dispatch = useAppDispatch()
  const currentScreen = useAppSelector((state) => state.appState.screen)
  const isLoggedIn = useAppSelector((state) => state.appState.logged_in)
  const [api] = useVKAPI()
  const [loginState, setLoginState] = useState(false)
  const [localStore] = useLocalStore("token", "", ".vkm");
  // const isLoggedIn = true;
  const screens = [
    {
      id: "main",
      name: "My music",
      icon: <Icon28Music style={sxStyles.positive} />,
      screen: <MyMusic />,
    },
    {
      id: "settings",
      name: "Settings",
      icon: <Icon28Settings style={sxStyles.positive} />,
      screen: <Settings />,
    },
    {
      id: "search",
      name: "Search",
      icon: <Icon28Search style={sxStyles.positive} />,
      screen: <Search />,
    },
  ]

  const [captcha, setCaptcha] = useState("")
  const [captchaValue, setCaptchaValue] = useState("")
  const [searchVal, setSearchVal] = useState("")

  useEffect(() => {
    console.log("Login status", isLoggedIn)
    setLoginState(isLoggedIn)
  }, [isLoggedIn, api, localStore])

  const onSearch = () => {
    dispatch(updateSearch(searchVal))
    dispatch(updateScreen("search"))
    setSearchVal("")
  }


  if (loginState) {
    return (
      <Box sx={{ display: "flex" }}>
        <Drawer sx={sxStyles.drawer} variant={"permanent"} anchor={"left"}>
          <Grid
            container
            sx={sxStyles.drawer}
            spacing={1}
            justifyContent={"center"}
          >
            <Grid item xs={11}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">VKM</Typography>
                <Input
                  size="small"
                  fullWidth
                  sx={{ margin: 1 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={onSearch}>
                        <Icon16Search style={sxStyles.positive} />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <List>
                {screens.map((screen) => (
                  <ListItem
                    key={screen.id}
                    onClick={() =>
                      dispatch(updateScreen(screen.id))
                    }
                    button
                    selected={screen.id === currentScreen}
                  >
                    <ListItemIcon>{screen.icon}</ListItemIcon>
                    <ListItemText primary={screen.name} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Drawer>
        <div style={sxStyles.screen}>
          {screens.filter((id) => id.id === currentScreen)[0].screen}
        </div>
        <Box sx={sxStyles.player}>
          <Divider />
          <Player />
        </Box>
        <CaptchaHandler
          value={captchaValue}
          valSetter={setCaptchaValue}
          url={captcha}
          onCancel={() => {
            setCaptcha("")
            setCaptchaValue("")
          }}
          onSubmit={() => {console.log("submit")}}
        />
      </Box>
    )
  } else {
    return <Login />
  }
}

export default App

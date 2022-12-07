import {
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
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
import useLocalStore from "./hooks/useLocalStore"
import useVKAPI from "./hooks/useVKAPI"
import Login from "./screens/Login"
import MyMusic from "./screens/MyMusic"
import Search from "./screens/Search"
import Settings from "./screens/Settings"
import { updateScreen, updateSearch } from "./store/appStateSlice"
import { useAppDispatch, useAppSelector } from "./store/store"

const drawerWidth = 200

const sxStyles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      height: "calc(100vh - 160px)",
    },
  },
  positive: {
    color: "#0077ff",
  },
}

function App() {
  const dispatch = useAppDispatch()
  const currentScreen = useAppSelector((state) => state.appState.screen)
  const isLoggedIn = useAppSelector((state) => state.appState.logged_in)
  const [api] = useVKAPI()
  const [loginState, setLoginState] = useState(false)
  const [localStore] = useLocalStore("token", "", ".vkm")
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
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Drawer sx={sxStyles.drawer} variant={"permanent"}>
            <Toolbar>
              <Grid container justifyContent="center">
                <Typography variant="h5">VKM</Typography>
              </Grid>
            </Toolbar>
            <Divider />

            <List sx={{ p: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onSearch}>
                        <Icon16Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 1 }}>
                {screens.map((screen) => (
                  <ListItem
                    key={screen.id}
                    onClick={() => dispatch(updateScreen(screen.id))}
                    button
                    selected={screen.id === currentScreen}
                    sx={{
                      borderRadius: "8px",
                    }}
                  >
                    <ListItemIcon>{screen.icon}</ListItemIcon>
                    <ListItemText primary={screen.name}/>
                  </ListItem>
                ))}
              </Box>
            </List>
          </Drawer>

          <Box component="div" sx={{ flexGrow: 1 }}>
            {screens.filter((id) => id.id === currentScreen)[0].screen}
          </Box>
        </Box>

        <Paper 
          elevation={10}>
          <Divider />
          <Player />
        </Paper>

        <CaptchaHandler
          value={captchaValue}
          valSetter={setCaptchaValue}
          url={captcha}
          onCancel={() => {
            setCaptcha("")
            setCaptchaValue("")
          }}
          onSubmit={() => {
            console.log("submit")
          }}
        />
      </Box>
    )
  } else {
    return <Login />
  }
}

export default App

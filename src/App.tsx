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
  Icon28SparkleOutline,
  Icon28NewsfeedMusicNoteOutline
} from "@vkontakte/icons"
import { useEffect, useState } from "react"
import CaptchaHandler from "./components/CaptchaHandler"
import Player from "./components/Player"
import useLocalStore from "./hooks/useLocalStore"
import useVKAPI from "./hooks/useVKAPI"
import Login from "./screens/Login"
import MyMusic from "./screens/MyMusic"
import Recommendations from "./screens/Recommendations"
import Search from "./screens/Search"
import Settings from "./screens/Settings"
import CurrentPlaylist from "./screens/CurrentPlaylist"
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
  const currentSong = useAppSelector(
    (state) => state.playerState.currentSong
  )
  const [api] = useVKAPI()
  const [loginState, setLoginState] = useState(false)
  const [localStore] = useLocalStore("token", "", ".vkm")
  const screens = [
    {
      id: "nowPlaying",
      name: "Плейлист",
      icon: <Icon28NewsfeedMusicNoteOutline style={sxStyles.positive} />,
      screen: <CurrentPlaylist/>,
    },
    {
      id: "main",
      name: "Моя музыка",
      icon: <Icon28Music style={sxStyles.positive} />,
      screen: <MyMusic />,
    },
    {
      id: "recommendations",
      name: "Рекомендации",
      icon: <Icon28SparkleOutline style={sxStyles.positive} />,
      screen: <Recommendations />,
    },
    {
      id: "search",
      name: "Поиск",
      icon: <Icon28Search style={sxStyles.positive} />,
      screen: <Search />,
    },
    {
      id: "settings",
      name: "Настройки",
      icon: <Icon28Settings style={sxStyles.positive} />,
      screen: <Settings />,
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
          <Drawer 
            sx={sxStyles.drawer}
            variant={"permanent"}>
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
                    <ListItemIcon
                      sx={{
                        ml: "-5px"
                      }}
                    >{screen.icon}</ListItemIcon>
                    <ListItemText primary={screen.name} sx={{
                      ml: "-15px"
                    }}/>
                  </ListItem>
                ))}
              </Box>
            </List>
          </Drawer>

          <Box component="div" sx={{ flexGrow: 1 }}>
            {screens.filter((id) => id.id === currentScreen)[0].screen}
          </Box>
        </Box>
        {currentSong?.title ? (
          <Paper elevation={10} sx={{backgroundColor: "background.primary"}}>
            <Divider />
            <Player />
          </Paper>
        ) : (
          <div style={{
            height: "100%",
            width: drawerWidth,
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            position: "fixed",
            bottom: 0,
            left: 0,
          }}>
            <br />
          </div>
        )
      
        }


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

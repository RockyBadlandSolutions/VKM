import React from "react"
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Slider,
  Typography,
} from "@mui/material"
import {
  Icon20VolumeOutline,
  Icon24PauseCircle,
  Icon24PlayCircle,
  Icon24Repeat,
  Icon24RepeatOne,
  Icon24Shuffle,
  Icon24SkipBack,
  Icon24SkipForward,
} from "@vkontakte/icons"
import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../store/store"
import useAudio from "../hooks/useAudio"
import { updatePaused } from "../store/playerStateSlice"
import { Audio as AudioType } from "../API/audio"

const sxStyles = {
  row: {
    display: "flex",
    flexDirection: "row",
  },
  trackSlider: {
    width: "55vw",
    color: "#0077ff",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  positiveButton: {
    color: "#0077ff",
    cursor: "pointer",
  },
  functionButtonTopMargin: {
    marginTop: "2px",
  },
}

function Player() {
  const dispatch = useAppDispatch()
  const currentSong = useAppSelector((state) => state.playerState.currentSong) as AudioType

  const [repeatMode, setRepeatMode] = useState(0)
  const [shuffle, setShuffle] = useState(false)

  const [duration, setDuration] = useState(0)
  const [songName, setSongName] = useState("")
  const [songArtist, setSongArtist] = useState("")
  const [artworkURL, setArtworkURL] = useState("")

  const [playing, currentTime, volume, play, pause, updateTime, updateVolume, player] = useAudio(currentSong?.url)

  useEffect(() => {
    if (currentSong.title) {
      setSongName(currentSong.title)
      setSongArtist(currentSong.artist)
      setArtworkURL(currentSong.album?.thumb?.photo_1200 as string)
      setDuration(currentSong.duration)
      if (player) {
        player.src = currentSong.url
        // play()
        dispatch(updatePaused(false))
      }
    }
  }, [currentSong])

  const displayTime = (value: number) => {
    const seconds = Math.floor(value % 60)
    return (
      Math.floor(value / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    )
  }

  const onPause = () => {
    if (playing) {
      pause()
      dispatch(updatePaused(true))
    } else {
      play()
      dispatch(updatePaused(false))
    }
  }

  const onShuffle = () => {
    setShuffle(!shuffle)
    console.log("shuffle")
  }

  const onRepeat = () => {
    console.log("repeat")
    if (repeatMode === 0) {
      setRepeatMode(1)
    } else if (repeatMode === 1) {
      setRepeatMode(2)
    } else {
      setRepeatMode(0)
    }
  }

  const positionChange = (e: any, val: any) => {
    console.log("positionChange", val)
    updateTime(val)
  }

  const volumeChange = (e: any, val: any) => {
    updateVolume(val)
    console.log("volumeChange", val)
  }

  const RepeatButton = () => {
    if (repeatMode === 1) {
      return (
        <IconButton
          onClick={onRepeat}
          sx={{
            ...sxStyles.functionButtonTopMargin,
          }}
          disableRipple
        >
          <Icon24RepeatOne style={sxStyles.positiveButton} />
        </IconButton>
      )
    } else {
      return (
        <IconButton
          onClick={onRepeat}
          sx={{
            ...sxStyles.functionButtonTopMargin,
          }}
          disableRipple
        >
          <Icon24Repeat
            style={repeatMode === 0 ? {} : sxStyles.positiveButton}
          />
        </IconButton>
      )
    }
  }

  const ShuffleButton = () => {
    return (
      <IconButton
        onClick={onShuffle}
        sx={{
          ...sxStyles.functionButtonTopMargin,
        }}
        disableRipple
      >
        <Icon24Shuffle style={shuffle ? sxStyles.positiveButton : {}} />
      </IconButton>
    )
  }

  const PlayButton = () => {
    if (playing) {
      return (
        <IconButton size="large" onClick={onPause} disableRipple>
          <Icon24PauseCircle style={sxStyles.positiveButton} />
        </IconButton>
      )
    } else {
      return (
        <IconButton size="large" onClick={onPause} disableRipple>
          <Icon24PlayCircle style={sxStyles.positiveButton} />
        </IconButton>
      )
    }
  }

  if (!currentSong.title) {
    return <PlayerNotAvailable />
  } else {
    return (
      <Box>
        <Avatar
          variant="square"
          src={artworkURL}
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            bottom: "0",
          }}
        />
        <Grid
          container
          alignContent="center"
          alignItems={"center"}
          direction="column"
          sx={{
            paddingLeft: "140px"
          }}
        >
          <Grid container direction={"row"} spacing={1} alignItems="center" sx={{
            paddingTop: "1em",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}>
            <Grid item>
              <Typography variant="subtitle1" noWrap>
                {songName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" noWrap sx={{paddingTop: "3px"}}>
                {songArtist}
              </Typography>
            </Grid>
          </Grid>
          <Grid item sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}>
            <Typography variant="overline">
              {displayTime(currentTime)}
            </Typography>
            <Slider
              key={currentTime}
              size="small"
              max={duration}
              defaultValue={currentTime}
              valueLabelFormat={displayTime}
              valueLabelDisplay="auto"
              sx={sxStyles.trackSlider}
              onChangeCommitted={positionChange}
            />
            <Typography variant="overline">
              {"−" + displayTime(duration - currentTime)}
            </Typography>
          </Grid>

          <Grid item>
            <Box sx={{
              paddingLeft: "2em",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }} >
              <RepeatButton />
              <IconButton size="large">
                <Icon24SkipBack style={sxStyles.positiveButton} />
              </IconButton>

              <PlayButton />

              <IconButton size="large">
                <Icon24SkipForward style={sxStyles.positiveButton} />
              </IconButton>
              <ShuffleButton />
              <Box sx={{
                position: "absolute",
                right: "1vw",
                bottom: "1.3em",
              }}
              >
                <Slider
                  size={"small"}
                  onChange={volumeChange}
                  value={volume}
                  max={1}
                  step={0.01}
                  orientation="vertical"
                  sx={{
                    height: "75px",
                  }}
                />
                <Icon20VolumeOutline style={{...sxStyles.positiveButton, paddingLeft: "3px"}} />
              </Box>
              {/* <Box sx={{...sxStyles.volumeContainer, marginLeft: "20px"}}>
                


              </Box> */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const PlayerNotAvailable = () => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h5" sx={{ width: "100%", paddingTop: "0.5em" }}>
      Nothing to play
    </Typography>
  </Box>
)

export default Player

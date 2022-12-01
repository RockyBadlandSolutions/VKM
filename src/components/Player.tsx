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
    marginLeft: "1em",
    marginRight: "1em",
    width: "30vw",
    marginTop: "2px",
    color: "#0077ff",
  },
  infoTextContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "1em",
  },

  positiveButton: {
    color: "#0077ff",
    cursor: "pointer",
  },
  loading: {
    marginLeft: "1em",
    marginRight: "1em",
    width: "40vw",
    marginTop: "0.9em",
  },
  functionButtonTopMargin: {
    marginTop: "-3px",
  },
  volume: {
    width: "5vw",
    paddingTop: "19px",
    marginLeft: "3px",
  },
  volumeContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: "3px",
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
      setArtworkURL(currentSong.album?.thumb?.photo_68 as string)
      setDuration(currentSong.duration)
      if (player) {
        player.src = currentSong.url
        play()
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

  const positionChange = (e, val: any) => {
    console.log("positionChange", val)
    updateTime(val)
  }

  const volumeChange = (e, val: any) => {
    updateVolume(val)
    console.log("volumeChange", val)
  }

  const RepeatButton = () => {
    const margin = "0.5em"
    if (repeatMode === 1) {
      return (
        <IconButton
          onClick={onRepeat}
          sx={{
            marginRight: margin,
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
            marginRight: margin,
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
          marginLeft: "0.5em",
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
        <Grid
          container
          spacing={2}
          alignContent="center"
          alignItems={"center"}
          direction="row"
        >
          <Grid item>
            <Avatar
              variant="rounded"
              src={artworkURL}
              sx={{ marginLeft: "1em" }}
            />
          </Grid>
          <Grid item>
            <Box sx={{ width: "7em" }}>
              <Typography variant="subtitle1" noWrap>
                {songName}
              </Typography>

              <Typography variant="subtitle2" noWrap>
                {songArtist}
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box sx={{ marginTop: "0.3em" }}>
              <IconButton size="large">
                <Icon24SkipBack style={sxStyles.positiveButton} />
              </IconButton>

              <PlayButton />

              <IconButton size="large">
                <Icon24SkipForward style={sxStyles.positiveButton} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item>
            <Box sx={{ ...sxStyles.row, marginTop: "0.5em" }}>
              <RepeatButton />

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

              <ShuffleButton />
            </Box>
          </Grid>

          <Grid item>
            <Box sx={sxStyles.volumeContainer}>
              <IconButton disableRipple disabled>
                <Icon20VolumeOutline style={sxStyles.positiveButton} />
              </IconButton>

              <Slider
                sx={sxStyles.volume}
                size={"small"}
                onChange={volumeChange}
                value={volume}
                max={1}
                step={0.1}
              />
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

import { Avatar, IconButton, Slider, Tooltip, Typography, SliderRail, Box } from "@mui/material"
import {
  Icon20VolumeOutline,
  Icon24PauseCircle,
  Icon24PlayCircle,
  Icon24Repeat,
  Icon24RepeatOne,
  Icon24Shuffle,
  Icon24SkipBack,
  Icon24SkipForward,
  Icon56MusicOutline
} from "@vkontakte/icons"
import { useEffect, useState } from "react"
import { Audio as AudioType } from "../API/audio"
import useAudio from "../hooks/useAudio"
import { updatePaused } from "../store/playerStateSlice"
import { useAppDispatch, useAppSelector } from "../store/store"

const sxStyles = {
  trackSlider: {
    color: "#0077ff",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  positiveButton: {
    color: "#0077ff",
    cursor: "pointer",
  },
}

function relativeCoords ( event: any ) {
  const bounds = event.target.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  return {x: x, y: y};
}

const CustomRail = (props: {
  color?: string;
  value: number;
  min?: number;
  max?: number;
}) => {
  let calculatedWidth = (props.value - (props.min || 0)) / (props.max || 100);
  if (calculatedWidth > 1) calculatedWidth = 1;

  return (
    <SliderRail {...props} style={{
      backgroundColor: "#9cc7f7"
    }}
    >
      <div
        style={{
          width: `${calculatedWidth * 100}%`,
          height: "100%",
          backgroundColor: "#0077ff",
          transition: "width 300ms ease-in-out",
        }}
      />
    </SliderRail>
  );
};

function Player() {
  const dispatch = useAppDispatch()
  const currentSong = useAppSelector(
    (state) => state.playerState.currentSong
  ) as AudioType

  const [repeatMode, setRepeatMode] = useState(0)
  const [shuffle, setShuffle] = useState(false)

  const [duration, setDuration] = useState(0)
  const [songName, setSongName] = useState("")
  const [songArtist, setSongArtist] = useState("")
  const [artworkURL, setArtworkURL] = useState("")
  const [seeking, setSeeking] = useState(false)
  const [seekValue, setSeekValue] = useState(0)
  const [bufferedSecs, setBufferedSecs] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipValue, setTooltipValue] = useState(0)
  const [playPromise, setPlayPromise] = useState<Promise<void> | null>(null)
  
  const [
    playing,
    currentTime,
    volume,
    play,
    pause,
    updateTime,
    updateVolume,
    changeSource,
    buffered,
    player,
  ] = useAudio()

  useEffect(() => {
    if (currentSong.title) {
      setSongName(currentSong.title)
      setSongArtist(currentSong.artist)
      setArtworkURL(currentSong.album?.thumb?.photo_1200 as string)
      setDuration(currentSong.duration)
      if (player) {
        player.pause()
        dispatch(updatePaused(true))
        changeSource(currentSong.url)
        setPlayPromise(play())
        dispatch(updatePaused(false))
      }
    }
  }, [currentSong])

  useEffect(() => {
    if (player) {
      if (buffered.length === 0) {
        setBufferedSecs(0)
      } else {
        if (Math.floor(buffered.end(0)) !== bufferedSecs) {
          setBufferedSecs(Math.floor(buffered.end(0)))
        }
      }
    }
  }, [buffered])


  const displayTime = (value: number) => {
    const seconds = Math.floor(value % 60)
    return (
      Math.floor(value / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    )
  }

  const onPause = () => {
    if (playing) {
      if (playPromise !== null) {
        playPromise?.then(_ => {
          console.log("playPromise")
          pause()
          // Automatic playback started!
          // Show playing UI.
        })
          .catch(error => {
            console.log("playPromise error")
            console.log(error)
          // Auto-play was prevented
          // Show paused UI.
          });
      }
      dispatch(updatePaused(true))
    } else {
      play()
    }
    dispatch(updatePaused(false))
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

  const onSliderMouseHover = (event: any) => {
    const { x } = relativeCoords(event);
    if (!showTooltip) {
      setShowTooltip(true)
    }
    setTooltipValue(Math.round(x/event.currentTarget.offsetWidth * duration))
  }

  const positionChange = (e: any, val: any) => {
    console.log("positionChange", val)
    setSeeking(true)
    setSeekValue(val)
  }

  const positionChanged = (e: any, val: any) => {
    console.log("positionChanged", val)
    setSeeking(false)
    updateTime(seekValue)
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
          disableRipple
        >
          <Icon24RepeatOne style={sxStyles.positiveButton} />
        </IconButton>
      )
    } else {
      return (
        <IconButton
          onClick={onRepeat}
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
        disableRipple
      >
        <Icon24Shuffle style={shuffle ? sxStyles.positiveButton : {}} />
      </IconButton>
    )
  }

  const PlayButton = () => {
    if (playing) {
      return (
        <IconButton size="medium" onClick={onPause} disableRipple>
          <Icon24PauseCircle style={sxStyles.positiveButton} />
        </IconButton>
      )
    } else {
      return (
        <IconButton size="medium" onClick={onPause} disableRipple>
          <Icon24PlayCircle style={sxStyles.positiveButton} />
        </IconButton>
      )
    }
  }

  if (!currentSong.title) {
    return <PlayerNotAvailable />
  } else {
    return (
      <Box sx={{ display: "flex" }}>
        <Avatar
          variant="square"
          src={artworkURL ? artworkURL : undefined}
          sx={{
            width: "200px",
            height: "165px",
          }}
        >{
            artworkURL ? "" : <Icon56MusicOutline/>
          }
        </Avatar>

        <Box
          sx={{
            p: 2,
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" noWrap>
            {songName}
          </Typography>

          <Typography variant="subtitle1" noWrap>
            {songArtist}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="overline">
              {displayTime(currentTime)}
            </Typography>
            <Tooltip
              title={displayTime((seeking) ? seekValue : tooltipValue)}
              arrow
              placement="top"
              open={showTooltip}
              followCursor
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >

              {/* Custom track slider with buffer and tooltip */}
              <Slider
                slots={{
                  rail: CustomRail,
                }}
                slotProps={{
                  rail: {
                    //@ts-ignore
                    value: bufferedSecs,
                    max: duration,
                  },
                }}
                max={duration}
                size="small"
                value={(seeking) ? seekValue : currentTime}
                onChange={positionChange}
                sx={sxStyles.trackSlider}
                onChangeCommitted={positionChanged}
                onMouseMove={onSliderMouseHover}
                onMouseLeave={() => setShowTooltip(false)}
              />
            </Tooltip>
            <Typography variant="overline">
              {"−" + displayTime(duration - currentTime)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <RepeatButton />

            <Box>
              <IconButton size="medium">
                <Icon24SkipBack style={sxStyles.positiveButton} />
              </IconButton>

              <PlayButton />

              <IconButton size="medium">
                <Icon24SkipForward style={sxStyles.positiveButton} />
              </IconButton>
            </Box>

            <ShuffleButton />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
              mb: 1,
            }}
          />
          <Icon20VolumeOutline style={sxStyles.positiveButton} />
        </Box>
            
      </Box>
    )
  }
}

const PlayerNotAvailable = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <Typography variant="h5">Nothing to play</Typography>
  </Box>
)


export default Player
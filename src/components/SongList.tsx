import React, { useEffect } from "react"
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material"
import { Icon24Play } from "@vkontakte/icons"
import { useAppSelector, useAppDispatch } from "../store/store"
import { Audio } from "../API/audio"
import useVKAPI from "../hooks/useVKAPI"
import { updateCurrentSong, updatePlaylist } from "../store/playerStateSlice"
import {
  Icon24MusicOutline,
} from "@vkontakte/icons"


function SongList(props : { songs: Audio[], loading: boolean, from: string }) {
  const currentSong = useAppSelector((state) => state.playerState.currentSong) as Audio
  const dispatch = useAppDispatch()
  
  const [api] = useVKAPI();
  const playlist = useAppSelector((state) => state.playerState.playlist)

  const playlistUpd = () => {
    if (api && props.songs.length > 0) {
      if (props.from === playlist?.from) {
        return
      }
      if (props.from === "Recommendations" || props.from === "Current") {
        dispatch(
          updatePlaylist({
            from: props.from,
            music: props.songs,
            displayedPlaylist: props.songs
          })
        )
        return;
      }
      if (props.from === "MyMusic") {
        dispatch(
          updatePlaylist({
            from: props.from,
            music: playlist?.displayedPlaylist,
            displayedPlaylist: playlist?.displayedPlaylist
          })
        )
      }
    }
  }
  useEffect(() => {
    if (api && props.songs.length > 0) {
      if (props.from === playlist?.from) {
        return
      }
      if (props.from === "MyMusic") {
        api.audioGetById(props.songs.map((obj: Audio) => obj.owner_id.toString() + "_" + obj.id.toString()))
          .then((r) => {
            dispatch(
              updatePlaylist({
                ...playlist,
                displayedPlaylist: r
              })
            )
          })
        return;
      }
      dispatch(
        updatePlaylist({
          ...playlist,
          displayedPlaylist: props.songs
        })
      )
    }
  }, [props.from, api, playlist?.from, props.songs])

  const onSongClick = (audio: Audio) => {
    if (props.from !== playlist?.from) {
      playlistUpd()
    }
    dispatch(
      updateCurrentSong(audio)
    )
  }

  return (
    <List sx={currentSong.title ? { maxHeight: "calc(100vh - 160px)" , overflow: "auto" } : { maxHeight: "100vh", overflow: "auto" }}>
      {(props.loading || !playlist?.music) ? (
        <Skeletons />
      ) : (
        playlist?.displayedPlaylist.map((obj: Audio, index: number) => (
          <SongEntity
            audio={obj}
            key={index}
            playing={currentSong.id === obj.id}
            from={props.from}
            onClick={() => onSongClick(obj)}
          />
        ))
      )}
    </List>
  )
}

const SongEntity = (props: { audio: Audio; playing: boolean, from: string, onClick: any }) => {
  return(
    <>
      <ListItem button onClick={() => props.onClick()}>
        {props.playing ? (
          <Avatar sx={{ marginRight: "1em" }}>
            <Icon24Play style={{ color: "#0077ff" }} />
          </Avatar>
        ) : (
          <ListItemAvatar>
            {(props.audio.album?.thumb?.photo_68) ?
              <Avatar src={props.audio.album?.thumb?.photo_68} />
              :
              <Avatar sx={{ marginRight: "1em" }}>
                <Icon24MusicOutline/>
              </Avatar>
            }
          </ListItemAvatar>
        )}
        <ListItemText
          primary={props.audio.title}
          secondary={props.audio.artist}
        />
      </ListItem>
      <Divider />
    </>
  )
}

const Skeletons = () => {
  return (
    <>
      {[...Array(8)].map((_, i: number) => (
        <div key={i}>
          <ListItem>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width={200} />}
              secondary={<Skeleton variant="text" width={200} />}
            />
          </ListItem>
          <Divider />
        </div>
      ))}
    </>
  )
}

export default SongList;

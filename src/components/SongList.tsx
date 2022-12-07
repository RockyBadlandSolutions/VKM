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

  useEffect(() => {
    if (api && props.songs.length > 0) {
      if (props.from === playlist?.from) {
        return
      }
      api.audioGetById(props.songs.map((obj: Audio) => obj.owner_id.toString() + "_" + obj.id.toString()))
        .then((r) => {
          dispatch(
            updatePlaylist({
              from: props.from,
              music: r
            })
          )
        })
    }
  }, [props.from, api, playlist?.from, props.songs])

  const onSongClick = (audio: Audio) => {
    dispatch(
      updateCurrentSong(audio)
    )
  }

  return (
    <List sx={{ maxHeight: "calc(100vh - 160px)", overflow: "auto" }}>
      {(props.loading || !playlist?.music) ? (
        <Skeletons />
      ) : (
        playlist?.music.map((obj: Audio, index: number) => (
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

export default SongList

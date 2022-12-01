import React from "react"
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
import { updateCurrentSong } from "../store/playerStateSlice"


function SongList(props : { songs: Audio[], loading: boolean }) {
  const currentSong = useAppSelector((state) => state.playerState.currentSong) as Audio

  return (
    <List sx={{ maxHeight: "calc(100vh - 8vh)", overflow: "auto" }}>
      {props.loading ? (
        <Skeletons />
      ) : (
        props.songs.map((obj: Audio, index: number) => (
          <SongEntity
            audio={obj}
            key={index}
            playing={currentSong.id === obj.id}
          />
        ))
      )}
    </List>
  )
}

const SongEntity = (props: { audio: Audio; playing: boolean }) => {
  const dispatch = useAppDispatch()
  const [api, _] = useVKAPI();
  const onSongClick = () => {
    if (api) {
      api.audioGetById([props.audio.owner_id.toString() + "_" +props.audio.id.toString()])
        .then((r) => {
          dispatch(updateCurrentSong(r[0]))
        })
    }
  }
  return(
    <>
      <ListItem button onClick={() => onSongClick()}>
        {props.playing ? (
          <Avatar sx={{ marginRight: "1em" }}>
            <Icon24Play style={{ color: "#0077ff" }} />
          </Avatar>
        ) : (
          <ListItemAvatar>
            <Avatar src={props.audio.album?.thumb?.photo_68} />
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

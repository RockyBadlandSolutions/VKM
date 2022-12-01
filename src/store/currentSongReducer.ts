import { AnyAction } from "redux"
import {Audio} from "../API/audio"

const initialState: Audio = {
  access_key: "",
  album: undefined,
  artist: "",
  date: 0,
  duration: 0,
  id: 0,
  is_explicit: false,
  is_focus_track: false,
  is_licensed: false,
  main_artists: undefined,
  owner_id: 0,
  short_videos_allowed: false,
  stories_allowed: false,
  stories_cover_allowed: false,
  title: null,
  track_code: "",
  url: "",
}

export const UPDATE_SONG = "UPDATE_SONG"

export const currentSongReducer = (
  state = initialState,
  action: AnyAction & { payload: Audio }
) => {
  switch (action.type) {
  case UPDATE_SONG:
    return action.payload
  default:
    return state
  }
}

export const updateSongAction = (payload: any) => ({ type: UPDATE_SONG, payload })

import {createSlice} from "@reduxjs/toolkit";
import { Audio } from "../API/audio";

interface playerState {
  currentSong?: Audio
  paused?: boolean,
  playlist?: {
    from: string,
    music: Audio[],
  }
}
const initialState: playerState = {
  currentSong: {
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
  },
  playlist: {
    from: "",
    music: [],
  },
  paused: true
}

export const playerStateSlice = createSlice({
  name: "playerState",
  initialState,
  reducers: {
    updateCurrentSong: (state, action) => {
      state.currentSong = action.payload
    },
    updatePaused: (state, action) => {
      state.paused = action.payload
    },
    updatePlaylist: (state, action) => {
      state.playlist = action.payload
    },
  }
})

export const {updateCurrentSong, updatePaused, updatePlaylist} = playerStateSlice.actions

export default playerStateSlice.reducer
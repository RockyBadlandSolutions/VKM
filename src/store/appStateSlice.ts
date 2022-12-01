import {createSlice} from "@reduxjs/toolkit";

interface appState {
  screen?: string
  logged_in?: boolean,
  search?: string,
}

const initialState = {
  screen: "main",
  logged_in: false,
  search: "",
}

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    updateScreen: (state, action) => {
      state.screen = action.payload
    },
    updateLoggedIn: (state, action) => {
      state.logged_in = action.payload
    },
    updateSearch: (state, action) => {
      state.search = action.payload
    }
  }
})

export const {updateScreen, updateLoggedIn, updateSearch} = appStateSlice.actions

export default appStateSlice.reducer
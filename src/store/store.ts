import { combineReducers, createStore } from "redux"
import { currentSongReducer } from "./currentSongReducer"
import { playerReducer } from "./playerReducer"
import { currentScreenReducer } from "./currentScreenReducer"
import { searchReducer } from "./searchReducer"
import { currentUserReducer } from "./currentUserReducer"

const rootReducer = combineReducers({
  player: playerReducer,
  currentSong: currentSongReducer,
  currentScreen: currentScreenReducer,
  search: searchReducer,
  currentUser: currentUserReducer,
})

export const store = createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

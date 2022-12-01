import { configureStore } from "@reduxjs/toolkit";
import playerStateSlice from "./playerStateSlice";
import appStateSlice from "./appStateSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

const store = configureStore({
  reducer: {
    playerState: playerStateSlice,
    appState: appStateSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;
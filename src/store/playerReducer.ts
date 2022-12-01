import { AnyAction } from "redux"

interface PlayerState {
  paused: boolean
}

const defaultState: PlayerState = {
  paused: false,
}

export const UPDATE_PLAYER = "UPDATE_PLAYER"

export const playerReducer = (
  state = defaultState,
  action: AnyAction & { payload: PlayerState }
) => {
  switch (action.type) {
  case UPDATE_PLAYER:
    return action.payload
  default:
    return state
  }
}

export const updatePlayerAction = (payload: PlayerState) => ({
  type: UPDATE_PLAYER,
  payload,
})

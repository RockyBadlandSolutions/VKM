import { AnyAction } from "redux"

interface CurrentScreenState {
  screen?: string
}

const defaultState: CurrentScreenState = {
  screen: "main",
}

export const UPDATE_SCREEN = "UPDATE_SCREEN"

export const currentScreenReducer = (
  state = defaultState,
  action: AnyAction & { payload: CurrentScreenState }
) => {
  switch (action.type) {
  case UPDATE_SCREEN:
    return action.payload
  default:
    return state
  }
}

export const updateScreenAction = (payload) => ({
  type: UPDATE_SCREEN,
  payload: { screen: payload },
})

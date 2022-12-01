import { AnyAction } from "redux"

interface SearchState {
  value?: string
}

const defaultState: SearchState = {
  value: "",
}

export const SEARCH = "SEARCH"

export const searchReducer = (
  state = defaultState,
  action: AnyAction & { payload: SearchState }
) => {
  switch (action.type) {
  case SEARCH:
    return action.payload
  default:
    return state
  }
}

export const searchAction = (payload) => ({
  type: SEARCH,
  payload: { value: payload },
})

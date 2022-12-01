import { AnyAction } from "redux"

const initialState: any = {
  logged_in: false
}

export const UPDATE_USER_LOGIN = "UPDATE_USER_LOGIN"

export const currentUserReducer = (
  state = initialState,
  action: AnyAction & { payload: any }
) => {
  switch (action.type) {
  case UPDATE_USER_LOGIN:
    state.logged_in = {
      logged_in: action.payload,
    }
    return state
  default:
    return state
  }
}

export const updateUserLoginAction = (payload: any) => ({ type: UPDATE_USER_LOGIN, payload })

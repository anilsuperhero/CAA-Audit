import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function userInfoReducer(
  state = initialState.userAuditorInfo,
  action
) {
  switch (action.type) {
    case types.LOADED_USER_INFO_SUCCESS:
      return action.userAuditorInfo;
    default:
      return state;
  }
}

import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function chatInfoReducer(
  state = initialState.chatInfo,
  action
) {
  switch (action.type) {
    case types.LOADED_CHAT_INFO_SUCCESS:
      return action.chatInfo;
    default:
      return state;
  }
}

import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function notificationDataReducer(
  state = initialState.notificationAuditorList,
  action
) {
  switch (action.type) {
    case types.LOADED_USER_NOTIFICATION_DATA_SUCCESS:
      return action.notificationAuditorList;
    default:
      return state;
  }
}

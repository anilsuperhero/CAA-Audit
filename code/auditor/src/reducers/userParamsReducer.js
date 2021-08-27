import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function userAuditorParamsReducer(
  state = initialState.userAuditorParams,
  action
) {
  switch (action.type) {
    case types.LOADED_USER_PARAM_SUCCESS:
      return action.userAuditorParams;
    default:
      return state;
  }
}

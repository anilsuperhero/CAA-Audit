import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function settingReducer(
  state = initialState.dashboardData,
  action
) {
  switch (action.type) {
    case types.LOADED_DASHBOARD_SUCCESS:
      return action.dashboardData;
    default:
      return state;
  }
}

import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function auditViewParamsReducer(
  state = initialState.isViewType,
  action
) {
  switch (action.type) {
    case types.LOAD_VIEW_TYPE_STATUS:
      return action.isViewType;
    default:
      return state;
  }
}

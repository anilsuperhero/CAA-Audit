import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function preLoaderRequest(
  state = initialState.preLoader,
  action
) {
  switch (action.type) {
    case types.PRE_LOADER_REQUEST_STATUS:
      return action.preLoader;
    default:
      return state;
  }
}

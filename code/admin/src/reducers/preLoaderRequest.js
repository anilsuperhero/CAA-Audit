import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function preLoaderRequest(
  state = initialState.preLoader,
  action
) {
  switch (action.type) {
    case types.SUBMITTING_PRE_LOADER:
      return action.preLoader;
    default:
      return state;
  }
}

import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function auditRequestDataReducer(
  state = initialState.auditRequestData,
  action
) {
  switch (action.type) {
    case types.LOAD_REQUEST_AUDIT_DATA_SUCCESS:
      return action.auditRequestData;
    default:
      return state;
  }
}

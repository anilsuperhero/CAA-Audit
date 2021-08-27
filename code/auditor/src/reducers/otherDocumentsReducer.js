import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function otherDocumentsReducer(
  state = initialState.otherDocumentData,
  action
) {
  switch (action.type) {
    case types.OTHER_DOCUMENTS:
      return action.otherDocumentData;
    default:
      return state;
  }
}

import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function defaultSelectedDocumentReducer(
  state = initialState.defaultSelectedDocument,
  action
) {
  switch (action.type) {
    case types.LOADED_DEFAULT_SELECTED_DOCUMENT_DATA_SUCCESS:
      return action.defaultSelectedDocument;
    default:
      return state;
  }
}

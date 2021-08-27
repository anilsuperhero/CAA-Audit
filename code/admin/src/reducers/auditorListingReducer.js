import * as types from "../actions/actionsTypes";
import initialState from "./initialState";

export default function auditorListingReducer(
  state = initialState.auditorListing,
  action
) {
  switch (action.type) {
    case types.AUDITOR_LISTING_DATA:
      return action.auditorListing;
    default:
      return state;
  }
}

import toasterStatusAction from "./toasterStatusAction";
import dialogStatusAction from "./dialogStatusAction";
import * as types from "./actionsTypes";
import toggleNetworkRequestStatus from "./toggleNetworkRequestStatus";

export const loadToasterData = (data) => async (dispatch) => {
  try {
    dispatch(toasterStatusAction(data));
  } catch (error) {
    throw error;
  }
};

export function loadHeadSuccess(isHead) {
  return { type: types.TABLE_HEAD_REQUEST_STATUS, isHead };
}

export const loadTableHeader = (params) => async (dispatch) => {
  try {
    dispatch(loadHeadSuccess(params));
  } catch (error) {
    throw error;
  }
};

export const loadDialogData = (data) => async (dispatch) => {
  try {
    dispatch(dialogStatusAction(data));
  } catch (error) {
    throw error;
  }
};

export const showLoader = () => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
  } catch (error) {
    throw error;
  }
};

export function loadViewSuccess(isViewType) {
  return { type: types.LOAD_VIEW_TYPE_STATUS, isViewType };
}

export const loadViewAction = (data) => async (dispatch) => {
  try {
    dispatch(loadViewSuccess(data));
  } catch (error) {
    throw error;
  }
};

import * as types from "./actionsTypes";
import toasterStatusAction from "./toasterStatusAction";
import toggleNetworkRequestStatus from "./toggleNetworkRequestStatus";

export function loadDataSuccess(chatInfo) {
  return { type: types.LOADED_CHAT_INFO_SUCCESS, chatInfo };
}

export const setChatInfo = (data) => async (dispatch) => {
  try {
    dispatch(loadDataSuccess(data));
  } catch (error) {
    dispatch(toggleNetworkRequestStatus(false));
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
  }
};

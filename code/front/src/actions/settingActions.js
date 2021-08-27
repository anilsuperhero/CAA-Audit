import * as types from "./actionsTypes";
import { agent } from "../utils/agent";
import * as API from "../utils/apiPath";
import toasterStatusAction from "./toasterStatusAction";

export function loadDataSuccess(setting) {
  return { type: types.LOADED_SETTING_INFO_SUCCESS, setting };
}

export const getSettingData = () => async (dispatch) => {
  try {
    const response = await agent.get(API.SETTING);
    dispatch(loadDataSuccess(response.data.data));
  } catch (error) {
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
  }
};

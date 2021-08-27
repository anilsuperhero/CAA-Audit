import * as types from "./actionsTypes";
import submittingRequestStatus from "./submittingRequestStatusAction";
import toggleNetworkRequestStatus from "./toggleNetworkRequestStatus";
import * as API from "../utils/apiPath";
import { agent } from "../utils/agent";
import toasterStatusAction from "./toasterStatusAction";
import preLoaderAction from "./preLoaderAction";

export function ParamsDataSuccess(userAuditorParams) {
  return { type: types.LOADED_USER_PARAM_SUCCESS, userAuditorParams };
}

export function loginDataSuccess(userAuditorInfo) {
  return { type: types.LOADED_USER_INFO_SUCCESS, userAuditorInfo };
}

export function loadUserAuth(isAuditorAuth) {
  return { type: types.LOADED_USER_AUTH_SUCCESS, isAuditorAuth };
}

export function userLoginData(params, push) {
  return async (dispatch) => {
    dispatch(submittingRequestStatus(true));
    await agent
      .post(API.LOGIN, params)
      .then((response) => {
        dispatch(
          toasterStatusAction({ open: true, message: response.data.message })
        );
        dispatch(submittingRequestStatus(false));
        dispatch(loginDataSuccess(response.data.data));
        dispatch(loadUserAuth(true));
        localStorage.setItem("userAuditorInfo", response.data.data.api_token);
        if (params.remember_me) {
          dispatch(ParamsDataSuccess(params));
        } else {
          dispatch(ParamsDataSuccess({}));
        }
        push("/audit-request");
      })
      .catch((error) => {
        dispatch(
          toasterStatusAction({
            open: true,
            message: error.message,
            severity: "error",
          })
        );
        dispatch(submittingRequestStatus(false));
      });
  };
}

export function userLogout(push) {
  return (dispatch) => {
    dispatch(loadUserAuth(false));
    dispatch(loginDataSuccess({}));
    localStorage.removeItem("userAuditorInfo");
    push("/");
  };
}

export function resendOtp(params) {
  return async (dispatch) => {
    dispatch(toggleNetworkRequestStatus(true));
    await agent
      .post(API.SEND_OTP, params)
      .then(() => {
        dispatch(toggleNetworkRequestStatus(false));
      })
      .catch((error) => {
        dispatch(
          toasterStatusAction({
            open: true,
            message: error.message,
            severity: "error",
          })
        );
        dispatch(toggleNetworkRequestStatus(false));
      });
  };
}

export function checkOtp(params, push) {
  return async (dispatch) => {
    dispatch(submittingRequestStatus(true));
    await agent
      .post(API.CHECK_OTP, params)
      .then((response) => {
        dispatch(submittingRequestStatus(false));
        dispatch(loginDataSuccess(response.data.data));
        dispatch(loadUserAuth(true));
        localStorage.setItem("userToken", response.data.data.api_token);
        push("/user/dashboard");
      })
      .catch((error) => {
        dispatch(
          toasterStatusAction({
            open: true,
            message: error.message,
            severity: "error",
          })
        );
        dispatch(submittingRequestStatus(false));
      });
  };
}

export function forgotPassword(params, push) {
  return async (dispatch) => {
    dispatch(submittingRequestStatus(true));
    await agent
      .post(API.FORGOT_PASSWORD, params)
      .then((response) => {
        dispatch(
          toasterStatusAction({ open: true, message: response.data.message })
        );
        dispatch(submittingRequestStatus(false));
        dispatch(ParamsDataSuccess(params));
        push("/reset-password");
      })
      .catch((error) => {
        dispatch(
          toasterStatusAction({
            open: true,
            message: error.message,
            severity: "error",
          })
        );
        dispatch(submittingRequestStatus(false));
      });
  };
}

export function resendOtpPassword(params) {
  return async (dispatch) => {
    dispatch(toggleNetworkRequestStatus(true));
    await agent
      .post(API.FORGOT_PASSWORD, params)
      .then((response) => {
        dispatch(
          toasterStatusAction({ open: true, message: response.data.message })
        );
        dispatch(toggleNetworkRequestStatus(false));
      })
      .catch((error) => {
        dispatch(
          toasterStatusAction({
            open: true,
            message: error.message,
            severity: "error",
          })
        );
        dispatch(toggleNetworkRequestStatus(false));
      });
  };
}

export function resetPassword(params, push) {
  return async (dispatch) => {
    dispatch(submittingRequestStatus(true));
    await agent
      .post(API.RESET_PASSWORD, params)
      .then((response) => {
        dispatch(
          toasterStatusAction({ open: true, message: response.data.message })
        );
        dispatch(submittingRequestStatus(false));
        dispatch(loginDataSuccess({}));
        push("/");
      })
      .catch((error) => {
        dispatch(
          toasterStatusAction({
            open: true,
            message: error.message,
            severity: "error",
          })
        );
        dispatch(submittingRequestStatus(false));
      });
  };
}

export const updateProfileData = (params) => async (dispatch) => {
  try {
    dispatch(submittingRequestStatus(true));
    const response = await agent.post(API.UPDATE_PROFILE, params);
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    dispatch(loginDataSuccess(response.data.data));
  } catch (error) {
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
  }
};

export const updatePasswordData = (params) => async (dispatch) => {
  try {
    dispatch(submittingRequestStatus(true));
    const response = await agent.put(API.UPDATE_PASSWORD, params);
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
  } catch (error) {
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
  }
};

export function LoadDashboardData(dashboardData) {
  return { type: types.LOADED_DASHBOARD_SUCCESS, dashboardData };
}

export const getDashboard = () => async (dispatch) => {
  try {
    dispatch(preLoaderAction(false));
    const response = await agent.get(API.GET_DASHBOARD_DATA);
    dispatch(LoadDashboardData(response.data.data));
    setTimeout(function () {
      dispatch(preLoaderAction(true));
    }, 500);
  } catch (error) {
    setTimeout(function () {
      dispatch(preLoaderAction(true));
    }, 500);
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
  }
};

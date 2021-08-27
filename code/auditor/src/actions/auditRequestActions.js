import { agent } from "../utils/agent";
import * as API from "../utils/apiPath";
import toasterStatusAction from "./toasterStatusAction";
import toggleNetworkRequestStatus from "./toggleNetworkRequestStatus";
import * as types from "./actionsTypes";
import preLoaderAction from "./preLoaderAction";
import { downloadFile } from "../utils/helpers";

export function loadDataSuccess(auditData) {
  return { type: types.LOADED_AUDIT_DATA_SUCCESS, auditData };
}

export function loadNotFoundDataSuccess(isData) {
  return { type: types.LOADED_DATA_SUCCESS, isData };
}

export function loadPaginationDataSuccess(pagination) {
  return { type: types.LOAD_PAGINATION_DATA_SUCCESS, pagination };
}

export const loadData = (request) => async (dispatch) => {
  try {
    if (Object.keys(request).length === 0) {
      dispatch(preLoaderAction(false));
    }
    const response = await agent.get(API.LOAD_AUDIT_REQUEST, {
      params: request,
    });
    if (response.data.data.data.length <= 0) {
      dispatch(loadNotFoundDataSuccess(false));
    } else {
      dispatch(loadNotFoundDataSuccess(true));
    }
    if (Object.keys(request).length !== 0) {
      dispatch(loadNotFoundDataSuccess(true));
    }
    if (response.data.data.data) {
      dispatch(loadDataSuccess(response.data.data.data));
      dispatch(loadPaginationDataSuccess(response.data.data.pagination));
    }
    setTimeout(function () {
      dispatch(preLoaderAction(true));
    }, 500);
  } catch (error) {
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
    dispatch(loadNotFoundDataSuccess(false));
    setTimeout(function () {
      dispatch(preLoaderAction(true));
    }, 500);
  }
};

export const updateRequestData = (params) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    var response = await agent.post(API.UPDATE_AUDIT_REQUEST, params);
    loadData({ type: 1 })(dispatch);
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    dispatch(toggleNetworkRequestStatus(false));
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

export const uploadReport = (params, handleClose) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.post(API.UPLOAD_REPORT, params);
    loadData({ type: 1 })(dispatch);
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    handleClose();
    dispatch(toggleNetworkRequestStatus(false));
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

export const DownloadPersonnel = (params) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.get(API.DOWNLOAD_KEY_PERSONNEL, {
      params: params,
    });
    downloadFile(response.data.data.file, response.data.data.name);
    dispatch(toggleNetworkRequestStatus(false));
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

export const uploadNewReport = (params, handleClose) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.post(API.UPLOAD_REPORT_NEW, params);
    loadData({ type: 1 })(dispatch);
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    handleClose();
    dispatch(toggleNetworkRequestStatus(false));
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

export const documentRequest = (params) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.get(API.DOCUMENT_REQUEST, {
      params: params,
    });
    loadData({ type: 1 })(dispatch);
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    dispatch(toggleNetworkRequestStatus(false));
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

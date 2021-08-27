import { agent } from "../utils/agent";
import * as API from "../utils/apiPath";
import * as types from "./actionsTypes";
import toasterStatusAction from "./toasterStatusAction";
import submittingRequestStatus from "./submittingRequestStatusAction";

export function loadDataSuccess(otherDocumentData) {
  return { type: types.OTHER_DOCUMENTS, otherDocumentData };
}

export function loadNotFoundDataSuccess(isData) {
  return { type: types.LOADED_DATA_SUCCESS, isData };
}

export function loadPaginationDataSuccess(pagination) {
  return { type: types.LOAD_PAGINATION_DATA_SUCCESS, pagination };
}

export const loadData = (request) => async (dispatch) => {
  try {
    const response = await agent.get(API.OTHER_DOCUMENTS, {
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
    if (
      request.audit_id &&
      Object.keys(request).length === 1 &&
      response.data.data.data.length === 0
    ) {
      dispatch(loadNotFoundDataSuccess(false));
    }
    if (response.data.data.data) {
      dispatch(loadDataSuccess(response.data.data.data));
      dispatch(loadPaginationDataSuccess(response.data.data.pagination));
    }
  } catch (error) {
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
    dispatch(loadNotFoundDataSuccess(false));
  }
};

export const createDocument =
  (params, handleClose, slug) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.OTHER_DOCUMENTS, params);
      dispatch(submittingRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
      dispatch(loadData({ audit_id: slug }));
      handleClose(false);
    } catch (error) {
      dispatch(
        toasterStatusAction({
          open: true,
          message: error.message,
          severity: "error",
        })
      );
      dispatch(submittingRequestStatus(false));
    }
  };

export const deleteData = (params, slug) => async (dispatch) => {
  try {
    var response = await agent.delete(API.OTHER_DOCUMENTS + "?id=" + params);
    loadData({ audit_id: slug })(dispatch);
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
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

export const updateData = (params, handleClose, slug) => async (dispatch) => {
  try {
    dispatch(submittingRequestStatus(true));
    const response = await agent.post(API.OTHER_DOCUMENTS + "/update", params);
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    dispatch(loadData({ audit_id: slug }));
    handleClose(false);
  } catch (error) {
    dispatch(
      toasterStatusAction({
        open: true,
        message: error.message,
        severity: "error",
      })
    );
    dispatch(submittingRequestStatus(false));
  }
};

export const auditDocumentSubmit = (slug) => async (dispatch) => {
  try {
    var response = await agent.get(API.SUBMIT_OTHER_DOCUMENT + "?id=" + slug);
    window.location = "/audit-request";
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
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

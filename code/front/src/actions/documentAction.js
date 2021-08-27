import { agent } from "../utils/agent";
import * as API from "../utils/apiPath";
import * as types from "./actionsTypes";
import toasterStatusAction from "./toasterStatusAction";
import toggleNetworkRequestStatus from "./toggleNetworkRequestStatus";
import submittingRequestStatus from "./submittingRequestStatusAction";

export function loadDataSuccess(auditRequestData) {
  return { type: types.LOAD_REQUEST_AUDIT_DATA_SUCCESS, auditRequestData };
}

export const loadAuditRequest = (request) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.get(API.LOAD_AUDIT_REQUEST_DATA, {
      params: request,
    });
    dispatch(loadDataSuccess(response.data.data));
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

export const addKeyStaffRequest = (request, pageReload) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    await agent.get(API.LOAD_AUDIT_REQUEST_KEY_STAFF_DATA, {
      params: request,
    });
    dispatch(toggleNetworkRequestStatus(false));
    pageReload();
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

export const updateAuditRequest = (request) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.get(API.LOAD_AUDIT_REQUEST_KEY_STAFF_DATA, {
      params: request,
    });
    dispatch(loadDataSuccess(response.data.data));
    dispatch(toggleNetworkRequestStatus(false));
    window.location.reload();
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

export const primaryDocument = (request, closeModel) => async (dispatch) => {
  try {
    dispatch(submittingRequestStatus(true));
    const response = await agent.post(API.UPDATE_PRIMARY_DOCUMENT, request);
    dispatch(loadAuditRequest({ slug: response.data.data.slug }));
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    closeModel();
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

export const getDocumentData = (request, getDocument) => async (dispatch) => {
  try {
    const response = await agent.post(API.LOAD_DOCUMENT_DATA, request);
    getDocument(response.data.data);
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

export const multiDocumentUpload =
  (request, setSelectedDocument) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.UPDATE_MULTI_DOCUMENT, request);
      setSelectedDocument();
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

export const getMultiDocument =
  (request, setSelectedDocument) => async (dispatch) => {
    try {
      const response = await agent.post(
        API.LOAD_DOCUMENT_DATA_SECONDARY,
        request
      );
      setSelectedDocument(response.data.data);
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

export const updateDocument =
  (request, setSelectedDocument) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.UPDATE_DOCUMENT, request);
      setSelectedDocument();
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

export const deleteDocument =
  (request, setSelectedDocument) => async (dispatch) => {
    try {
      dispatch(toggleNetworkRequestStatus(true));
      const response = await agent.post(API.DELETE_DOCUMENT, request);
      setSelectedDocument();
      dispatch(toggleNetworkRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
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

export const updateDocumentStatus = (request, setOpen) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.post(API.UPDATE_DOCUMENT_STATUS, request);
    dispatch(loadAuditRequest({ slug: response.data.data.slug }));
    dispatch(toggleNetworkRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    setOpen(false);
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

export const singleDocument =
  (request, closeModel, type) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.UPDATE_SINGLE_DOCUMENT, request);
      if (type === "SINGLE" || type === "SINGLE-STAFF") {
        dispatch(loadAuditRequest({ slug: response.data.data.slug }));
      }
      dispatch(submittingRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
      closeModel();
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

export const submitRequest =
  (request, handleConformation) => async (dispatch) => {
    try {
      dispatch(toggleNetworkRequestStatus(true));
      const response = await agent.post(
        API.SUBMIT_DOCUMENT_AUDIT_REQUEST,
        request
      );
      dispatch(toggleNetworkRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
      handleConformation();
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

export const submitMultiDocument =
  (request, closeModel, type) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.SUBMIT_MULTI_DOCUMENT, request);
      dispatch(loadAuditRequest({ slug: response.data.data.slug }));
      dispatch(submittingRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
      closeModel();
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

export const singleDocumentUpload =
  (request, closeModel, type, updateRequest, setOpen) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.UPDATE_SINGLE_DOCUMENT, request);
      if (type === "SINGLE" || type === "SINGLE-STAFF") {
        dispatch(loadAuditRequest({ slug: response.data.data.slug }));
      }
      dispatch(submittingRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
      dispatch(updateDocumentStatus(updateRequest, setOpen));
      closeModel();
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

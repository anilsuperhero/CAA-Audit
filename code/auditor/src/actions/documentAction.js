import { agent } from "../utils/agent";
import { downloadFile } from "../utils/helpers";
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

export const getAllDocumentData = (request) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.post(API.DOWNLOAD_DOCUMENT_LIST, request);
    if (response.data.data.folderName) {
      if (response.data.data.folderName) {
        setTimeout(function () {
          dispatch(toggleNetworkRequestStatus(false));
        }, 5000);
        const responseData = await getFile(response.data.data.folderName);
        downloadFile(
          responseData.data.data.url,
          responseData.data.data.fileName
        );
      }
    }
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

export const getDownloadMultiDocument = (request) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.post(
      API.DOWNLOAD_DOCUMENT_DATA_SECONDARY,
      request
    );
    if (response.data.data.folderName) {
      setTimeout(function () {
        dispatch(toggleNetworkRequestStatus(false));
      }, 5000);
      const responseData = await getFile(response.data.data.folderName);
      downloadFile(responseData.data.data.url, responseData.data.data.fileName);
    }
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

const getFile = (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responseData = agent.post(API.DOWNLOAD_ZIP, {
        folderName: name,
      });
      resolve(responseData);
    }, 5000);
  });
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

export const submitRequest = (request) => async (dispatch) => {
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

export const getReportReject = (request, setList) => async (dispatch) => {
  try {
    dispatch(toggleNetworkRequestStatus(true));
    const response = await agent.get(API.GET_DOCUMENT_REJECT, {
      params: request,
    });
    setList(response.data.data);
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

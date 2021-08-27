import * as types from "./actionsTypes";
import { agent } from "../utils/agent";
import * as API from "../utils/apiPath";
import toasterStatusAction from "./tosterStatusAction";
import preLoaderAction from "./preLoaderAction";
import submittingRequestStatus from "./submittingRequestStatusAction";

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
    const response = await agent.get(API.LOAD_AUDIT_REQUEST_LIST, {
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

export const uploadSlaDocument =
  (request, closeSpinner, handleClose) => async (dispatch) => {
    try {
      const response = await agent.post(API.UPLOAD_SLA_DOCUMENT, request);
      loadData({ type: 1 })(dispatch);
      closeSpinner();
      handleClose();
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
      closeSpinner();
    }
  };

export function loadRegistrationDataSuccess(registrationGroupList) {
  return {
    type: types.LOADED_REGISTRATION_GROUP_LIST_SUCCESS,
    registrationGroupList,
  };
}

export function loadCompanyListDataSuccess(companyList) {
  return {
    type: types.LOADED_COMPANY_LIST_SUCCESS,
    companyList,
  };
}

export function loadDocumentListDataSuccess(documentList) {
  return {
    type: types.LOADED_DOCUMENT_List_SUCCESS,
    documentList,
  };
}

export function loadSelectedDocumentDataSuccess(defaultSelectedDocument) {
  return {
    type: types.LOADED_DEFAULT_SELECTED_DOCUMENT_DATA_SUCCESS,
    defaultSelectedDocument,
  };
}

export const loadRegistrationGroupData = (auditType) => async (dispatch) => {
  try {
    dispatch(loadRegistrationDataSuccess([]));
    dispatch(loadCompanyListDataSuccess({}));
    dispatch(loadDocumentListDataSuccess([]));
    dispatch(loadSelectedDocumentDataSuccess([]));
    const response = await agent.get(API.LOAD_REGISTRATION_GROUP_REQUEST, {
      params: auditType,
    });
    dispatch(loadRegistrationDataSuccess(response.data.data.registration));
    dispatch(loadCompanyListDataSuccess(response.data.data));
    dispatch(loadDocumentListDataSuccess(response.data.data.documentType));
    dispatch(
      loadSelectedDocumentDataSuccess(response.data.data.selectedDocument)
    );
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

export const createRequestData =
  (params, goToPreviousPath) => async (dispatch) => {
    try {
      dispatch(submittingRequestStatus(true));
      const response = await agent.post(API.LOAD_AUDIT_REQUEST, params);
      dispatch(submittingRequestStatus(false));
      dispatch(
        toasterStatusAction({ open: true, message: response.data.message })
      );
      loadData({ type: 1 })(dispatch);

      goToPreviousPath();
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

export const assignAuditor = (params, handleClose) => async (dispatch) => {
  try {
    dispatch(submittingRequestStatus(true));
    const response = await agent.post(API.ASSIGN_AUDIT_REQUEST, params);
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    loadData({ type: 1 })(dispatch);
    handleClose();
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

export const updateRequestData = (params) => async (dispatch) => {
  try {
    dispatch(submittingRequestStatus(true));
    const response = await agent.post(API.UPDATE_AUDIT_REQUEST, params);
    dispatch(submittingRequestStatus(false));
    dispatch(
      toasterStatusAction({ open: true, message: response.data.message })
    );
    loadData({ type: 1 })(dispatch);
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

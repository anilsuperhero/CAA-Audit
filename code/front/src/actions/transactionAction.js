import { agent } from "../utils/agent";
import * as API from "../utils/apiPath";
import * as types from "./actionsTypes";
import toasterStatusAction from "./toasterStatusAction";
import preLoaderAction from "./preLoaderAction";

export function loadDataSuccess(transactionData) {
  return { type: types.LOAD_TRANSACTION_DATA_SUCCESS, transactionData };
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
    const response = await agent.get(API.LOAD_TRANSACTION, {
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

import { combineReducers } from "redux";

import initialState from "./initialState";
import isAuditorAuth from "./isAuthRequest";
import isSubmitting from "./isSubmittingRequest";
import isFetching from "./networkRequest";
import userAuditorInfo from "./userInfoReducer";
import setting from "./settingReducer";
import homePageData from "./homePageReducers";
import pageData from "./pageReducers";
import userAuditorParams from "./userParamsReducer";
import faqData from "./faqDataReducer";
import toaster from "./toasterReducer";
import pagination from "./paginationReducers";
import isData from "./isDataRequest";
import isHead from "./isHeadRequest";
import dialogOpen from "./dialogOpenReducer";
import notificationAuditorCount from "./notificationCountReducer";
import notificationAuditorList from "./notificationDataReducer";
import auditData from "./auditDataReducer";
import auditRequestData from "./auditRequestDataReducer";
import otherDocumentData from "./otherDocumentsReducer";
import chatInfo from "./chatInfoReducer";
import preLoader from "./preLoaderRequest";
import dashboardData from "./dashboardReducer";
import isViewType from "./auditViewParamsReducer";

const rootReducer = combineReducers({
  isAuditorAuth,
  isSubmitting,
  isFetching,
  userAuditorInfo,
  setting,
  homePageData,
  pageData,
  userAuditorParams,
  faqData,
  toaster,
  pagination,
  isData,
  isHead,
  dialogOpen,
  notificationAuditorCount,
  notificationAuditorList,
  auditData,
  auditRequestData,
  otherDocumentData,
  chatInfo,
  preLoader,
  dashboardData,
  isViewType,
});

export default function combinedRootReducer(state, action) {
  return action.type === "LOG_OUT"
    ? rootReducer(initialState, action)
    : rootReducer(state, action);
}

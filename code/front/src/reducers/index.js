import { combineReducers } from "redux";

import initialState from "./initialState";
import isAuth from "./isAuthRequest";
import isSubmitting from "./isSubmittingRequest";
import isFetching from "./networkRequest";
import userInfo from "./userInfoReducer";
import setting from "./settingReducer";
import homePageData from "./homePageReducers";
import pageData from "./pageReducers";
import userParams from "./userParamsReducer";
import faqData from "./faqDataReducer";
import toaster from "./toasterReducer";
import pagination from "./paginationReducers";
import keyPerson from "./keyPersonReducer";
import isData from "./isDataRequest";
import isHead from "./isHeadRequest";
import dialogOpen from "./dialogOpenReducer";
import notificationCount from "./notificationCountReducer";
import notificationList from "./notificationDataReducer";
import auditData from "./auditDataReducer";
import registrationGroup from "./registrationGroupReducer";
import transactionData from "./transactionReducer";
import auditRequestData from "./auditRequestDataReducer";
import auditorData from "./auditorDataReducer";
import otherDocumentData from "./otherDocumentsReducer";
import chatInfo from "./chatInfoReducer";
import preLoader from "./preLoaderRequest";
import dashboardData from "./dashboardReducer";
import isViewType from "./auditViewParamsReducer";

const rootReducer = combineReducers({
  isAuth,
  isSubmitting,
  isFetching,
  userInfo,
  setting,
  homePageData,
  pageData,
  userParams,
  faqData,
  toaster,
  pagination,
  keyPerson,
  isData,
  isHead,
  dialogOpen,
  notificationCount,
  notificationList,
  auditData,
  registrationGroup,
  transactionData,
  auditRequestData,
  auditorData,
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

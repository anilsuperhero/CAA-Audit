import * as types from "./actionsTypes";

// action creator
const preLoaderAction = (preLoader) => ({
  type: types.PRE_LOADER_REQUEST_STATUS,
  preLoader,
});

export default preLoaderAction;

import * as types from "./actionsTypes";

// action creator
const preLoaderAction = (preLoader) => ({
  type: types.SUBMITTING_PRE_LOADER,
  preLoader,
});

export default preLoaderAction;

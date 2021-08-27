import React, { useEffect, Suspense } from "react";
import { getSettingData } from "../actions/settingActions";
import { getNotification } from "../actions/notificationActions";
import { useSelector, useDispatch } from "react-redux";
import ScrollToTop from "../Component/ScrollToTop";
import Loading from "../Component/Loader";
import Spinner from "../Component/Spinner";
import Toaster from "../Component/Alert";
import "./../assets/css/style.css";
import "./../assets/css/media.css";
import "./../assets/css/developer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Page from "../Pages";

const App = () => {
  const dispatch = useDispatch();
  const { isAuditorAuth, isFetching } = useSelector((state) => ({
    isAuditorAuth: state.isAuditorAuth,
    isFetching: state.isFetching,
  }));

  useEffect(() => {
    const fetchData = () => {
      dispatch(getSettingData());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = () => {
      dispatch(getNotification());
    };
    if (isAuditorAuth) {
      fetchData();
    }
  }, [dispatch, isAuditorAuth]);

  return (
    <>
      <Toaster />
      <Suspense fallback={<Spinner />}>
        {isFetching && <Loading />}
        <ScrollToTop />
        <Page isAuditorAuth={isAuditorAuth} />
      </Suspense>
    </>
  );
};

export default App;

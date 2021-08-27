import React, { Fragment, useEffect, useState } from "react";
import { Container, Button } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setChatInfo } from "../../actions/chatInfoActions";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_CONFIG_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_CONFIG_APPID,
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const firestore = firebase.firestore();

const Footer = () => {
  const { setting } = useSelector((state) => ({
    setting: state.setting,
  }));

  var { audit_number } = useParams();

  const dispatch = useDispatch();

  const [bindListner, setBindListner] = useState(false);
  const user = useSelector((state) => state.userAuditorInfo); // userAuditorInfo

  useEffect(() => {
    setBindListner(true);
    if (window.chatBind) {
      window.chatBind();
    }
    if (window.notification) {
      window.notification();
    }
    if (bindListner) {
      const messagesRef2 = firestore.collection("notification_" + user._id);

      window.notification = messagesRef2.onSnapshot((querySnapshot) => {
        var cities = [];
        querySnapshot.forEach((doc) => {
          cities.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setChatInfo(cities));
      });

      // delete notification if chat is opened already.
      const messagesRef3 = firestore
        .collection("notification_" + user._id)
        .doc(audit_number);
      window.chatBind = messagesRef3.onSnapshot((doc) => {
        messagesRef3.delete();
      });
    }
  }, [bindListner, audit_number, user._id, dispatch]);

  firebase.app().auth().signInAnonymously();
  function closeSidebar() {
    document.getElementById("onscroll").classList.remove("showsidebar");
  }
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div onClick={closeSidebar} className="overlay-blr"></div>
      <button id="gototop" title="Go to top" className="top-link-btn">
        <i className="fas fa-chevron-up"></i>
      </button>

      <footer className=" ">
        <Container fixed>
          <div className="footer-contant">
            <div className="copyright white-text">
              ©&nbsp;{new Date().getFullYear()}&nbsp;-&nbsp;
              <Link to="/" className="white-text">
                {setting.name}
              </Link>
              &nbsp; All rights reserved.
            </div>
          </div>
        </Container>
        <Button className="btn btn-primary top-scroll" onClick={scrollToTop}>
          <i className="fas fa-chevron-up"></i>Back to top
        </Button>
      </footer>
    </>
  );
};

export default Footer;

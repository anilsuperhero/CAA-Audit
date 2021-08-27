import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../Component/Breadcrumb";
import { useParams } from "react-router-dom";
import { downloadFile } from "../../utils/helpers";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import { loadAuditRequest } from "../../actions/documentAction";
import { loadDialogData } from "../../actions/baseActions";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import Delete from "../../Component/Delete";

import { useCollectionData } from "react-firebase-hooks/firestore";

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
const storageRef = firebase.storage();
const firestore = firebase.firestore();

function Index(props) {
  let { slug, audit_number } = useParams();

  firebase.app().auth().signInAnonymously();
  const dispatch = useDispatch();
  const { auditRequestData, dialogOpen, setting } = useSelector((state) => ({
    auditRequestData: state.auditRequestData,
    dialogOpen: state.dialogOpen,
    setting: state.setting,
  }));

  useEffect(() => {
    const fetchData = () => {
      dispatch(loadAuditRequest({ slug: slug }));
    };
    fetchData();
  }, [dispatch, slug]);

  const user = useSelector((state) => state.userAuditorInfo); // userAuditorInfo
  const messagesRef = firestore.collection("messages_" + audit_number);
  const query = messagesRef.orderBy("createdAt", "asc").limit(10000);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const [dialog, setDialog] = useState({});
  const [chooseFile, setFileData] = useState({});

  function uploadFile(file) {
    return new Promise(function (resolve, reject) {
      var fileId = "";
      const uploadTask = storageRef
        .ref("All_Files/" + audit_number + "/")
        .child(file.name)
        .put(file);
      uploadTask.on(
        "state_changed",
        async (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          if (progress === 0) {
            fileId = await messagesRef.add({
              text: "https://www.google.com/images/spin-32.gif",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid: user._id,
              sender: user.first_name + " " + user.last_name,
              type: "attach",
              fileName: file.name,
            });
          }
        },
        (error) => {
          console.log("error:-", error);
          reject(0);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            var docRef = firestore
              .collection("messages_" + audit_number)
              .doc(fileId.id);
            await docRef.update({
              text: downloadURL.toString(),
            });

            return resolve(1);
          });
        }
      );
    });
  }

  const fileUpload = (e) => {
    setFileData(e.target.files);
    var data = {};
    data.message = setting.chat_document;
    data.title = "";
    data.dialogTitle = "Document Upload";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    var text = formValue;
    setFormValue("");
    if (text === "") return false;
    await messagesRef.add({
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: user._id,
      sender: user.first_name + " " + user.last_name,
      type: "",
      fileName: "",
    });
    if (auditRequestData && auditRequestData.audit_number) {
      const messagesRef2 = firestore.collection(
        "notification_" + auditRequestData.company_id._id
      );
      const increment = firebase.firestore.FieldValue.increment(1);
      if (auditRequestData.audit_number) {
        await messagesRef2
          .doc(auditRequestData.audit_number)
          .set(
            { count: increment, slug: auditRequestData._id },
            { merge: true }
          );
      }
    }
  };

  const handleDeleteClick = (data) => {
    var notificationData = {};
    notificationData.open = false;
    setDialog(notificationData);
    dispatch(loadDialogData(false));
    if (data.action) {
      for (var i = 0; i < chooseFile.length; i++) {
        const file = chooseFile[i];
        uploadFile(file);
      }
    }
  };

  return (
    <Fragment>
      <Breadcrumb {...props} />
      <div className="right-contant">
        {auditRequestData && auditRequestData.title && (
          <h3 className="page-sm-title pb-1">
            {auditRequestData.title}&nbsp;(
            {auditRequestData.company_id.company_name})
          </h3>
        )}
        <ScrollToBottom
          className="ChatContent"
          followButtonClassName="followbtn"
          scrollViewClassName="chat-outerbx"
        >
          {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} user={user} />
            ))}
        </ScrollToBottom>

        <form onSubmit={sendMessage} className="chatform">
          <div className="chat-form-group">
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Type a message"
            />
          </div>
          <div className="choose-file" style={{ width: "100px" }}>
            <i className="fa fa-paperclip"></i>
            <input
              id="icon-button-file"
              onChange={fileUpload}
              type="file"
              accept=".png, .jpg, .jpeg, .pdf"
            />
          </div>
        </form>
      </div>
      {dialogOpen && (
        <Delete dialog={dialog} handleDeleteClick={handleDeleteClick} />
      )}
    </Fragment>
  );
}

function ChatMessage(props) {
  const { text, uid, type, sender, fileName, createdAt } = props.message;

  if (type === "attach") {
    var messageClass =
      uid === props.user._id ? "sent hasAttach" : "received hasAttach";
  } else {
    messageClass = uid === props.user._id ? "sent" : "received";
  }

  return (
    <>
      <div className="message-list">
        <div className={`message ${messageClass}`}>
          {type === "attach" ? (
            text === "https://www.google.com/images/spin-32.gif" ? (
              <>
                <img
                  src={"https://www.google.com/images/spin-32.gif"}
                  alt="loader"
                />
              </>
            ) : (
              <span
                style={{ color: "#fff" }}
                onClick={() => downloadFile(text, fileName)}
              >
                <i className="fa fa-paperclip"></i>
              </span>
            )
          ) : (
            <p>{text}</p>
          )}

          {uid !== props.user._id && <p className="sendername">{sender}</p>}

          {createdAt && (
            <div className="dateandtime">
              {" "}
              {new Date(createdAt.seconds * 1000).toLocaleDateString(
                "en-AU"
              )}{" "}
              <span>
                {new Date(createdAt.seconds * 1000).toLocaleTimeString("en-AU")}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;

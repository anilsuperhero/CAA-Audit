import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../Component/Breadcrumb";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import { downloadFile } from "../../utils/helpers";
import Delete from "../../Component/Delete";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { loadDialogData } from "../../actions/baseActions";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { loadAuditRequest } from "../../actions/documentAction";

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
  const [chooseFile, setFileData] = useState({});
  const user = useSelector((state) => state.userInfo); // userAuditorInfo
  const messagesRef = firestore.collection("messages_" + audit_number);
  const query = messagesRef.orderBy("createdAt", "asc").limit(10000);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const [allAuditorsS] = useState({});
  const [progressS] = useState({});
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState({});

  useEffect(() => {
    const fetchData = () => {
      dispatch(loadAuditRequest({ slug: slug }));
    };
    fetchData();
  }, [dispatch, slug]);

  const { dialogOpen, auditRequestData, setting } = useSelector((state) => ({
    dialogOpen: state.dialogOpen,
    auditRequestData: state.auditRequestData,
    setting: state.setting,
  }));

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
          // console.log("Upload is " + progress + "% done")

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

    const increment = firebase.firestore.FieldValue.increment(1);
    if (auditRequestData.lead) {
      const messagesRef2 = firestore.collection(
        "notification_" + auditRequestData.lead
      );
      await messagesRef2
        .doc(audit_number)
        .set({ count: increment, slug: slug }, { merge: true });
    }
    if (auditRequestData.peer) {
      const messagesRef2 = firestore.collection(
        "notification_" + auditRequestData.peer
      );
      await messagesRef2
        .doc(audit_number)
        .set({ count: increment, slug: slug }, { merge: true });
    }
    if (auditRequestData.support) {
      const messagesRef2 = firestore.collection(
        "notification_" + auditRequestData.support
      );
      await messagesRef2
        .doc(audit_number)
        .set({ count: increment, slug: slug }, { merge: true });
    }
  };

  return (
    <Fragment>
      {dialogOpen && (
        <Delete dialog={dialog} handleDeleteClick={handleDeleteClick} />
      )}
      <Breadcrumb {...props} />

      <div className="right-contant">
        <h3 className="page-sm-title pb-1">Chat with the auditor</h3>
        <ScrollToBottom
          className="ChatContent"
          followButtonClassName="followbtn"
          scrollViewClassName="chat-outerbx"
        >
          {messages &&
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                user={user}
                allAuditorsS={allAuditorsS}
                progressS={progressS}
              />
            ))}
        </ScrollToBottom>

        <form onSubmit={sendMessage} className="chatform">
          <div className="chat-form-group">
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="say something nice"
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
    </Fragment>
  );
}

function ChatMessage(props) {
  const { text, uid, type, sender, fileName, createdAt } = props.message;

  //   var progressRatio = 0;
  //   if (props.progressS[id]) {
  //     progressRatio = props.progressS[id];
  //   }

  if (type === "attach") {
    var messageClass =
      uid === props.user._id ? "sent hasAttach" : "received hasAttach";
  } else {
    messageClass = uid === props.user._id ? "sent" : "received";
  }
  // console.log(props.message);
  return (
    <>
      <div className="message-list">
        <div className={`message ${messageClass}`}>
          {/*<div className="chatingmember"><img src="http://192.168.1.119:2021/static/user.svg" alt="" /></div>*/}

          {type === "attach" ? (
            text === "https://www.google.com/images/spin-32.gif" ? (
              <>
                <img
                  src={"https://www.google.com/images/spin-32.gif"}
                  alt={"loading"}
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

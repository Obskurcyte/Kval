import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import firebase from "firebase";
import * as notifsActions from "../../store/actions/notifications";
import { useDispatch, useSelector } from "react-redux";
import CardNotif from "../../components/CardNotif";
import CardMessage from "../../components/CardMessage";



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MessageScreen = (props) => {
  const [messageActive, setMessageActive] = useState(true);
  const [notifActive, setNotifActive] = useState(false);

  const dispatch = useDispatch();
  const [notificationsTitle, setNotificationsTitle] = useState([]);
  useEffect(() => {
    dispatch(notifsActions.fetchNotifs());
  }, []);

  const notifsList = useSelector((state) => state.notifs.notifs);

  const [threads, setThreads] = useState([]);
  const [threads2, setThreads2] = useState([]);
  const [loading, setLoading] = useState(true);

  let finalThreads = [];

  console.log(firebase.auth().currentUser.uid)
  useEffect(() => {
    console.log("woskdls");
    const threads = [];
    const unsubscribe = firebase
      .firestore()
      .collection("MESSAGE_THREADS")
      .where("idVendeur", "==", firebase.auth().currentUser.uid)
        .get().then((querySnapshot) => {
          const threads = [];
          querySnapshot.docs.map((documentSnapshot) => {
            console.log(documentSnapshot)
            threads.push({
              _id: documentSnapshot.id,
              pseudoVendeur: documentSnapshot.data().pseudoVendeur,
              latestMessage: { text: "" },
              ...documentSnapshot.data(),
            });
          });
          if (loading) {
            setLoading(false);
          }
          setThreads(threads);
        })
      }, [threads]);

  useEffect(() => {
    console.log("woskdls");
    const threads = [];
    const unsubscribe = firebase
        .firestore()
        .collection("MESSAGE_THREADS")
        .where("idAcheteur", "==", firebase.auth().currentUser.uid)
        .get().then((querySnapshot) => {
          const threads = [];
          querySnapshot.docs.map((documentSnapshot) => {
            console.log(documentSnapshot)
            threads.push({
              _id: documentSnapshot.id,
              pseudoVendeur: documentSnapshot.data().pseudoVendeur,
              latestMessage: { text: "" },
              ...documentSnapshot.data(),
            });
          });
          if (loading) {
            setLoading(false);
          }
          setThreads2(threads);
        })
  }, [threads2]);


  if (threads2.length ===0) {
    finalThreads = threads
  } else {
    finalThreads = threads2
  }

  console.log('fina', finalThreads)
  console.log(threads.length)
  console.log("authid", firebase.auth().currentUser.uid);
  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        <TouchableOpacity
          style={messageActive ? styles.messageBorder : styles.message}
          onPress={() => {
            setMessageActive(true);
            setNotifActive(false);
          }}
        >
          <Text style={styles.messageText}>Messagerie</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={notifActive ? styles.messageBorder : styles.message}
          onPress={() => {
            setMessageActive(false);
            setNotifActive(true);
          }}
        >
          <Text style={styles.messageText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {messageActive && finalThreads.length !== 0 ?
        <FlatList
          data={finalThreads}
          style={styles.flatList}
          keyExtractor={(item) => item?._id}
          renderItem={(itemData) => {
            console.log('itemdata', itemData.item)
            return (
              <CardMessage
                pseudoVendeur={itemData.item?.pseudoVendeur}
                idVendeur={itemData.item?.idVendeur}
                idAcheteur={itemData.item?.idAcheteur}
                latestMessage={itemData.item?.latestMessage.text}
                onPress={() =>
                  props.navigation.navigate("ChatScreen", {
                    thread: itemData.item,
                  })
                }
              />
            );
          }}
        /> : <Text style={styles.noMessage}>Il n'y a aucun message à afficher</Text>
      }
      {finalThreads.length === 0 ? <Text style={styles.noMessage}>Il n'y a aucun message à afficher</Text> : <Text/>}

      {notifActive && (
        <FlatList
          data={notifsList}
          keyExtractor={() => (Math.random() * 100000).toString()}
          renderItem={(itemData) => {
            console.log(itemData);
            return (
              <CardNotif
                title={itemData.item.notificationsTitle}
                body={itemData.item.notificationsBody}
                image={itemData.item.image}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(231, 233, 236, 0.26)",
    width: "100%",
    alignItems: "center",
  },
  message: {
    borderBottomWidth: 3,
    borderBottomColor: "#DADADA",
    textAlign: "center",
    padding: "5%",
    width: "50%",
    alignItems: "center",
  },
  messageBorder: {
    borderBottomWidth: 3,
    borderBottomColor: "#D51317",
    textAlign: "center",
    padding: "5%",
    width: "50%",
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
  },
  previewMessage: {
    marginLeft: "20%",
    marginBottom: "2%",
  },
  messageSuperContainer: {
    paddingLeft: "5%",
    width: "90%",
    height: "100%",
  },
  timeText: {
    fontSize: 14,
    color: "#B5B5BE",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
  },
  flatList: {
    height: "100%",
  },
  noMessage: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: windowHeight/2.5,
    marginBottom: windowHeight/2.5
  }
});
export default MessageScreen;

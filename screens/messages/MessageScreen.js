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
import { ActivityIndicator } from "react-native-paper";
import * as messageAction from "../../store/actions/messages";
import {GET_NOTIFICATIONS} from "../../store/actions/notifications";



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MessageScreen = (props) => {

  const [messageActive, setMessageActive] = useState(true);
  const [action, setAction] = useState(false);
  const dispatch = useDispatch();
  const [notifsList, setNotifsList] = useState([])
  const [threads, setThreads] = useState([]);
  const [threads2, setThreads2] = useState([]);
  const [loading, setLoading] = useState(true);

  let finalThreads = [];

  console.log("notifs", notifsList);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(messageAction.fetchUnreadMessage())
    });
    return unsubscribe
  }, [props.navigation, dispatch])


  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      setLoading(true);
      firebase
          .firestore()
          .collection("MESSAGE_THREADS")
          .where("idVendeur", "==", firebase.auth().currentUser.uid)
          .get()
          .then((querySnapshot) => {
            const threads = [];
            querySnapshot.docs.map((documentSnapshot) => {
              firebase
                  .firestore()
                  .collection("users")
                  .where("id", "==", documentSnapshot.data().idAcheteur)
                  .get()
                  .then((userSnapshot) => {
                    const newPseudoVendeur = userSnapshot.docs.map(
                        (doc) => doc.data().pseudo
                    )[0];
                    threads.push({
                      ...documentSnapshot.data(),
                      _id: documentSnapshot.id,
                      pseudoVendeur: newPseudoVendeur,
                    });
                    if (loading) {
                      setLoading(false);
                    }
                    setThreads(threads);
                  });
            });
          });
      firebase.firestore()
          .collection('notifications')
          .doc(firebase.auth().currentUser.uid)
          .collection('listeNotifs')
          .get()
          .then((querySnapshot) => {
            const threads = [];
            querySnapshot.forEach((doc) => {
              threads.push({
                id: doc.id,
                image: doc.data().image,
                notificationsBody: doc.data().notificationsBody,
                notificationsTitle: doc.data().notificationsTitle
              })
            });
            if (loading) {
              setLoading(false);
            }
            setNotifsList(threads)
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    });
    return unsubscribe;
  }, [props.navigation, action]);

  useEffect(() => {
    setLoading(true);

    console.log("woskdls");
    const threads = [];
    const unsubscribe = props.navigation.addListener("focus", () => {
      firebase
          .firestore()
          .collection("MESSAGE_THREADS")
          .where("idAcheteur", "==", firebase.auth().currentUser.uid)
          .get()
          .then((querySnapshot) => {
            const threads = [];
            querySnapshot.docs.map((documentSnapshot) => {
              threads.push({
                ...documentSnapshot.data(),
                _id: documentSnapshot.id,
                pseudoVendeur: documentSnapshot.data().pseudoVendeur,
              });
            });
            if (loading) {
              setLoading(false);
            }
            setThreads2(threads);
          });
    });
    return unsubscribe;
  }, [props.navigation, action]);

  finalThreads = [...threads, ...threads2];

  return (
      <View style={styles.container}>
        <View style={styles.messagesContainer}>
          <TouchableOpacity
              style={messageActive ? styles.messageBorder : styles.message}
              onPress={() => {
                setMessageActive(true);
              }}
          >
            <Text style={styles.messageText}>Messagerie</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={!messageActive ? styles.messageBorder : styles.message}
              onPress={() => {
                setMessageActive(false);
              }}
          >
            <Text style={styles.messageText}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {!loading ? (
            <>
              {messageActive ?
                  <FlatList
                      data={finalThreads}
                      style={styles.flatList}
                      keyExtractor={(item) => item?._id}
                      renderItem={(itemData) => {
                        return (
                            <CardMessage
                                pseudoVendeur={itemData.item?.pseudoVendeur}
                                setAction={setAction}
                                action={action}
                                idVendeur={itemData.item?.idVendeur}
                                idAcheteur={itemData.item?.idAcheteur}
                                latestMessage={itemData.item?.latestMessage.text}
                                onPress={() => {
                                  props.navigation.navigate("ChatScreen", {
                                    thread: itemData.item,
                                  })
                                }
                                }
                            />
                        );
                      }}
                  /> :
                  <FlatList
                      data={notifsList}
                      style={styles.flatList}
                      keyExtractor={() => (Math.random() * 100000).toString()}
                      renderItem={(itemData) => {
                        console.log('item', itemData.item)
                        return (
                            <CardNotif
                                title={itemData.item.notificationsTitle}
                                body={itemData.item.notificationsBody}
                                image={itemData.item.image}
                                id={itemData.item.id}
                                handleNavigation={async () => {
                                  await firebase.firestore()
                                      .collection('users')
                                      .doc(`${firebase.auth().currentUser.uid}`)
                                      .collection('unreadMessage')
                                      .doc(firebase.auth().currentUser.uid)
                                      .delete()
                                      .catch((error) => {
                                        console.log("Error getting document:", error);
                                      });
                                  props.navigation.navigate('ArticlesEnVenteScreen')
                                }}
                            />
                        );
                      }}
                  />
              }

            </>

        ) : (
            <ActivityIndicator
                color="#D51317"
                size={40}
                style={{ marginTop: 40 }}
            />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(231, 233, 236, 0.26)",
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
  notifsList: {
    flex: 1,
    height: 500,
    backgroundColor: "red",
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
    textAlign: "center",
    marginTop: windowHeight / 2.5,
    marginBottom: windowHeight / 2.5,
  },
});
export default MessageScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import CardNotif from "../../components/CardNotif";
import CardMessage from "../../components/CardMessage";
import { ActivityIndicator } from "react-native-paper";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL} from "../../constants/baseURL";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MessageScreen = (props) => {

  const [messageActive, setMessageActive] = useState(true);
  const [action, setAction] = useState(false);
  const [notifsList, setNotifsList] = useState([])
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);




  /* useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(messageAction.fetchUnreadMessage())
    });
    return unsubscribe
  }, [props.navigation, dispatch])

   */

    const [user, setUser] = useState(null);
    const [update, setUpdate] = useState(0)
  useEffect(() => {
      const getMessages = async () => {
          const userId = await AsyncStorage.getItem("userId");
          const { data } = await axios.get(`${BASE_URL}/api/messages/${userId}`);
          const response = await axios.get(`${BASE_URL}/api/users/${userId}`)
          setThreads(data)
          setUser(response.data)
      }
      const unsubscribe = props.navigation.addListener('focus', () => {
      getMessages()
      });
    return unsubscribe

    /*const unsubscribe = props.navigation.addListener("focus", () => {
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
                      console.log('wessh')
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

     */
  }, [props.navigation, update]);


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
                      data={threads}
                      style={styles.flatList}
                      keyExtractor={(item) => item?._id}
                      renderItem={(itemData) => {
                        return (
                            <CardMessage
                                pseudoVendeur={itemData.item?.pseudoReceiver}
                                setAction={setAction}
                                action={action}
                                setUpdate={setUpdate}
                                id={itemData.item?._id}
                                idVendeur={itemData.item?.sender}
                                idAcheteur={itemData.item?.idAcheteur}
                                latestMessage={itemData.item?.latestMessage}
                                onPress={() => {
                                  props.navigation.navigate("ChatScreen", {
                                    thread: itemData.item,
                                      user
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
                        return (
                            <CardNotif
                                title={itemData.item.notificationsTitle}
                                body={itemData.item.notificationsBody}
                                image={itemData.item.image}
                                id={itemData.item.id}
                                handleNavigation={async () => {
                                  await firebase.firestore()
                                      .collection('users')
                                      .doc(firebase.auth().currentUser.uid)
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
            <View>
                <Text style={styles.noMessage}>
                    Il n'y a aucun message à afficher
                </Text>
                <ActivityIndicator
                    color="#D51317"
                    size={40}
                    style={{ marginTop: 40 }}
                />
            </View>
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
  },
});
export default MessageScreen;

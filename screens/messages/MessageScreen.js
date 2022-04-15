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



  const [user, setUser] = useState(null);
  const [update, setUpdate] = useState(0);
  const [receiverId, setReceiverId] = useState("");
  const [receiverPseudo, setReceiverPseudo] = useState("");
  const [receiver, setReceiver] = useState(null);

  let ids = [];
  let pseudos = [];

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      const userId = await AsyncStorage.getItem("userId");
      const { data } = await axios.get(`${BASE_URL}/api/messages/${userId}`);
      const response = await axios.get(`${BASE_URL}/api/users/${userId}`)
      setThreads(data)
      setUser(response.data)
      setLoading(false)
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
      getMessages()
    });
    return unsubscribe
  }, [props.navigation]);


  console.log('user', user);
  console.log('threads', threads);

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
              {messageActive && user ?
                  <FlatList
                      data={threads}
                      style={styles.flatList}
                      keyExtractor={(item) => item?._id}
                      renderItem={(itemData) => {
                        let psuedoReceiver;
                        let receiverId;
                        let receiver;
                        if (itemData.item.receiver === user._id) {
                          psuedoReceiver = itemData.item.pseudoSender
                          receiverId = itemData.item.sender
                        } else {
                          psuedoReceiver = itemData.item.pseudoReceiver
                          receiverId = itemData.item.receiver
                        }
                        axios.get(`${BASE_URL}/api/users/${receiverId}`).then((res) => {
                          receiver = res.data
                        })
                        return (
                            <CardMessage
                                pseudoVendeur={psuedoReceiver}
                                setAction={setAction}
                                action={action}
                                id={itemData.item?._id}
                                idVendeur={itemData.item?.sender}
                                idAcheteur={itemData.item?.idAcheteur}
                                latestMessage={itemData.item?.latestMessage}
                                onPress={() => {
                                  props.navigation.navigate("ChatScreen", {
                                    thread: itemData.item,
                                    user,
                                    receiver
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

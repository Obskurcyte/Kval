import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";
import { IconButton } from 'react-native-paper';
import  { GiftedChat, Send } from 'react-native-gifted-chat';
import firebase from "firebase";
import {useDispatch} from "react-redux";
import * as userActions from '../../store/actions/users';
import * as messageAction from "../../store/actions/messages";

const ChatScreen = (props) => {

    const dispatch = useDispatch()
  const { thread } = props.route.params;
  console.log('thread', thread);

  const user = firebase.auth().currentUser.toJSON();

  const userId = firebase.auth().currentUser.uid;

  const [userInfo, setUserInfo] = useState(null)

  let docId;

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            dispatch(messageAction.fetchUnreadMessage())
        });
        return unsubscribe
    }, [props.navigation, dispatch])

  if (userId === thread.idAcheteur) {
      docId = thread.idVendeur
  } else {
      docId = thread.idAcheteur
  }
    console.log('dicId', docId)


    useEffect(() => {
        const deleteMessage = async () => {
            await firebase.firestore()
                .collection('users')
                .doc(`${firebase.auth().currentUser.uid}`)
                .collection('unreadMessage')
                .doc(firebase.auth().currentUser.uid)
                .delete()
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        }
        deleteMessage()
    }, []);

  useEffect(() => {
      const user = firebase.firestore()
          .collection('users')
          .doc(`${docId}`)
          .get().then((doc) => {
            if (doc.exists) {
              setUserInfo(doc.data())
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
  }, []);

  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'thread created',
      createdAt: new Date().getTime(),
      system: true
    },
    {
      _id: 1,
      text: 'hello!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Demo'
      }
    }
  ]);

  console.log('info', userInfo)
  useEffect(() => {
    const unsubscribeListener = firebase.firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data()
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          }

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName
            }
          }


          return data

        })

        setMessages(messages)
      })

    return () => unsubscribeListener()
  }, [])

  async function handleSend(messages) {
    const text = messages[0].text
      console.log('you')
      await firebase.firestore()
          .collection('users')
          .doc(`${docId}`)
          .collection('unreadMessage')
          .doc(docId)
          .get().then(async (doc) => {
          if (doc.exists) {
             console.log('yeah')
          } else {
              await firebase.firestore()
                  .collection('users')
                  .doc(`${docId}`)
                  .collection('unreadMessage')
                  .doc(docId)
                  .set({
                      count: 1
                  })
              console.log("New doc created !");
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
      await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate",
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              to: userInfo.pushToken,
              title: "Vous avez un nouveau message !",
              body: `Revenez vite ! Un utilisateur vous a envoyé un message !`,
          }),
      });

    await firebase.firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user.uid,
          displayName: user.displayName
        }
      })

    await firebase.firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      )
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#0d1b3d" />
        </View>
      </Send>
    );
  }

  return (
    <GiftedChat
      showUserAvatar
      messages={messages}
      onSend={handleSend}
      renderSend={renderSend}
      alwaysShowSend
      user={{
        _id: user.uid
      }}
      scrollToBottom
      placeholder="Ecrivez votre message ici..."
    />
  );
};


const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ChatScreen;

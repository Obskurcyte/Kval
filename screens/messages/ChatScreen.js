import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";
import { IconButton } from 'react-native-paper';
import  { GiftedChat, Send } from 'react-native-gifted-chat';
import firebase from "firebase";
import {useDispatch} from "react-redux";
import * as userActions from '../../store/actions/users';

const ChatScreen = (props) => {

  const { thread } = props.route.params
  const user = firebase.auth().currentUser.toJSON()

  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
      const user = firebase.firestore()
          .collection('users')
          .doc(`${thread.idVendeur}`)
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

  console.log('user', userInfo);


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
  ])

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
      await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate",
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              to: userInfo.pushToken.data,
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

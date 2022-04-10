import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";
import { IconButton } from 'react-native-paper';
import  { GiftedChat, Send } from 'react-native-gifted-chat';
import firebase from "firebase";
import {useDispatch} from "react-redux";
import * as userActions from '../../store/actions/users';
import * as messageAction from "../../store/actions/messages";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL} from "../../constants/baseURL";

const ChatScreen = (props) => {

  /*  const dispatch = useDispatch()
  const { thread, user } = props.route.params;
  console.log('thread', thread);

  console.log('user', user)

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



 // const [messagesTest, setMessagesTest] = useState(thread.messages)

  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/messages`);
      setThreads(data.messages)
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
      getMessages()
    });
    return unsubscribe
  }, [props.navigation, threads]);

  console.log('messages', messages);

  async function handleSend(messages) {
    console.log(messages)
    const text = messages[0].text
      console.log('you')
      setMessages(prevState => ([...prevState, messages]))
      const id = messages.length + 1;
      await axios.post(`${BASE_URL}/api/messages/thread`, {
        id: thread._id,
        text,
        messageId: id,
        createdAt: new Date(),
      })
     /* await firebase.firestore()
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
    console.log("2")
      await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate",
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              to: userInfo.pushToken,
              sound: 'default',
              badge: 1,
              title: "Vous avez un nouveau message !",
              body: `Revenez vite ! Un utilisateur vous a envoyé un message !`,
          }),
      });

    console.log("3")
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
      });

      console.log("4")
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

      console.log("5")
      await axios.post("https://kval-backend.herokuapp.com/send", {
          mail: email,
          subject: "Nouveau message KvalOccaz",
          html_output: `
<div>
    <p>${pseudo}, <br></p>
    <p>Un message vient d'être déposé à votre attention, vous pouvez le retrouver dans l’application et y répondre.</p>
    <p>Détails du message : </p>

    <p>${text}</p>

    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
      });
      */

  const { thread, user } = props.route.params;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/messages/thread/${thread._id}`);
      console.log('data', data)
      setMessages(data.messages)
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
      getMessages()
    });
    return unsubscribe
  }, [messages])


  console.log(messages)

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const text = messages[0].text
    const id = Math.random() * 30000000;
    try {
      axios.post(`${BASE_URL}/api/messages/thread`, {
      id: thread._id,
      text,
      messageId: id,
      userId: user._id,
      userName: user.pseudo,
      createdAt: new Date(),
    }, config).then(() => console.log('Message sent'))
    } catch (err) {
      console.log(err)
    }
  }, []);

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
      <>
        <GiftedChat
            showUserAvatar
            messages={messages}
            onSend={messages => onSend(messages)}
            renderSend={renderSend}
            alwaysShowSend
            user={{
              _id: user._id,
            }}
            scrollToBottom
            placeholder="Ecrivez votre message ici..."
        />
      </>


  );
};


const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ChatScreen;

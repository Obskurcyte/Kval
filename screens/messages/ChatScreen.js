import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from "react-native";
import { IconButton } from 'react-native-paper';
import  { GiftedChat, Send } from 'react-native-gifted-chat';
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";
import authContext from "../../context/authContext";

const ChatScreen = (props) => {

  const { thread, user, receiver } = props.route.params;
  const { messageLength, setMessageLength } = useContext(authContext);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/messages/thread/${thread._id}`);
      setMessages(data.messages)
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
      getMessages()
    });
    return unsubscribe
  }, [messages])


  console.log('receiver', receiver)
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const onSend = useCallback(async (messages = []) => {
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
    }, config).then(() => console.log('Message sent'));


      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: receiver.pushToken,
          sound: 'default',
          badge: 1,
          title: "Vous avez un nouveau message !",
          body: `Revenez vite ! Un utilisateur vous a envoyé un message !`,
        }),
      });

      await axios.put(`${BASE_URL}/api/users`, {
        id: receiver._id,
        unreadMessages: 1,
        notificationsTitle: "Vous avez un nouveau message !",
        notificationsBody: "Revenez vite ! Un utilisateur vous a envoyé un message !",
        notificationsImage: "https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Ficon.png?alt=media&token=a37ed2e9-7e64-4ae8-a7f8-c19a9ac2fcac"
      }, config);

      await axios.post("https://kval-backend.herokuapp.com/send", {
        mail: receiver.email,
        subject: "Nouveau message KvalOccaz",
        html_output: `
<div>
    <p>${receiver.pseudo}, <br></p>
    <p>Un message vient d'être déposé à votre attention, vous pouvez le retrouver dans l’application et y répondre.</p>
    <p>Détails du message : </p>

    <p>${text}</p>

    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
      });
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
        {receiver && <GiftedChat
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
        />}

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

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, FlatList} from 'react-native';
import firebase from "firebase";
import * as notifsActions from '../../store/actions/notifications';
import {useDispatch, useSelector} from "react-redux";
import CardNotif from "../../components/CardNotif";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import UserAvatar from 'react-native-user-avatar';
const MessageScreen = (props) => {

  const [messageActive, setMessageActive] = useState(true);
  const [notifActive, setNotifActive] = useState(false);

  let pseudoVendeur;
  let initial;
  if (props.route.params) {
    pseudoVendeur = props.route.params.pseudoVendeur
    initial = pseudoVendeur.charAt(0)
  }


  const dispatch = useDispatch()
  const [notificationsTitle, setNotificationsTitle] = useState([])
  useEffect(() => {
    dispatch(notifsActions.fetchNotifs())
  }, [])

  const notifsList = useSelector(state => state.notifs.notifs)

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('woskdls')
    const unsubscribe = firebase.firestore()
      .collection('MESSAGE_THREADS')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          console.log('wesh')
          if (documentSnapshot.id.includes(firebase.auth().currentUser.uid)) {
            return {
              _id: documentSnapshot.id,
              name: pseudoVendeur,
              latestMessage: { text: '' },
              ...documentSnapshot.data()
            }
          }
        })
        setThreads(threads)
        if (loading) {
          setLoading(false)
        }
      })
    return () => unsubscribe()
  }, [])


  console.log('thre', threads)

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        <TouchableOpacity style={messageActive ? styles.messageBorder : styles.message} onPress={() => {
          setMessageActive(true)
          setNotifActive(false)
        }}>
          <Text style={styles.messageText}>Messagerie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={notifActive ? styles.messageBorder : styles.message} onPress={() => {
          setMessageActive(false)
          setNotifActive(true)
        }}>
          <Text style={styles.messageText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {messageActive && (
          <FlatList
            data={threads}
            keyExtractor={() => Math.random() * 100000000000}
            renderItem={({ item }) => {
              console.log(item)
              let date;
              if (item !== undefined) {
                date = item.latestMessage.createdAt
                console.log('date', date)
              }
              return (
                  <View>
                  {item!==undefined ?
                      <TouchableOpacity style={styles.messageSuperContainer} onPress={() => props.navigation.navigate('ChatScreen', {thread: item})}>
                        <View style={styles.messageContainer}>
                          <UserAvatar
                              size={50}
                              name={initial}
                          />
                          <View style={styles.nameContainer}>
                            <Text style={styles.pseudoText}>{item.name}</Text>
                          </View>
                        </View>
                        <View style={styles.previewMessage}>
                          <Text style={styles.timeText}>{item?.latestMessage.text}</Text>
                        </View>
                      </TouchableOpacity> : <Text/>
            }
                  </View>

              )
            }}
          />
      )}

      {notifActive && (
        <FlatList
          data={notifsList}
          keyExtractor={() => (Math.random()*  100000).toString()}
          renderItem={itemData => {
            console.log(itemData)
            return (
            <CardNotif
              title={itemData.item.notificationsTitle}
              body={itemData.item.notificationsBody}
              image={itemData.item.image}
            />
          )}}
        />



      )}

    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: 'grey',
    color: 'red'
  },
  container: {
    backgroundColor: 'white'
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(231, 233, 236, 0.26)',
    width: '100%',
    alignItems: 'center'
  },
  message: {
    borderBottomWidth: 3,
    borderBottomColor: '#DADADA',
    textAlign: 'center',
    padding: '5%',
    width: '50%',
    alignItems: 'center'
  },
  messageBorder: {
    borderBottomWidth: 3,
    borderBottomColor: '#D51317',
    textAlign: 'center',
    padding: '5%',
    width: '50%',
    alignItems: 'center'
  },
  messageText: {
    fontSize: 18
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '5%',
    marginTop: '5%'
  },
  pseudoText: {
    fontSize: 18
  },
  previewMessage: {
    marginTop: '5%',
    marginLeft: '10%'
  },
  messageSuperContainer: {
    padding: '5%',
    width: '90%'
  },
  timeText: {
    fontSize: 14,
    color: '#B5B5BE'
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
  }
})
export default MessageScreen;

import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View, StyleSheet} from "react-native";

const CardNotif = (props) => {

  console.log(props.image)

  return (
    <TouchableOpacity style={styles.messageSuperContainer} onPress={() => props.navigation.navigate('ChatScreen')}>
      <View style={styles.messageContainer}>
        <Image
          source={{uri: props.image}}
          style={styles.image}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.pseudoText}>{props.title}</Text>
        </View>
      </View>
      <View style={styles.previewMessage}>
        <Text style={styles.timeText}>{props.body}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    marginLeft: '5%'
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
  },
  image: {
    width: 100,
    height: 100
  }
});
export default CardNotif;

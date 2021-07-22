import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Entypo} from "@expo/vector-icons";

const BoosteVentePaiementItem = (props) => {

  return (
    <View style={styles.cardContainer}>
      <Entypo name="circle-with-cross" size={30} color="black" style={styles.cross} onPress={props.onDelete}/>
      <View style={styles.imgContainer}>
        <Image
          source={{uri: props.image}}
          style={styles.image}
        />
      </View>
    </View>
  );

};


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    width: '40%',
    marginTop: '5%',
    marginHorizontal: '4%'
  },
  cross: {
    marginLeft: '85%'
  },
  imgContainer: {
    height: '80%'
  },
  image: {
    height: 140,
    width: 140
  }
});
export default BoosteVentePaiementItem;

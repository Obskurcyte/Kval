import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { Entypo } from '@expo/vector-icons';
const CartItem = (props) => {

  return (
    <View style={styles.cardContainer}>
      <Entypo name="circle-with-cross" size={30} color="black" style={styles.cross} onPress={props.onDelete}/>
      <View style={styles.imgContainer}>
        <Image
          source={{uri: props.image}}
          style={styles.image}
        />
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.cardTitle}>{props.title}</Text>
        <Text style={styles.price}>{props.price} €</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  price: {
    color: '#D51317',
    fontSize: 14
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA'
  },
  cardContainer: {
    backgroundColor: 'white',
    width: '65%',
    height: '100%',
    marginTop: '5%'
  },
  imgContainer: {
    height: '70%',
    alignItems: 'center',
    paddingTop: '5%'
  },
  image: {
    height: 180,
    width: 180
  },
  cross: {
    marginLeft: '85%'
  },
  deleteContainer: {
    position: 'absolute',
    right: '5%',
    width: '12%',
    alignItems: 'center',
    top: '2%'
  },
  crossText: {
    fontSize: 20,
    color: '#A7A9BE'
  },
  priceContainer: {
    marginLeft: '10%'
  }
});

export default CartItem;

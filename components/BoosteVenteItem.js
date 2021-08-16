import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const BoosteVenteItem = ({item, onPress, backgroundColor}) => {

  console.log('item', item.downloadURL)
  return (

    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>

      <View style={styles.imgcontainer}>
        <Image
          source={{uri: item.downloadURL}}
          style={styles.image}
        />
      </View>

      <View style={backgroundColor}>
        <Text style={{color: '#5B5B75', textAlign: 'center'}}>SELECTIONNER</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  price: {
    color: '#B5B5BE',
    fontSize: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA',
    paddingVertical: '4%'
  },
  selected: {
    backgroundColor: '#D6F5DB',
    paddingVertical: '4%'
  },
  cardContainer: {
    backgroundColor: 'white',
    width: '40%',
    marginTop: '5%',
    marginHorizontal: '4%'
  },
  imgContainer: {
    height: '80%'
  },
  image: {
    height: 140,
    width: 140
  }
});


export default BoosteVenteItem;

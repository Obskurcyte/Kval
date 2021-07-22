import {TouchableOpacity, Text, View, Image, StyleSheet} from "react-native";
import React from "react";

const BoostedProductCard = ({title, prix, image, pseudo, onPress}) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.price}>{prix} €</Text>

      <View style={styles.imgcontainer}>
        <Image
          source={{uri: image}}
          style={styles.image}
        />
      </View>

      <View style={styles.vendeurContainer}>
        <Text>{pseudo}</Text>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    width: 150,
    height: 200,
    marginTop: '5%',
    marginLeft: 5,
    marginRight: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    color: '#B5B5BE',
    fontSize: 12
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA'
  },
});

export default BoostedProductCard

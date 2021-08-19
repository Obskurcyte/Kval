import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CardVente = (props) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={props.onpress}>
      <View style={styles.innerCard}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.cardTitle}>{props.title}</Text>
          <Text style={styles.price}>{props.price} €</Text>
        </View>
        <View style={styles.imgcontainer}>
          <Image source={{ uri: props.imageURI }} style={styles.image} />
        </View>
      </View>
      <View style={styles.vendeurContainer}>
        <Text style={styles.vendeur}>{props.pseudo}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imgcontainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    maxWidth: "100%",
  },
  innerCard: {
    paddingTop: "5%",
  },
  cardTitle: {
    color: "#B5B5BE",
    fontSize: 14,
  },
  vendeur: {
    fontSize: 10,
  },
  vendeurContainer: {
    width: "100%",
    paddingVertical: 10,
  },
  cardContainer: {
    backgroundColor: "white",
    width: "40%",
    marginTop: "5%",
    marginHorizontal: "4%",
    shadowColor: "rgba(0, 0, 0, 0.08);",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    padding: 5,
    shadowOffset: {
      height: 3,
      width: 3,
    },
  },
  imgContainer: {
    height: "80%",
  },
  image: {
    height: 140,
    width: 140,
  },
});

export default CardVente;

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
        </View>
        <View style={styles.imgcontainer}>
          <Image
            source={{ uri: props.imageURI }}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.vendeurContainer}>
        <Text style={styles.vendeur}>{props.pseudo}</Text>
        <Text style={styles.price}>{props.price} €</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  price: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 5,
  },
  imgcontainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    maxWidth: "100%",
  },
  innerCard: {
    paddingTop: 5,
  },
  cardTitle: {
    color: "#B5B5BE",
    fontSize: 15,
    fontWeight: "bold",
    margin: 5,
  },
  vendeur: {
    fontSize: 10,
    margin: 5,
    color: "#B5B5BE",
    fontStyle: "italic",
  },
  vendeurContainer: {
    width: "100%",
    paddingVertical: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 0,
    margin: 5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2,
  },
  imgContainer: {
    height: "100%",
  },
  image: {
    height: 150,
    width: "100%",
  },
});

export default CardVente;

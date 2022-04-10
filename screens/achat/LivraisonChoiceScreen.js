import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MondialRelayView } from "../../components/MondialRelayView";
import firebase from "firebase";

const LivraisonChoiceScreen = (props) => {
  const product = props.route.params.product;

  const cartItems = props.route.params.cartItems;
  const index = props.route.params.index;
  const [livraison, setLivraison] = useState("");

  const handleMondialRelay = (data) => {
    props.navigation.navigate("CartScreen", {
      livraison: "MondialRelay",
      cartItems: cartItems,
      adresse: data,
      index: index,
    });
  };

  const updateLivraison = async (livraison) => {
    await firebase
      .firestore()
      .collection(product.categorie)
      .doc(product.productId)
      .update({
        livraison: livraison,
      });
    await firebase
      .firestore()
      .collection("allProducts")
      .doc(product.productId)
      .update({
        livraison: livraison,
      });
  };

  return (
    <View style={styles.container}>
      {product.poids < 30 ? (
        <TouchableOpacity
          style={styles.itemForm3}
          onPress={async () => {
            // await updateLivraison('MondialRelay');
            cartItems[index].livraison = "MondialRelay";
            setLivraison("MondialRelay");
          }}
        >
          <Text style={styles.text}>MondialRelay</Text>
        </TouchableOpacity>
      ) : (
        <Text />
      )}

      <TouchableOpacity
        style={styles.itemForm3}
        onPress={async () => {
          // await updateLivraison("Remise en main propre");
          cartItems[index].livraison = "Remise en main propre";
          props.navigation.navigate("CartScreen", {
            adresse: null,
            cartItems: cartItems,
          });
        }}
      >
        <Text style={styles.text}>Remise en main propre</Text>
      </TouchableOpacity>

        <TouchableOpacity
            style={styles.itemForm3}
            onPress={async () => {
                // await updateLivraison("Remise en main propre");
                cartItems[index].livraison = "Livraison par un transporteur de mon choix";
                props.navigation.navigate("CartScreen", {
                    adresse: null,
                    cartItems: cartItems,
                });
            }}
        >
            <Text style={styles.text}>Livraison par un transporteur de mon choix</Text>
        </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemForm3}
        onPress={async () => {
          // await updateLivraison("Livraison Article Lourd");
          cartItems[index].livraison = "Livraison Article Lourd";
          props.navigation.navigate("CartScreen", {
            adresse: null,
            cartItems: cartItems,
          });
        }}
      >
        <Text style={styles.text}>Livraison article "lourd"</Text>
      </TouchableOpacity>
      {livraison === "MondialRelay" && (
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <MondialRelayView handler={handleMondialRelay} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemForm3: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    paddingVertical: "6%",
  },
  container: {
    flex: 1,
    padding: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default LivraisonChoiceScreen;

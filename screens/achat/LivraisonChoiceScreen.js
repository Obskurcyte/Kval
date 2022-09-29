import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MondialRelayView } from "../../components/MondialRelayView";
import firebase from "firebase";
import * as cartActions from "../../store/actions/cart";
import {useDispatch} from "react-redux";
import cart from "../../store/reducers/cart";

const LivraisonChoiceScreen = (props) => {
  const product = props.route.params.product;

  const dispatch = useDispatch()
  const cartItems = props.route.params.cartItems;
  const index = props.route.params.index;
  const [livraison, setLivraison] = useState("");

  const handleMondialRelay = (data) => {
      console.log("Mondial Relay", cartItems[index])
      let product = cartItems[index]
      console.log('product')
      product.adresse = data
      product.livraison = "MondialRelay"
      product.images = [product.image]
      product.token = product.pushToken
      product.title = product.productTitle
      product.prix = product.productPrice
      product.brand = product.categorie
      product._id = product.productId
      console.log("new product", product)
      dispatch(cartActions.removeFromCart(cartItems[index].productId))
      dispatch(cartActions.addToCart(product));
      console.log('YESS')
      props.navigation.navigate("CartScreen", {
          cartItems: cartItems,
          adresse: data,
          index: index,
        });



  };

  return (
    <View style={styles.container}>
      {product.poids < 30 ? (
        <TouchableOpacity
          style={styles.itemForm3}
          onPress={async () => {
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

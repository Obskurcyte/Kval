import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MondialRelayView } from "../../components/MondialRelayView";

const LivraisonChoiceScreen = (props) => {
  const [livraison, setLivraison] = useState("");

  const handleMondialRelay = (data) => {
    props.navigation.navigate("CartScreen", {
      livraison: "MondialRelay",
      adresse: data,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemForm3}
        onPress={() => {
          setLivraison("MondialRelay");
        }}
      >
        <Text style={styles.text}>MondialRelay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemForm3}
        onPress={() => {
          setLivraison("Personnalisée");
          props.navigation.navigate("CartScreen", {
            livraison: "Personnalisé",
            adresse: null,
          });
        }}
      >
        <Text style={styles.text}>Remise en main propre</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemForm3}
        onPress={() => {
          setLivraison('Livraison article "lourd"');
          props.navigation.navigate("LivraisonArticleLourdScreen");
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

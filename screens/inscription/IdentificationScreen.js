import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const IdentificationScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identification</Text>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => props.navigation.navigate("PreInscriptionScreen")}
      >
        <Text style={styles.createCompte}>Créer un compte</Text>
      </TouchableOpacity>

      <View style={styles.connecteContainer}>
        <View>
          <Text style={styles.text}>Tu as déjà un compte ? </Text>
        </View>
        <View style={styles.connecte}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("ConnectionScreen")}
          >
            <Text style={styles.text}>Connecte-toi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D51317",
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    marginTop: "25%",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    shadowColor: "grey",
    width: "70%",
    paddingVertical: "3%",
    borderRadius: 10,
    marginTop: "40%",
  },
  createCompte: {
    color: "#D51317",
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    marginTop: "20%",
  },
  connecteContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "30%",
  },
  connecte: {
    marginTop: "4.5%",
  },
});
export default IdentificationScreen;

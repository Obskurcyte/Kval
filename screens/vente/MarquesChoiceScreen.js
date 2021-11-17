import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import firebase from "firebase";

const MarquesChoiceScreen = (props) => {
  const [marque, setMarque] = useState("");
  const [marques, setMarques] = useState([]);
  const modify = props.route.params && props.route.params.modify;

  useEffect(() => {
    firebase
      .firestore()
      .collection("Marques")
      .orderBy("name")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          marques.push(doc.data());
        });
        setMarques([{ name: "Autres marques" }, ...marques]);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>
      {marques &&
        marques.map((marques_obj) => (
          <TouchableOpacity
            style={styles.itemForm3}
            onPress={() => {
              setMarque(marques_obj.name);

              props.navigation.navigate("Vendre", {
                screen: "VendreArticleScreen",
                params: { marque: marques_obj.name },
              });
            }}
          >
            <Text style={styles.text}>{marques_obj.name}</Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemForm3: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    paddingVertical: "6%",
  },
  container: {
    paddingHorizontal: "5%",
  },
  text: {
    fontSize: 16,
  },
});

export default MarquesChoiceScreen;

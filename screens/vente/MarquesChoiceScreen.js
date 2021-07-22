import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {AntDesign} from "@expo/vector-icons";

const MarquesChoiceScreen = (props) => {

  const [marques, setMarques] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.itemForm3} onPress={() => {
        setEtat('Neuf avec étiquette')
        props.navigation.navigate('VendreArticleScreen', {
          etat: 'Neuf avec étiquette'
        })
      }}>
        <Text style={styles.text}>Neuf avec étiquette</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemForm3} onPress={() => {
        setEtat('Neuf sans étiquette')
        props.navigation.navigate('VendreArticleScreen', {
          etat: 'Neuf sans étiquette'
        })
      }}>
        <Text style={styles.text}>Neuf sans étiquette</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemForm3} onPress={() => {
        setEtat('Très bon état')
        props.navigation.navigate('VendreArticleScreen', {
          etat: 'Très bon état'
        })
      }}>
        <Text style={styles.text}>Très bon état</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemForm3} onPress={() => {
        setEtat('Bon état')
        props.navigation.navigate('VendreArticleScreen', {
          etat: 'Bon état'
        })
      }}>
        <Text style={styles.text}>Bon état</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemForm3} onPress={() => {
        setEtat('Satisfaisant')
        props.navigation.navigate('VendreArticleScreen', {
          etat: 'Satisfaisant'
        })
      }}>
        <Text style={styles.text}>Satisfaisant</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemForm3 : {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: "6%"
  },
  container: {
    paddingHorizontal: '5%'
  },
  text: {
    fontSize: 16
  }
});

export default MarquesChoiceScreen;

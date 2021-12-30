import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SelleProfileScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Bardettes et éducatives junior'
        })}>
          <Text style={styles.text}>Bardettes et éducatives junior</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles mixtes'
        })}>
          <Text style={styles.text}>Selles mixtes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Bavettes'
        })}>
          <Text style={styles.text}>Bavettes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles CSO'
        })}>
          <Text style={styles.text}>Selles CSO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles de dressage'
        })}>
          <Text style={styles.text}>Selles de dressage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles de cross'
        })}>
          <Text style={styles.text}>Selles de cross</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles d’endurance et islandaise'
        })}>
          <Text style={styles.text}>Selles d’endurance et islandaise</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles de cross'
        })}>
          <Text style={styles.text}>Selles de cross</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles de randonnée'
        })}>
          <Text style={styles.text}>Selles de randonnée</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles stock'
        })}>
          <Text style={styles.text}>Selles stock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles ibériques'
        })}>
          <Text style={styles.text}>Selles ibériques</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Selles western'
        })}>
          <Text style={styles.text}>Selles western</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Sacs et housses de selles'
        })}>
          <Text style={styles.text}>Sacs et housses de selles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Porte-selles'
        })}>
          <Text style={styles.text}>Porte-selles</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Accessoires de selles'
        })}>
          <Text style={styles.text}>Accessoires de selles</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgrey',
    flex: 1,
    alignItems: 'center'
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: "3%",
    marginTop: "4%",
    width: windowWidth/1.1
  },
  text: {
    textAlign: 'center',
    fontSize: 20
  }
});

export default SelleProfileScreen;

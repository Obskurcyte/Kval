import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BottesProfileScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Boots'
        })}>
          <Text style={styles.text}>Boots</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Boots de sécurité'
        })}>
          <Text style={styles.text}>Boots de sécurité</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Bottes et boots d’hiver'
        })}>
          <Text style={styles.text}>Bottes et boots d’hiver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Bottes cuir'
        })}>
          <Text style={styles.text}>Bottes cuir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Bottes synthétiques'
        })}>
          <Text style={styles.text}>Bottes synthétiques</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Bottes d’extérieur'
        })}>
          <Text style={styles.text}>Bottes d’extérieur</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Mini-chaps et chaps'
        })}>
          <Text style={styles.text}>Mini-chaps et chaps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Accessoires de boots et bottes'
        })}>
          <Text style={styles.text}>Accessoires de boots et bottes</Text>
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

export default BottesProfileScreen;

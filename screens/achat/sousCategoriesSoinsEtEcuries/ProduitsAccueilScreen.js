import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProduitsAccueilScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Entretien du cuir'
        })}>
          <Text style={styles.text}>Entretien du cuir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Entretien sabots'
        })}>
          <Text style={styles.text}>Entretien sabots</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Anti-mouches'
        })}>
          <Text style={styles.text}>Anti-mouches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Soins de la peau'
        })}>
          <Text style={styles.text}>Soins de la peau</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Démêlants et lustrant'
        })}>
          <Text style={styles.text}>Démêlants et lustrant</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Shampoings et détachants'
        })}>
          <Text style={styles.text}>Shampoings et détachants</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Membres, tendons et articulations'
        })}>
          <Text style={styles.text}>Membres, tendons et articulations</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Entretien couvertures, textiles'
        })}>
          <Text style={styles.text}>Entretien couvertures, textiles</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Entretien box et locaux'
        })}>
          <Text style={styles.text}>Entretien box et locaux</Text>
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
    width: windowWidth/1.1,
    marginBottom: '3%',
    height: windowHeight/10,
    borderRadius: 20,
    paddingTop: '8%',
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.6,
    elevation: 6,
    shadowRadius: 5,
    shadowOffset : { width: 1, height: 13},
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20
  }
});

export default ProduitsAccueilScreen;

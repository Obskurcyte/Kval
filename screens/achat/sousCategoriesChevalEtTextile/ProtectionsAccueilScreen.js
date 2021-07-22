import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProtectionsAccueilScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Guêtres ouvertes'
        })}>
          <Text style={styles.text}>Guêtres ouvertes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Guêtres fermées'
        })}>
          <Text style={styles.text}>Guêtres fermées</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Sets guêtres et protège-boulets'
        })}>
          <Text style={styles.text}>Sets guêtres et protège-boulets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Cloches'
        })}>
          <Text style={styles.text}>Cloches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Protège-paturons'
        })}>
          <Text style={styles.text}>Protège-paturons</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Protège-glomes'
        })}>
          <Text style={styles.text}>Protège-glomes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Protège-jarrets'
        })}>
          <Text style={styles.text}>Protège-jarrets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Guêtres de repos et de soins'
        })}>
          <Text style={styles.text}>Guêtres de repos et de soins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Guêtres de transport'
        })}>
          <Text style={styles.text}>Guêtres de transport</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Accessoires de transports'
        })}>
          <Text style={styles.text}>Accessoires de transports</Text>
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

export default ProtectionsAccueilScreen;

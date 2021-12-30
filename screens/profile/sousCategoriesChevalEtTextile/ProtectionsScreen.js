import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProtectionsProfileScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Guêtres ouvertes'
        })}>
          <Text style={styles.text}>Guêtres ouvertes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Guêtres fermées'
        })}>
          <Text style={styles.text}>Guêtres fermées</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Sets guêtres et protège-boulets'
        })}>
          <Text style={styles.text}>Sets guêtres et protège-boulets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Cloches'
        })}>
          <Text style={styles.text}>Cloches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Protège-paturons'
        })}>
          <Text style={styles.text}>Protège-paturons</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Protège-glomes'
        })}>
          <Text style={styles.text}>Protège-glomes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Protège-jarrets'
        })}>
          <Text style={styles.text}>Protège-jarrets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Guêtres de repos et de soins'
        })}>
          <Text style={styles.text}>Guêtres de repos et de soins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Guêtres de transport'
        })}>
          <Text style={styles.text}>Guêtres de transport</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
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

export default ProtectionsProfileScreen;

import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ColiersProfileScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Elastiques'
        })}>
          <Text style={styles.text}>Elastiques</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Rênes allemandes'
        })}>
          <Text style={styles.text}>Rênes allemandes </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Martingales'
        })}>
          <Text style={styles.text}>Martingales</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Colliers de chasse'
        })}>
          <Text style={styles.text}>Colliers de chasse</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Gogues'
        })}>
          <Text style={styles.text}>Gogues</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Accessoires'
        })}>
          <Text style={styles.text}>Accessoires</Text>
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

export default ColiersProfileScreen;

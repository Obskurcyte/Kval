import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SoinsEtEcuriesAccueilScreen = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer}  onPress={() => props.navigation.navigate('AlimentsAccueilScreen')}>
          <Text style={styles.text}>Aliments, compléments alimentaires et friandises</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ProduitsAccueilScreen')}>
          <Text style={styles.text}>Produits d'entretien</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('MaterielAccueilScreen')}>
          <Text style={styles.text}>Matériel de pansage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('TenturesAccueilScreen')}>
          <Text style={styles.text}>Tentures, housses, sacs, supports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('EquipementsAccueilScreen')}>
          <Text style={styles.text}>Equipements box</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ClotureAccueilScreen')}>
          <Text style={styles.text}>Matériels de clôture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('MarechalerieAccueilScreen')}>
          <Text style={styles.text}>Maréchalerie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('EntrainementAccueilScreen')}>
          <Text style={styles.text}>Matériels d’entrainement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ViewProductsScreen', {
          categorie: 'Surveillance de nos chevaux'
        })}>
          <Text style={styles.text}>Surveillance de nos chevaux</Text>
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

export default SoinsEtEcuriesAccueilScreen;

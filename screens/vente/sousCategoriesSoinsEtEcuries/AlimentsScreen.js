import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AlimentsScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Friandises, récompenses'
        })}>
          <Text style={styles.text}>Friandises, récompenses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Muscle, booster, soutien à l’effort'
        })}>
          <Text style={styles.text}>Muscle, booster, soutien à l’effort</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Vitamines et minéraux'
        })}>
          <Text style={styles.text}>Vitamines et minéraux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Biotines, soins pieds/fourbures'
        })}>
          <Text style={styles.text}>Biotines, soins pieds/fourbures</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Electrolytes, récupération'
        })}>
          <Text style={styles.text}>Electrolytes, récupération</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Respiration'
        })}>
          <Text style={styles.text}>Respiration</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Combat du stress'
        })}>
          <Text style={styles.text}>Combat du stress</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Digestion'
        })}>
          <Text style={styles.text}>Digestion</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Articulation, locomotion'
        })}>
          <Text style={styles.text}>Articulation, locomotion</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Croissance poulains'
        })}>
          <Text style={styles.text}>Croissance poulains</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Alimentations'
        })}>
          <Text style={styles.text}>Alimentations</Text>
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

export default AlimentsScreen;

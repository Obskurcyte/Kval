import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TransportScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Trottinette électrique'
        })}>
          <Text style={styles.text}>Trottinette électrique</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Vélo'
        })}>
          <Text style={styles.text}>Vélo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'Van pour chevaux'
        })}>
          <Text style={styles.text}>Van pour chevaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
          categorie: 'VL pour chevaux'
        })}>
          <Text style={styles.text}>VL pour chevaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('VendreArticleScreen', {
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

export default TransportScreen;

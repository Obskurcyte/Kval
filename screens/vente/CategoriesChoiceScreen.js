import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {grandesCategories} from "../../categories/grandesCategories";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CategoriesChoiceScreen = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChevalEtCuirScreen')}>
          <Text style={styles.text}>Cheval & Cuir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChevalEtTextileScreen')}>
          <Text style={styles.text}>Cheval & Textile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('CavalierScreen')}>
          <Text style={styles.text}>Cavaliers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('SoinsEtEcuriesScreen')}>
          <Text style={styles.text}>Soins et écuries</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChienScreen')}>
          <Text style={styles.text}>Chiens et autres animaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('TransportScreen')}>
          <Text style={styles.text}>Transport</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer}>
          <Text style={styles.text}>Marques</Text>
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

export default CategoriesChoiceScreen;

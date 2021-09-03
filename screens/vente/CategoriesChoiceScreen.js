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

export default CategoriesChoiceScreen;

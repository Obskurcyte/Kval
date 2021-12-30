import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {grandesCategories} from "../../categories/grandesCategories";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CategoriesChoiceProfileScreen = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChevalEtCuirProfileScreen')}>
          <Text style={styles.text}>Cheval & Cuir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChevalEtTextileProfileScreen')}>
          <Text style={styles.text}>Cheval & Textile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('CavalierProfileScreen')}>
          <Text style={styles.text}>Cavaliers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('SoinsEtEcuriesProfileScreen')}>
          <Text style={styles.text}>Soins et écuries</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChienProfileScreen')}>
          <Text style={styles.text}>Chiens et autres animaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('TransportProfileScreen')}>
          <Text style={styles.text}>Transport</Text>
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

export default CategoriesChoiceProfileScreen;

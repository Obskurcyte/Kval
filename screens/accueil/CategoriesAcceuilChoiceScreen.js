import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CategoriesAccueilChoiceScreen = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChevalEtCuirAccueilScreen')}>
          <Text style={styles.text}>Cheval & Cuir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChevalEtTextileAccueilScreen')}>
          <Text style={styles.text}>Cheval & Textile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('CavalierAccueilScreen')}>
          <Text style={styles.text}>Cavaliers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('SoinsEtEcuriesAccueilScreen')}>
          <Text style={styles.text}>Soins et écuries</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ChienAccueilScreen')}>
          <Text style={styles.text}>Chiens et autres animaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('TransportAccueilScreen')}>
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

export default CategoriesAccueilChoiceScreen;

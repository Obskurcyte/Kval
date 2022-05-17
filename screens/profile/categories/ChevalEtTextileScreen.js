import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChevalEtTextileProfileScreen = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer}  onPress={() => props.navigation.navigate('ChemisesProfileScreen')}>
          <Text style={styles.text}>Chemises et séchantes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('CouverturesProfileScreen')}>
          <Text style={styles.text}>Couvertures et couvre-reins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('LicolsProfileScreen')}>
          <Text style={styles.text}>Licols et longes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ProtectionsProfileScreen')}>
          <Text style={styles.text}>Protections des membres</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Collection shetland et mini-shetland'
        })}>
          <Text style={styles.text}>Collection shetland et mini-shetland</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('TapisProfileScreen', {
          categorie: 'Tapis, bonnets et amortisseurs'
        })}>
          <Text style={styles.text}>Tapis, bonnets et amortisseurs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
          categorie: 'Spécial noël'
        })}>
          <Text style={styles.text}>Spécial noël</Text>
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

export default ChevalEtTextileProfileScreen;

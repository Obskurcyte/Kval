import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChevalEtCuirAccueilScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer}  onPress={() => props.navigation.navigate('BrideriesAccueilScreen')}>
          <Text style={styles.text}>Brideries rênes et accessoires</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('MorsAccueilScreen')}>
          <Text style={styles.text}>Mors</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('EtriersAccueilScreen')}>
          <Text style={styles.text}>Etriers et étrivières</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('SanglesAccueilScreen')}>
          <Text style={styles.text}>Sangles et bavettes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ColiersAccueilScreen')}>
          <Text style={styles.text}>Colliers de chasses et enrênements</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('TravailAccueilScreen')}>
          <Text style={styles.text}>Travail à pied</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('SelleAccueilScreen')}>
          <Text style={styles.text}>Selles et accessoires</Text>
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

export default ChevalEtCuirAccueilScreen;

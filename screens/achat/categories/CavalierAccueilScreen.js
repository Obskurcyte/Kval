import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CavalierAccueilScreen = (props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.itemContainer}  onPress={() => props.navigation.navigate('CasquesAccueilScreen')}>
          <Text style={styles.text}>Casques d'équitation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('FemmeAccueilScreen')}>
          <Text style={styles.text}>Prêt-à-porter femme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('HommeAccueilScreen')}>
          <Text style={styles.text}>Prêt-à-porter homme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('EnfantAccueilScreen')}>
          <Text style={styles.text}>Prêt-à-porter enfant</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('GiletAccueilScreen')}>
          <Text style={styles.text}>Gilet de protection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('BottesAccueilScreen')}>
          <Text style={styles.text}>Bottes, boots et mini-chaps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('AccessoiresAccueilScreen')}>
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

export default CavalierAccueilScreen;

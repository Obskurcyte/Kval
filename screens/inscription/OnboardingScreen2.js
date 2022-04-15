import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OnboardingScreen2 = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/cheval2.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Vous avez du matériel d'occasion dans votre placard ?</Text>
      <Text style={styles.title2}>C'est le moment de s'en débarasser !</Text>

      <TouchableOpacity onPress={() => props.navigation.navigate('IdentificationScreen')} style={styles.parti}>
        <Text style={styles.text}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D51317',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center'
  },
  image: {
    marginTop: windowHeight/10
  },
  parti: {
    marginTop: '10%'
  },
  title: {
    fontSize: 25,
    marginTop:  windowHeight/11,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  title2: {
    fontSize: 25,
    marginTop: '10%',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  }
})
export default OnboardingScreen2;

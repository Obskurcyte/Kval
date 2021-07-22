import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const OnboardingScreen1 = (props) => {
  return (
    <View style={styles.container}>
        <Image
          source={require('../../assets/cheval.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Kval Occaz</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('OnboardingScreen2')} style={styles.parti}>
          <Text style={styles.text}>C'est parti !</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D51317',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center'
  },
  image: {
    marginTop: '30%'
  },
  parti: {
    marginTop: '30%'
  },
  title: {
    fontSize: 40,
    marginTop: '15%',
    fontWeight: 'bold'
  }
})
export default OnboardingScreen1;

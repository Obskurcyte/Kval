import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, Dimensions} from "react-native";
import { AntDesign } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ValidationScreen = (props) => {

  const modify = props.route.params.modify;

  return (
   <View style={styles.container}>
     <AntDesign name="checkcircleo" size={200} color="white" />
      <Text style={styles.text}>C’est en vente ! Vous pouvez retrouver l’ensemble de vos articles en vente dans votre profil</Text>
     <TouchableOpacity style={styles.retourContainer} onPress={() => {
         props.navigation.navigate('VendreArticleScreen', {
           etat: null,
           categorie: null,
           marque: null
         })
     }}>
       <Text style={styles.text}>{modify ? "Retour au profil" : "Continuer à vendre"}</Text>
     </TouchableOpacity>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D51317',
    flex: 1,
    alignItems: 'center',
    paddingTop: windowHeight/4
  },
  image: {
    height: 200,
    width: 200
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '3%',
    color: 'white',
    maxWidth: '90%'
  },
  retourContainer : {
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: windowWidth/17,
    width: windowWidth/1.1,
    alignItems: 'center',
    paddingBottom: "2%",
    marginTop: windowHeight/9
  }
})
export default ValidationScreen;

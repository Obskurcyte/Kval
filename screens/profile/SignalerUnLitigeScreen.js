import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
    Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import {Formik} from 'formik';
import * as cartActions from "../../store/actions/cart";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignalerUnLitigeScreen = () => {

  const initialValues = {
    utilisateur : '',
    article: '',
    probleme: ''
  }
  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values)
        }}
      >

        {props => (
          <View style={styles.container}>
            <Text style={styles.text}>Utilisateur concerné</Text>
            <TextInput
              placeholder="Utilisateur concerné"
              placeholderTextColor='black'
              value={props.values.utilisateur}
              style={styles.textInput}
              onChangeText={props.handleChange('utilisateur')}
            />

            <Text style={styles.text}>Article concerné</Text>
            <TextInput
              placeholder="Article concerné"
              placeholderTextColor='black'
              value={props.values.article}
              style={styles.textInput}
              onChangeText={props.handleChange('article')}
            />

            <Text style={styles.text}>Problème concerné</Text>
            <TextInput
                multiline={true}
              placeholder="Motif du litige"
              placeholderTextColor='black'
              value={props.values.probleme}
              style={styles.litigeInput}
              onChangeText={props.handleChange('probleme')}
            />



            <TouchableOpacity
              style={styles.mettreEnVente}
              onPress={props.handleSubmit}
              >
              <Text style={styles.mettreEnVenteText}>Signalez</Text>
            </TouchableOpacity>

          </View>
        )}
      </Formik>
    </View>
      </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: '4%',
    paddingLeft: '8%',
    color: 'black',
    width: '100%'
  },
  litigeInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: '4%',
    paddingLeft: '2%',
    height: 100,
    color: 'black',
    width: '100%'
  },
  text: {
    color: 'black',
    fontSize: 18,
    marginTop: '8%',
    textAlign: 'left',
    marginBottom: '3%'
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: '10%',
    width: windowWidth/1.1,
    paddingVertical: '5%',
  },
  mettreEnVenteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  container: {
    paddingHorizontal: '5%',
  }
});

export default SignalerUnLitigeScreen;

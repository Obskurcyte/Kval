import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";

const ConnectionScreen = (props) => {

  const initialValues = {
    email: "",
    password: ""
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <Text style={styles.title}>Se connecter</Text>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              await firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            } catch (err) {
              console.log(err)
            }
          }}
        >

          {props => (
            <View style={styles.formContainer}>

              <View>
                <Text style={styles.text}>Email</Text>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor='white'
                  value={props.values.email}
                  style={styles.textInput}
                  onChange={props.handleChange('email')}
                />

              </View>

              <View>
                <Text style={styles.text}>Mot de passe</Text>
                <TextInput
                  placeholder="Mot de passe"
                  placeholderTextColor='white'
                  value={props.values.password}
                  style={styles.textInput}
                  onChange={props.handleChange('password')}
                />

              </View>

              <TouchableOpacity style={styles.buttonContainer} onPress={() => props.navigation.navigate('InscriptionScreen')}>
                <Text style={styles.createCompte}>Valider</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.connecteContainer}>
          <View>
            <Text style={styles.text}>Pas encore inscrit ?</Text>
          </View>
          <View style={styles.connecte}>
            <TouchableOpacity onPress={() => props.navigation.navigate('InscriptionScreen')}>
              <Text style={styles.text}>  Crée-toi un compte</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.connecteContainer}>
          <View style={styles.connecte}>
            <TouchableOpacity onPress={() => props.navigation.navigate('ConnectionScreen')}>
              <Text style={styles.text}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D51317',
    alignItems: 'center'
  },
  title: {
    fontSize: 27,
    marginTop: '25%',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: 'white',
    textAlign: 'center'
  },
  textInput: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: '4%',
    marginTop: '2%',
    paddingLeft: '8%'
  },
  buttonContainer: {
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
    shadowColor: 'grey',
    width: '100%',
    paddingVertical: "5%",
    borderRadius: 10,
    marginTop: '20%'
  },
  createCompte: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center'
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginTop: '20%'
  },
  connecteContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10%'
  },
  formContainer: {
    width: '70%'
  },
  connecte: {
    marginBottom: '1%'
  }
})

export default ConnectionScreen;


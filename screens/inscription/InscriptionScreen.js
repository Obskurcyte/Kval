import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";
import {set} from "react-native-reanimated";

const InscriptionScreen = (props) => {

  const initialValues = {
    pseudo: '',
    email: "",
    password: ""
  }

  const params = props.route.params
  console.log(params)

  const [err, setErr] = useState(null);

  console.log('err', err)
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
      <Text style={styles.title}>Inscription</Text>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          console.log(values)
          try  {
            await firebase.auth().createUserWithEmailAndPassword(values.email, values.password).then((result) => {
              console.log('wola')
              firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                  pseudo: values.pseudo,
                  email: values.email,
                  IBAN: params.IBAN,
                  nom: params.nom,
                  prenom: params.prenom,
                  postalCode: params.postalCode,
                  ville: params.ville,
                  pays: params.pays,
                  portefeuille: 0
                })
              console.log(result)
            })
          } catch (err) {
            setErr(err)
          }
        }}
      >
        {props => (
          <View style={styles.formContainer}>
            <View>
            <Text style={styles.text}>Pseudo</Text>
            <TextInput
              placeholder='Pseudo'
              placeholderTextColor='white'
              value={props.values.pseudo}
              style={styles.textInput}
              onChangeText={props.handleChange('pseudo')}
            />

            </View>

            <View>
              <Text style={styles.text}>Email</Text>
              <TextInput
                placeholder="Email"
                placeholderTextColor='white'
                value={props.values.email}
                style={styles.textInput}
                onChangeText={props.handleChange('email')}
              />

            </View>

            <View>
              <Text style={styles.text}>Mot de passe</Text>
              <TextInput
                placeholder="Mot de passe"
                placeholderTextColor='white'
                value={props.values.password}
                style={styles.textInput}
                secureTextEntry={true}
                onChangeText={props.handleChange('password')}
              />
            </View>
              {err ? <Text style={styles.err}>Cet utilisateur existe déjà</Text> : <Text />}
            <TouchableOpacity style={styles.buttonContainer} onPress={props.handleSubmit}>
              <Text style={styles.createCompte}>Valider</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

        <View style={styles.connecteContainer}>
          <View>
            <Text style={styles.text}>Tu as déjà un compte ? </Text>
          </View>
          <View style={styles.connecte}>
            <TouchableOpacity onPress={() => props.navigation.navigate('ConnectionScreen')}>
              <Text style={styles.text2}>Connecte-toi</Text>
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
    err: {
      color: 'black',
      fontSize: 15,
        textAlign: 'center',
        marginTop: 20
    },
  title: {
    fontSize: 27,
    marginTop: '15%',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  textInput: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: '4%',
    marginTop: '2%',
    paddingLeft: '8%',
    color: 'white'
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
    marginTop: '15%'
  },
  connecteContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10%'
  },
  connecte: {
    marginTop: '4.5%'
  },
  text2: {
      color: 'white',
      fontSize: 18,
      marginTop: '10%'
  },
  formContainer: {
    width: '70%'
  }
})

export default InscriptionScreen;

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
import * as Yup from "yup";
import axios from "axios";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignalerUnLitigeScreen = (props) => {

  const initialValues = {
    utilisateur : '',
    article: '',
    probleme: ''
  }

  const LitigeSchema = Yup.object().shape({
    utilisateur: Yup.string().required("Veuillez rentrer le pseudo d'un utilisateur"),
    article: Yup.string().required("Veuillez rentrer le nom d'un article"),
    probleme: Yup.string().required("Veuillez expliquer le problème")
  });

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={LitigeSchema}
        onSubmit={async (values) => {
          await axios.post("https://kval-backend.herokuapp.com/send", {
            mail: 'info@k-val.com',
            subject: "Signalisation de litige",
            html_output: `<div><p>Bonjour, <br></p> 
<p>Un nouveau litige a été signalé : </p>
<p>Utilisateur : ${values.utilisateur}</p>
<p>Article : ${values.article}</p>
<p>Problème : ${values.probleme}</p>
</div>`
          });
          props.navigation.navigate("ValidationLitigeScreen")
        }}
      >

        {props => (
          <View style={styles.container}>
            <Text style={styles.text}>Utilisateur concerné (*)</Text>
            <TextInput
              placeholder="Utilisateur concerné"
              placeholderTextColor='black'
              value={props.values.utilisateur}
              style={styles.textInput}
              onChangeText={props.handleChange('utilisateur')}
            />

            {props.errors.utilisateur && props.errors.utilisateur ? (
                <Text style={styles.errors}>{props.errors.utilisateur}</Text>
            ) : null}

            <Text style={styles.text}>Article concerné (*)</Text>
            <TextInput
              placeholder="Article concerné"
              placeholderTextColor='black'
              value={props.values.article}
              style={styles.textInput}
              onChangeText={props.handleChange('article')}
            />

            {props.errors.article && props.errors.article ? (
                <Text style={styles.errors}>{props.errors.article}</Text>
            ) : null}

            <Text style={styles.text}>Problème concerné (*)</Text>
            <TextInput
                multiline={true}
              placeholder="Motif du litige"
              placeholderTextColor='black'
              value={props.values.probleme}
              style={styles.litigeInput}
              onChangeText={props.handleChange('probleme')}
            />
            {props.errors.probleme && props.errors.probleme ? (
                <Text style={styles.errors}>{props.errors.probleme}</Text>
            ) : null}

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
  errors: {
    color: 'red'
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

import React, {useContext, useEffect} from 'react';
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
import authContext from "../../context/authContext";


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


  const ctx = useContext(authContext);

  const user = ctx.user;

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={LitigeSchema}
        onSubmit={async (values) => {
          await axios.post("https://kval-backend.herokuapp.com/send", {
            mail: 'contact@kvaloccaz.com',
            subject: "Signalisation de litige",
            html_output: `<div><p>Bonjour, <br></p> 
<p>Un nouveau litige a été signalé : </p>
<p>Utilisateur : ${values.utilisateur}</p>
<p>Mail : ${user.email}</p>
<p>Téléphone : ${user.phone}</p>
<p>Article : ${values.article}</p>
<br>

<p>Problème : ${values.probleme}</p>

<br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">

</div>`
          });
          await axios.post("https://kval-backend.herokuapp.com/send", {
            mail: user.email,
            subject: "Signalisation de litige",
            html_output: `<div><p>Bonjour ${user.pseudo}, <br></p> 
<p>Vous avez fait une demande d’ouverture de litige par l’interface de litige, votre message est le suivant :
<br>
${values.probleme}
</p>
 <div style="margin-top: 20px">
            <p style="margin: 0">Pseudo de l'utilisateur en litige: ${values.utilisateur}</p>
            <p style="margin: 0">Article concerné : ${values.article}</p>
</div>

<p style="margin: 0">Nous vous confirmons que votre message à été reçu par le service contentieux de KvalOccaz,
celui-ci prendra contact avec vous sous 24h.
</p>
<br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
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

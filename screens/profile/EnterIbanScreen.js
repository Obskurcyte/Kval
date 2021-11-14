import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import firebase from "firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../../store/actions/users";
import * as Yup from "yup";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EnterIbanScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getUser());
  }, [dispatch]);

  const userData = useSelector((state) => state.user.userData);
  console.log(userData);

  const IBANSchema = Yup.object().shape({
    IBAN: Yup.string().required("Veuillez rentrer un IBAN"),
    BIC: Yup.string().required("Veuillez rentrer un BIC")
  });

  const initialValues = {
    IBAN: userData?.IBAN ? userData.IBAN : "",
    BIC: "",
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>IBAN</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={IBANSchema}
        onSubmit={async (values) => {
          console.log(values);
          await axios.post("https://kval-backend.herokuapp.com/send", {
            mail: userData.email,
            subject: "Confirmation de boost d'articles",
            html_output: `<div><p>Bonjour, ${userData.pseudo}, <br></p> 
<p>Nous vous confirmons que votre demande de transfert de ${userData.portefeuille} a bien été prise en compte</p>
<p>L'argent sera disponible sur votre compte bancaire sous 48h</p>
<br>
<p style="color: red">L'équipe KVal Occaz vous remercie de votre confiance</p>
<img src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">

</div>`
          });
          await axios.post("https://kval-backend.herokuapp.com/send", {
            mail: 'info@k-val.com',
            subject: "Demande de transfert d'argent",
            html_output: `<div><p>Bonjour, <br></p> 
<p>Une nouvelle de demande de transfert d'argent : </p>
<p>BIC : ${values.BIC}</p>
<p>IBAN : ${values.IBAN}</p>
</div>`
          });
          await firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
              IBAN: values.IBAN,
            })
            .then(() => props.navigation.navigate("ValidationIBANScreen"));
        }}
      >
        {(props) => (
          <View>
            <TextInput
              placeholder="IBAN"
              style={styles.input}
              value={props.values.IBAN}
              onChangeText={props.handleChange("IBAN")}
            />
            {props.errors.IBAN && props.errors.IBAN ? (
                <Text style={styles.errors}>{props.errors.IBAN}</Text>
            ) : null}
            <TextInput
              placeholder="BIC"
              style={styles.input}
              value={props.values.BIC}
              onChangeText={props.handleChange("BIC")}
            />
            {props.errors.BIC && props.errors.BIC ? (
                <Text style={styles.errors}>{props.errors.BIC}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.mettreEnVente}
              onPress={props.handleSubmit}
            >
              <Text style={styles.mettreEnVenteText}>Soumettre</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    width: windowWidth / 1.1,
    paddingVertical: "5%",
  },
  errors: {
    color: 'red'
  },
  mettreEnVenteText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  container: {
    paddingHorizontal: "6%",
    paddingVertical: "7%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "justify",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#A7A9BE",
    paddingVertical: "4%",
    borderRadius: 5,
    paddingHorizontal: "3%",
    marginBottom: "5%",
  },
});

export default EnterIbanScreen;

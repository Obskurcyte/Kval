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
            IBAN: values.IBAN,
            BIC: values.BIC,
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

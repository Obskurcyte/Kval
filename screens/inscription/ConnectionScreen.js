import React, {useContext, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import firebase from "firebase";
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import authContext from "../../context/authContext";

const ConnectionScreen = (props) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [err, setErr] = useState(null);
  const { setSignedIn } = useContext(authContext);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>Se connecter</Text>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
                const response = await axios.post(`${BASE_URL}/api/users/login`, {
                  email: values.email,
                  password: values.password,
                })

                console.log('res', response)
                const token = response.data.token;
                console.log('token', token);
                await AsyncStorage.setItem("jwt", token)
                const decoded = jwt_decode(token)
                console.log('decoded', decoded);
                await AsyncStorage.setItem("userId", decoded.userId);
                setSignedIn(true);
            } catch (err) {
              console.log(err);
              setErr(err);
            }
          }}
        >
          {(props) => (
            <View style={styles.formContainer}>
              <View>
                <Text style={styles.text}>Email</Text>
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCompleteType="email"
                  placeholderTextColor="white"
                  value={props.values.email}
                  style={styles.textInput}
                  onChangeText={props.handleChange("email")}
                />
              </View>

              <View>
                <Text style={styles.text}>Mot de passe</Text>
                <TextInput
                  placeholder="Mot de passe"
                  placeholderTextColor="white"
                  value={props.values.password}
                  style={styles.textInput}
                  secureTextEntry={true}
                  onChangeText={props.handleChange("password")}
                />
              </View>

              {err ? (
                <Text style={styles.err}>Vos identifiants sont incorrects</Text>
              ) : (
                <Text />
              )}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={props.handleSubmit}
              >
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
            <TouchableOpacity
              onPress={() => props.navigation.navigate("PreInscriptionScreen")}
            >
              <Text style={styles.text}> Crée-toi un compte</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.connecteContainer}>
          <View style={styles.connecte}>
            <TouchableOpacity
              onPress={() => {
                console.log("hey");
                props.navigation.navigate("ForgotPasswordScreen");
              }}
            >
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
    backgroundColor: "#D51317",
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    marginTop: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  textInput: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    color: "white",
    paddingVertical: "4%",
    marginTop: 10,
    paddingLeft: "8%",
  },
  buttonContainer: {
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
    shadowColor: "grey",
    width: "100%",
    paddingVertical: "5%",
    borderRadius: 10,
    marginTop: 15,
  },
  err: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },
  createCompte: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    marginTop: 35,
  },
  connecteContainer: {
    display: "flex",
    flexDirection: "row",
  },
  formContainer: {
    width: "70%",
  },
  connecte: {
    marginBottom: "1%",
  },
});

export default ConnectionScreen;

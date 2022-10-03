import React, {useContext, useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions, Modal, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
} from "react-native";
import { Formik } from "formik";
import firebase from "firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {BASE_URL} from "../../constants/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import authContext from "../../context/authContext";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EnterIbanScreen = (props) => {


  const { signedIn, setSignedIn } = useContext(authContext);

  const [userData, setUserData] = useState(null);

  let bigProps = props
  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setUserData(data)
    }
    getUser()
  }, []);


  const IBANSchema = Yup.object().shape({
    IBAN: Yup.string().required("Veuillez rentrer un IBAN"),
    BIC: Yup.string().required("Veuillez rentrer un BIC")
  });

  const initialValues = {
    IBAN: userData?.IBAN ? userData.IBAN : "",
    BIC: "",
  };

  const initialValues2 = {
    email: "",
    password: "",
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [BIC, setBIC] = useState("");
  const [IBAN, setIBAN] = useState("");

  const [auth, setAuth] = useState(false);
  const [confirmAuth, setConfirmAuth] = useState(false);
  const [err, setErr] = useState(null);
  const askMoney = async (BIC, IBAN) => {
    await axios.post(
        "https://kval-backend.herokuapp.com/send",
        {
          mail: userData.email,
          subject: "Confirmation de virement",
          html_output: `<div><p>Bonjour, ${userData.pseudo}, <br></p> 
<p>Nous vous confirmons que votre demande de transfert de ${userData.portefeuille.toFixed(2)} € a bien été prise en compte.</p>
<p>Les fonds seront disponibles d’ici 72h00 sur le compte bancaire suivant :
</p>
        <div style="margin-top: 20px">
            <p style="margin: 0">IBAN : ${IBAN}</p>
            <p style="margin: 0">BIC: ${BIC}</p>
        </div>
<br>
<p>Le service client prendra contact avec vous sous peu afin de confirmer cette demande.</p>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`
        });
    await axios.post("https://kval-backend.herokuapp.com/send", {
      mail: 'contact@kvaloccaz.com',
      subject: "Demande de transfert d'argent",
      html_output: `<div><p>Bonjour, <br></p> 
<p>L’utilisateur ${userData.pseudo}, mail ${userData.email}, demande un virement de ${userData.portefeuille} € sur le compte bancaire suivant :</p>
  <div style="margin-top: 20px">
            <p style="margin: 0">IBAN : ${IBAN}</p>
            <p style="margin: 0">BIC: ${BIC}</p>
  </div>
    <br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`
    });
    await axios.put(`${BASE_URL}/api/users/portefeuille`, {
      id: userData._id,
      portefeuille: 0
    });
  }

  return (
      <View style={styles.container}>
        {auth ? <View>
          <Text style={styles.title}>IBAN</Text>
          <Formik
              initialValues={initialValues}
              validationSchema={IBANSchema}
              onSubmit={(values) => {
                setBIC(values.BIC)
                setIBAN(values.IBAN)
                setModalVisible(true)
              }}
          >
            {(props) => (
                <View>
                  <Modal transparent={true} visible={modalVisible}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                          Vous êtes sur le point de faire un virement bancaire pour {userData.portefeuille.toFixed(2)} €, confirmez-vous cette demande ? Si oui, une confirmation supplémentaire par le service client sera demandée.
                        </Text>
                        <TouchableOpacity
                            style={styles.mettreEnVentePopup}
                            onPress={async () => {
                              await askMoney(BIC, IBAN)
                              setModalVisible(false);
                              bigProps.navigation.navigate("ValidationIBANScreen");
                            }}
                        >
                          <Text style={styles.mettreEnVenteText}>
                            Oui
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.reset}
                            onPress={() => {
                              setModalVisible(false);
                            }}
                        >
                          <Text style={styles.resetText}>Annuler</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                  <TextInput
                      placeholder="IBAN"
                      style={styles.input}
                      value={props.values.IBAN}
                      onChangeText={props.handleChange("IBAN")}
                  />
                  {props.errors.IBAN && props.errors.IBAN ? (
                      <Text style={styles.errors}>{props.errors.IBAN}</Text>
                  ) : null}
                  <Text style={styles.title}>BIC</Text>
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
        </View> : <View>
          {!confirmAuth ? <View>
            <Text style={styles.authText}>Pour votre sécurité nous vous demandons de vous authentifier</Text>
            <TouchableOpacity
                style={styles.mettreEnVente}
                onPress={() => setConfirmAuth(true)}
            >
              <Text style={styles.mettreEnVenteText}>
                M'authentifier
              </Text>
            </TouchableOpacity>
          </View> :    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container3}>
            <KeyboardAvoidingView style={styles.container3} behavior="padding">
              <Text style={styles.title2}>Se connecter</Text>
              <Formik
                  initialValues={initialValues2}
                  onSubmit={async (values) => {
                    console.log(values);
                    try {
                      const response = await axios.post(`${BASE_URL}/api/users/login`, {
                        email: values.email,
                        password: values.password,
                      })

                      const token = response.data.token;
                      console.log('token', token);
                      await AsyncStorage.setItem("jwt", token)
                      const decoded = jwt_decode(token)
                      console.log('decoded', decoded);
                      await AsyncStorage.setItem("userId", decoded.userId);
                      setSignedIn(true);
                      setAuth(true);
                    } catch (err) {
                      console.log(err);
                      setErr(err);
                    }
                  }}
              >
                {(props) => (
                    <View style={styles.formContainer}>
                      <View>
                        <Text style={styles.text4}>Email</Text>
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
                        <Text style={styles.text4}>Mot de passe</Text>
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
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>}

        </View>}

      </View>
  );
};

const styles = StyleSheet.create({
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    width: windowWidth / 1.1,
    paddingVertical: "5%",
    alignSelf: 'center'
  },
  errors: {
    color: 'red'
  },
  mettreEnVenteText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    textAlign: "justify",
    fontWeight: "bold",
    marginLeft: 20,
    marginVertical: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#A7A9BE",
    paddingVertical: "4%",
    borderRadius: 5,
    paddingHorizontal: "3%",
    marginBottom: "5%",
    maxWidth: "90%",
    marginLeft: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  mettreEnVentePopup: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    width: windowWidth / 1.5,
    paddingVertical: "5%",
  },
  resetText: {
    color: "#D51317",
    textAlign: "center",
    fontSize: 18,
  },
  reset: {
    backgroundColor: "#fff",
    marginTop: "5%",
    width: windowWidth / 1.5,
    borderColor: "#D51317",
    paddingVertical: "5%",
    marginBottom: 15,
  },
  authText: {
    fontSize: 20,
    textAlign: 'center'
  },
  container3: {
    backgroundColor: "#D51317",
    alignItems: "center",
  },
  title2: {
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
    color: 'white',
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
    marginBottom: "100%"
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
  text4: {
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

export default EnterIbanScreen;

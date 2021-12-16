import React, { useState } from "react";
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
    ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import firebase from "firebase";
import { set } from "react-native-reanimated";
import * as Notifications from "expo-notifications";
import axios from "axios";

const InscriptionScreen = (props) => {
    const initialValues = {
        pseudo: "",
        email: "",
        password: "",
    };

    const params = props.route.params;
    console.log(params);

    const [err, setErr] = useState(null);

    console.log("err", err);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.title}>Inscription</Text>
                <Formik
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        console.log(values);
                        let pushToken;
                        let statusObj = await Notifications.getPermissionsAsync();
                        if (statusObj.status !== "granted") {
                            statusObj = await Notifications.requestPermissionsAsync();
                        }
                        if (statusObj.status !== "granted") {
                            pushToken = null;
                        } else {
                            pushToken = await Notifications.getExpoPushTokenAsync();
                        }
                        await firebase
                            .auth()
                            .createUserWithEmailAndPassword(values.email, values.password)
                            .then(async (result) => {
                                await firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(firebase.auth().currentUser.uid)
                                    .collection("unreadMessage")
                                    .doc("firstKey")
                                    .set({
                                        count: 1,
                                    });

                                await firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(firebase.auth().currentUser.uid)
                                    .set({
                                        pseudo: values.pseudo,
                                        email: values.email,
                                        IBAN: params.IBAN,
                                        nom: params.nom,
                                        id: firebase.auth().currentUser.uid,
                                        prenom: params.prenom,
                                        pushToken: pushToken.data,
                                        pays: params.pays,
                                        adresse: params.adresse,
                                        portefeuille: 0,
                                    });

                                await axios
                                    .post("https://kval-backend.herokuapp.com/send", {
                                        mail: values.email,
                                        subject: "Confirmation de création de compte",
                                        html_output: `<div><p>Félicitations, ${values.pseudo}, <br></p> 
<p>Votre compte vient d'être créé.</p><br>
<p style="margin: 0">Votre pseudo : ${values.pseudo}</p>
<p style="margin: 0">Votre adresse mail : ${values.email}</p>
<p style="margin: 0">Votre mot de passe : ${values.password}</p>
<br>
<p>Il ne vous reste plus qu'à utiliser l'application... bon shopping</p>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
                                    })
                                    .then(() => props.setIsLoggedIn(true))
                                    .catch((err) => {
                                        console.log(err);
                                        props.setIsLoggedIn(true);
                                    });
                            });
                    }}
                >
                    {(props) => (
                        <View style={styles.formContainer}>
                            <View>
                                <Text style={styles.text}>Pseudo</Text>
                                <TextInput
                                    placeholder="Pseudo"
                                    placeholderTextColor="white"
                                    value={props.values.pseudo}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("pseudo")}
                                />
                            </View>
                            <View>
                                <Text style={styles.text}>Email</Text>
                                <TextInput
                                    placeholder="Email"
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
                                <Text style={styles.err}>Cet utilisateur existe déjà</Text>
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
                        <Text style={styles.text}>Tu as déjà un compte ? </Text>
                    </View>
                    <View style={styles.connecte}>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("ConnectionScreen")}
                        >
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
        backgroundColor: "#D51317",
        alignItems: "center",
    },
    err: {
        color: "black",
        fontSize: 15,
        textAlign: "center",
        marginTop: 20,
    },
    title: {
        fontSize: 27,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    textInput: {
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: "4%",
        marginTop: "2%",
        paddingLeft: "8%",
        color: "white",
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
        marginTop: "20%",
    },
    createCompte: {
        color: "black",
        fontSize: 18,
        textAlign: "center",
    },
    text: {
        color: "white",
        fontSize: 18,
        marginTop: "15%",
    },
    connecteContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: "10%",
    },
    connecte: {
        marginTop: "4.5%",
    },
    text2: {
        color: "white",
        fontSize: 18,
        marginTop: "10%",
    },
    formContainer: {
        width: "70%",
    },
});

export default InscriptionScreen;

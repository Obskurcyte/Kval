import React, {useContext, useEffect, useState} from "react";
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
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import {BASE_URL} from "../../constants/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import authContext from "../../context/authContext";
import * as Yup from 'yup';

const InscriptionScreen = (props) => {
    const initialValues = {
        pseudo: "",
        email: "",
        password: "",
    };

    const SignupSchema = Yup.object().shape({
        pseudo: Yup.string().required('Ce champ est requis'),
        email: Yup.string().email('Veuillez rentrer un email valide').required('Ce champ est requis'),
    });

    const params = props.route.params;

    const { setSignedIn, setIsLoggedIn } = useContext(authContext);
    console.log("params", params)
    const [err, setErr] = useState(null);

    const [isLoading, setIsLoading] = useState(false)
    const [pushToken, setPushToken] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            let statusObj = await Notifications.getPermissionsAsync();
            if (statusObj.status !== "granted") {
                statusObj = await Notifications.requestPermissionsAsync();
            }
            if (statusObj.status !== "granted") {
                setPushToken(null);
            } else {
                setPushToken(await Notifications.getExpoPushTokenAsync());
            }
        }
        getToken();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                >
                    <Text style={styles.title}>Inscription</Text>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignupSchema}
                        onSubmit={async (values) => {
                            setIsLoading(true)
                            try {
                                console.log('token', pushToken)
                                const response = await axios.post(`${BASE_URL}/api/users/register`, {
                                    email: values.email.trim().toLowerCase(),
                                    password: values.password,
                                    pseudo: values.pseudo,
                                    phone: params.phone,
                                    unreadMessages: 0,
                                    portefeuille: 0,
                                    pushToken: pushToken.data,
                                    firstName: params.prenom,
                                    lastName: params.nom
                                })

                                const token = response.data.token;
                                await AsyncStorage.setItem("jwt", token)
                                const decoded = jwt_decode(token)
                                await AsyncStorage.setItem("userId", decoded.id)
                                await AsyncStorage.setItem("userType", 'particulier')

                                await axios.post("https://kval-backend.herokuapp.com/send", {
                                    mail: values.email,
                                    subject: "Confirmation de création de compte",
                                    html_output: `<div><p>Félicitations ${values.pseudo}, <br></p> 
<p>Votre compte vient d'être créé.</p><br>
<p style="margin: 0">Votre pseudo : ${values.pseudo}</p>
<p style="margin: 0">Votre adresse mail : ${values.email}</p>
<p style="margin: 0">Votre mot de passe : ${values.password}</p>
<br>
<p>Il ne vous reste plus qu'à utiliser l'application... bon shopping</p>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
                                }).then(() => {
                                    setIsLoading(false)
                                    setSignedIn(true)
                                    setIsLoggedIn(true)
                                })
                            } catch (err){
                                setIsLoading(false)
                                console.log(err);
                                setErr(true)
                            }
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
                                {props.errors.pseudo && props.touched.pseudo ?  <Text style={styles.err}>{props.errors.pseudo}</Text> : null}

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

                                {props.errors.email && props.touched.email ?  <Text style={styles.err}>{props.errors.email}</Text> : null}

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
                                {isLoading ? <ActivityIndicator color="black" size="large"/> : <TouchableOpacity
                                    style={styles.buttonContainer}
                                    onPress={props.handleSubmit}
                                >
                                    <Text style={styles.createCompte}>Valider</Text>
                                </TouchableOpacity>}

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
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D51317",
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
        alignSelf: 'center'
    },
});

export default InscriptionScreen;

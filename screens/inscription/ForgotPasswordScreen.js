import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Text,
    TextInput, TouchableOpacity
} from "react-native";
import {Formik} from "formik";
import firebase from "firebase";

const ForgotPasswordScreen = (props) => {
    const initialValues = {
        email: "",
    };

    const [received, setReceived] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.title}>Mot de passe oublié</Text>
                <Formik
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        console.log(values);
                        firebase.auth().sendPasswordResetEmail(values.email)
                            .then(() => {
                                setReceived(true)
                                console.log('okay')
                            })
                            .catch((error) => {
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log(errorMessage)
                                // ..
                            });
                    }}
                >
                    {(props) => (
                        <View style={styles.formContainer}>
                            <View>
                                <Text style={styles.text}>Veuillez rentrer votre email</Text>
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

                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={props.handleSubmit}
                            >
                                <Text style={styles.createCompte}>Réinitialiser mon mot de passe</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                {received ?      <View style={styles.receivedEmail}>
                    <Text style={styles.receivedText}>Vous avez reçu un email de réinitialisation ! </Text>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => props.navigation.navigate('ConnectionScreen')}>
                        <Text style={styles.createCompte}>Retour à la page de connexion</Text>
                    </TouchableOpacity>
                </View> : <Text/>}


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
    receivedEmail: {
        marginTop: 25,
        width: '80%'
    },
    receivedText: {
      color: 'white',
      fontSize: 20,
        textAlign: 'center'
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
        paddingHorizontal: 10
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

export default ForgotPasswordScreen;

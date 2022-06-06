import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Formik} from "formik";
import firebase from "firebase";
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";

const InputNewPasswordScreen = (props) => {

    const initialValues = {
        password: "",
    };

    const email = props.route.params.email
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.title}>Rentrez votre nouveau mot de passe</Text>
                <Formik
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        await axios.post(`${BASE_URL}/api/users/password`, {
                            email: email,
                            password: values.password
                        })
                        props.navigation.navigate("ConfirmationPasswordResetScreen")
                    }}
                >
                    {(props) => (
                        <View style={styles.formContainer}>
                            <View>
                                <Text style={styles.text}>Veuillez rentrez votre nouveau mot de passe</Text>
                                <TextInput
                                    placeholder="Mot de passe"
                                    secureTextEntry={true}
                                    placeholderTextColor="white"
                                    value={props.values.password}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("password")}
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

export default InputNewPasswordScreen;

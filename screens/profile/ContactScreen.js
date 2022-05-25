import React, {useContext, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard, KeyboardAvoidingView
} from 'react-native';
import {Formik} from "formik";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import call from 'react-native-phone-call'
import axios from "axios";
import authContext from "../../context/authContext";

const ContactScreen = (props) => {

    const initialValues = {
        message: '',
    }

    const args = {
        number: "0760586748", // String value with the number to call
        prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
    }

    const ctx = useContext(authContext);

    const user = ctx.user;


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.container}>
                    <Text style={styles.title}>Formulaire de contact</Text>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: user.email,
                                subject: "Prise de contact",
                                html_output: `<div><p>Bonjour ${user.pseudo},<br></p> 
<p>Vous avez fait une demande par l’interface de contact, votre message est le suivant :
<br>
${values.message}
</p>
<br>
<p style="margin: 0">Nous vous confirmons que votre message à été reçu par le service client de KvalOccaz,
celui-ci prendra contact avec vous sous 24h.
</p>
<br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`
                            });
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: 'contact@kvaloccaz.com',
                                subject: "Prise de contact",
                                html_output: `<div><p>Bonjour, <br></p> 
<p>L'utilisateur ${user.pseudo}, mail ${user.email}, téléphone ${user.phone} vous envoie ce message :</p>
<p>${values.message}</p>
<br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`
                            });
                            props.navigation.navigate('ValidationContactScreen')
                        }}
                    >
                        {props => (
                            <View>
                                <Text style={styles.label}>Message (*)</Text>
                                <TextInput
                                    multiline={true}
                                    placeholder="Message"
                                    style={styles.inputMessage}
                                    value={props.values.message}
                                    onChangeText={props.handleChange('message')}
                                />

                                <TouchableOpacity
                                    style={styles.mettreEnVente}
                                    onPress={props.handleSubmit}
                                >
                                    <Text style={styles.mettreEnVenteText}>Envoyer le message</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <View style={styles.contact}>
                        <Text style={styles.contactText}>Contact téléphonique: </Text>
                        <TouchableOpacity onPress={() => call(args).catch(console.error)}>
                            <Text style={styles.contactTextBlue}>07 60 58 67 48</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    contactText: {
        fontSize: 17,
    },
    contactTextBlue: {
        fontSize: 17,
        color: 'blue'
    },
    contact: {
        marginRight: '40%',
        marginTop: '10%',
        width: '100%'
    },
    label: {
        marginLeft: 5
    },
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '5%',
        width: windowWidth/1.1,
        paddingVertical: '5%'
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    container: {
        paddingHorizontal: '6%',
        paddingVertical: '2%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        textAlign: 'justify',
        fontWeight: 'bold',
        marginBottom: '5%'
    },
    input: {
        borderWidth: 1,
        borderColor: '#A7A9BE',
        paddingVertical: '3%',
        borderRadius: 5,
        paddingHorizontal: '3%',
        marginBottom: '5%'
    },
    inputMessage: {
        borderWidth: 1,
        borderColor: '#A7A9BE',
        paddingVertical: '4%',
        borderRadius: 5,
        paddingHorizontal: '3%',
        marginBottom: '5%',
        height: 100
    }
});

export default ContactScreen;

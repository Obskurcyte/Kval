import React, {useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard, KeyboardAvoidingView
} from 'react-native';
import {Formik} from "formik";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import call from 'react-native-phone-call'

const ContactScreen = (props) => {

    const initialValues = {
        nom: '',
        prenom: '',
        phone: '',
        message: '',
        mail: ''
    }

    const args = {
        number: "0760586748", // String value with the number to call
        prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.container}>
                    <Text style={styles.title}>Formulaire de contact</Text>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            props.navigation.navigate('ValidationContactScreen')
                        }}
                    >
                        {props => (
                            <View>
                                <TextInput
                                    placeholder="Nom"
                                    style={styles.input}
                                    value={props.values.nom}
                                    onChangeText={props.handleChange('nom')}
                                />
                                <TextInput
                                    placeholder="Prénom"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={props.values.prenom}
                                    onChangeText={props.handleChange('prenom')}
                                />
                                <TextInput
                                    placeholder="Téléphone"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={props.values.phone}
                                    onChangeText={props.handleChange('phone')}
                                />
                                <TextInput
                                    placeholder="Mail"
                                    style={styles.input}
                                    value={props.values.mail}
                                    onChangeText={props.handleChange('mail')}
                                />
                                <TextInput
                                    placeholder="Message"
                                    style={styles.input}
                                    value={props.values.mail}
                                    onChangeText={props.handleChange('Message')}
                                />

                                <TouchableOpacity
                                    style={styles.mettreEnVente}
                                    onPress={props.handleSubmit}
                                >
                                    <Text style={styles.mettreEnVenteText}>Nous contacter</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>


                    <View style={styles.contact}>
                        <Text style={styles.contactText}>Contact : </Text>
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
        fontSize: 20,
    },
    contactTextBlue: {
        fontSize: 20,
        color: 'blue'
    },
    contact: {
        marginRight: '50%',
        marginTop: '10%'
    },
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '5%',
        marginLeft: '5%',
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
        paddingVertical: '7%',
        alignItems: 'center'
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
        paddingVertical: '4%',
        borderRadius: 5,
        paddingHorizontal: '3%',
        marginBottom: '5%'
    }
});

export default ContactScreen;

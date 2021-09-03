import React from 'react';
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
    ScrollView
} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";
import * as Yup from 'yup';

const PreInscriptionScreen = (props) => {

    const initialValues = {
        nom: '',
        prenom: "",
        IBAN: "",
        adresse: '',
        postalCode: '',
        ville: '',
        pays: ''
    }

    const InfoSchema = Yup.object().shape({
        nom: Yup.string().required('Ce champ est requis'),
        prenom: Yup.string().required('Ce champ est requis'),
        IBAN: Yup.string().required('Ce champ est requis'),
        adresse: Yup.string().required('Ce champ est requis'),
        postalCode: Yup.string().required('Ce champ est requis'),
        ville: Yup.string().required('Ce champ est requis'),
        pays: Yup.string().required('Ce champ est requis'),
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <Text style={styles.title}>Vos informations</Text>
                <Formik
                    initialValues={initialValues}
                    validationSchema={InfoSchema}
                    onSubmit={async (values) => {
                        props.navigation.navigate('InscriptionScreen', {
                            nom: values.nom,
                            prenom: values.prenom,
                            IBAN: values.IBAN,
                            adresse: values.adresse,
                            postalCode: values.postalCode,
                            ville: values.ville,
                            pays: values.pays
                        })
                    }}
                >
                    {props => (

                        <ScrollView style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Nom</Text>
                                <TextInput
                                    placeholder='Nom'
                                    placeholderTextColor='white'
                                    value={props.values.nom}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('nom')}
                                />
                            </View>

                            {props.errors.nom && props.touched.nom ? (
                                <Text style={styles.errors}>{props.errors.nom}</Text>
                            ) : <Text />}

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Prénom</Text>
                                <TextInput
                                    placeholder="Prénom"
                                    placeholderTextColor='white'
                                    value={props.values.prenom}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('prenom')}
                                />
                            </View>

                            {props.errors.prenom && props.touched.prenom ? (
                                <Text style={styles.errors}>{props.errors.prenom}</Text>
                            ) : <Text />}

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>IBAN</Text>
                                <TextInput
                                    placeholder="IBAN"
                                    placeholderTextColor='white'
                                    value={props.values.IBAN}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('IBAN')}
                                />
                            </View>

                            {props.errors.IBAN && props.touched.IBAN ? (
                                <Text style={styles.errors}>{props.errors.IBAN}</Text>
                            ) : <Text />}

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Adresse</Text>
                                <TextInput
                                    placeholder="Adresse"
                                    placeholderTextColor='white'
                                    value={props.values.adresse}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('adresse')}
                                />
                            </View>

                            {props.errors.adresse && props.touched.adresse ? (
                                <Text style={styles.errors}>{props.errors.adresse}</Text>
                            ) : <Text />}

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Code Postal</Text>
                                <TextInput
                                    placeholder="Code Postal"
                                    placeholderTextColor='white'
                                    value={props.values.postalCode}
                                    keyboardType="numeric"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('postalCode')}
                                />
                            </View>

                            {props.errors.postalCode && props.touched.postalCode ? (
                                <Text style={styles.errors}>{props.errors.postalCode}</Text>
                            ) : <Text />}

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Ville</Text>
                                <TextInput
                                    placeholder="Ville"
                                    placeholderTextColor='white'
                                    value={props.values.ville}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('ville')}
                                />
                            </View>

                            {props.errors.ville && props.touched.ville ? (
                                <Text style={styles.errors}>{props.errors.ville}</Text>
                            ) : <Text />}

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Pays</Text>
                                <TextInput
                                    placeholder="Pays"
                                    placeholderTextColor='white'
                                    value={props.values.pays}
                                    style={styles.textInput}
                                    onChangeText={props.handleChange('pays')}
                                />
                            </View>
                            {props.errors.pays && props.touched.pays ? (
                                <Text style={styles.errors}>{props.errors.pays}</Text>
                            ) : <Text />}

                            <TouchableOpacity style={styles.buttonContainer} onPress={props.handleSubmit}>
                                <Text style={styles.createCompte}>Suivant</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D51317',
        alignItems: 'center'
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        marginTop: '20%',
        textAlign: 'center'
    },
    textInput: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: '4%',
        marginTop: '2%',
        paddingLeft: '8%',
        color: 'white'
    },
    buttonContainer: {
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1,
        shadowColor: 'grey',
        width: '100%',
        paddingVertical: "5%",
        borderRadius: 10,
        marginTop: '20%',
        marginBottom: '5%'
    },
    createCompte: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center'
    },
    text: {
        color: 'white',
        fontSize: 18,
        marginTop: '15%'
    },
    connecteContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '10%'
    },
    connecte: {
        marginTop: '4.5%'
    },
    text2: {
        color: 'white',
        fontSize: 18,
        marginTop: '10%'
    },
    formContainer: {
        width: '90%'
    },
    inputContainer: {
        paddingHorizontal: '7%'
    },
    errors: {
        color: 'black',
        textAlign: 'center'
    }
})

export default PreInscriptionScreen;

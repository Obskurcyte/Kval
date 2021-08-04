import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";
import {useDispatch, useSelector} from "react-redux";
import * as userActions from "../../store/actions/users";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModifierAdresseScreen = (props) => {


    const initialValues = {
        adresse: '',
        postalCode: '',
        ville: '',
        pays: ''
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getUser())
    }, [dispatch]);

    const userData = useSelector(state => state.user.userData);
    console.log(userData)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adresse</Text>
            <Text style={{fontSize: 18, marginBottom: '10%'}}>Adresse actuelle : <Text style={{color: '#D51317', fontSize: 16}}>{userData?.adresse}</Text></Text>

            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    console.log(values)
                    await firebase.firestore().collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .update({
                            adresse: values.adresse,
                            postalCode: values.postalCode,
                            ville: values.ville,
                            pays: values.pays
                        }).then(() => props.navigation.navigate('InformationsScreen'))
                }}
            >
                {props => (
                    <View>
                        <Text>Nouvelle adresse</Text>
                        <TextInput
                            placeholder="Adresse"
                            style={styles.input}
                            value={props.values.adresse}
                            onChangeText={props.handleChange('adresse')}
                        />
                        <TextInput
                            placeholder="Code Postal"
                            style={styles.input}
                            keyboardType="numeric"
                            value={props.values.postalCode}
                            onChangeText={props.handleChange('postalCode')}
                        />
                        <TextInput
                            placeholder="Ville"
                            style={styles.input}
                            value={props.values.ville}
                            onChangeText={props.handleChange('ville')}
                        />
                        <TextInput
                            placeholder="Pays"
                            style={styles.input}
                            value={props.values.pays}
                            onChangeText={props.handleChange('pays')}
                        />

                        <TouchableOpacity
                            style={styles.mettreEnVente}
                            onPress={props.handleSubmit}
                        >
                            <Text style={styles.mettreEnVenteText}>Confirmer la modification</Text>
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
        fontWeight: 'bold'
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

export default ModifierAdresseScreen;

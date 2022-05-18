import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";
import {useDispatch, useSelector} from "react-redux";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const IbanChoiceScreen = (props) => {

    const initialValues = {
        IBAN: '',
    }

    const userData = useSelector(state => state.user.userData);
    console.log(userData)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>IBAN</Text>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    console.log(values)
                    await firebase.firestore().collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .update({
                            IBAN: values.IBAN
                        }).then(() => props.navigation.navigate('CartScreen'))
                }}
            >
                {props => (
                    <View>
                        <TextInput
                            placeholder="IBAN"
                            style={styles.input}
                            value={props.values.IBAN}
                            onChangeText={props.handleChange('IBAN')}
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

export default IbanChoiceScreen;

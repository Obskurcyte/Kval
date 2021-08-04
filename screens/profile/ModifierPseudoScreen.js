import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";
import {useDispatch, useSelector} from "react-redux";
import * as userActions from "../../store/actions/users";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModifierPseudoScreen = (props) => {

    const initialValues = {
        initial: '',
        confirmed: ''
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getUser())
    }, [dispatch]);

    const userData = useSelector(state => state.user.userData);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pseudo</Text>
            <Text style={{fontSize: 18, marginBottom: '10%'}}>Actuel : <Text style={{color: '#D51317', fontSize: 16}}>{userData.pseudo}</Text></Text>

            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    console.log(values)
                    await firebase.firestore().collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .update({
                            pseudo: values.initial
                        }).then(() => props.navigation.navigate('InformationsScreen'))
                }}
            >
                {props => (
                    <View>
                        <Text>Nouveau pseudo</Text>
                        <TextInput
                            placeholder="Pseudo"
                            style={styles.input}
                            value={props.values.initial}
                            onChangeText={props.handleChange('initial')}
                        />
                        <Text>Confirmer votre nouveaux pseudo</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Pseudo"
                            value={props.values.confirmed}
                            onChangeText={props.handleChange('confirmed')}
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
        marginBottom: '5%',

    }
});

export default ModifierPseudoScreen;

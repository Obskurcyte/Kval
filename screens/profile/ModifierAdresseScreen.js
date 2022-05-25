import React, {useEffect, useState} from 'react';
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
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModifierAdresseScreen = (props) => {


    const initialValues = {
        adresse: '',
        postalCode: '',
        ville: '',
        pays: ''
    }

    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            const userId = await AsyncStorage.getItem("userId");
            const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
            setUserData(data)
        }
        const unsubscribe = props.navigation.addListener('focus', () => {
            getUser()
        });
        return unsubscribe
    }, [props.navigation]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.container}>
                    <Text style={styles.title}>Nouvelle adresse</Text>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            console.log(values)
                            try {
                                await axios.put(`${BASE_URL}/api/users`, {
                                    id: userData._id,
                                    address: values.adresse,
                                    postalCode: values.postalCode,
                                    ville: values.ville,
                                    pays: values.pays
                                }).then(() => props.navigation.navigate('InformationsScreen'))
                            } catch (err) {
                                console.log(err)
                            }
                        }}
                    >
                        {props => (
                            <View>
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
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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

export default ModifierAdresseScreen;

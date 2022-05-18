import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {Formik} from "formik";
import firebase from "firebase";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModifierEmailScreen = (props) => {


    const initialValues = {
        initial: '',
        confirmed: ''
    }

    const dispatch = useDispatch();

    const userData = props.route.params.user

    const [productByEmail, setProductByEmail] = useState([]);

    useEffect(() => {
        const getProductsByEmail = async () => {
            const { data } = await axios.get(`${BASE_URL}/api/products/email/${userData._id}`)
            setProductByEmail(data)
        }
        getProductsByEmail()
    }, [dispatch]);


  return (
   <View style={styles.container}>
        <Text style={styles.title}>Email</Text>
        <Text style={{fontSize: 18, marginBottom: '10%'}}>Adresse mail actuelle : <Text style={{color: '#D51317', fontSize: 16}}>{userData.email}</Text></Text>

       <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
            console.log(values)

            for (let product of productByEmail) {
                console.log(product)
                await axios.put(`${BASE_URL}/api/products`, {
                    id: userData._id,
                    emailVendeur: values.initial
                })
            }

            await axios.put(`${BASE_URL}/api/users`, {
                id: userData._id,
                email: values.initial
            }).then(() => props.navigation.navigate('ModifierEmailConfirmationScreen'))
        }}
       >
           {props => (
               <View>
                   <Text>Nouvelle adresse mail</Text>
                   <TextInput
                   placeholder="Email"
                   style={styles.input}
                   value={props.values.initial}
                   onChangeText={props.handleChange('initial')}
                   />
                   <Text>Confirmer votre nouvelle adresse mail</Text>

                   <TextInput
                       style={styles.input}
                       placeholder="Email"
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
        marginBottom: '5%'
    }
});

export default ModifierEmailScreen;

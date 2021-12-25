import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, Dimensions} from "react-native";
import { AntDesign } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ValidationAnnonceModifieeScreen = (props) => {

    return (
        <View style={styles.container}>
            <AntDesign name="checkcircleo" size={200} color="white" />
            <Text style={styles.text}>Votre modification est effectuée !</Text>
            <TouchableOpacity style={styles.retourContainer} onPress={() => {
                props.navigation.navigate("ProfileScreen")
                props.navigation.navigate("Accueil", {
                    screen: 'AcceuilScreen'
                })
            }}>
                <Text style={styles.text}>Retour au menu principal</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D51317',
        flex: 1,
        alignItems: 'center',
        paddingTop: windowHeight/4
    },
    image: {
        height: 200,
        width: 200
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: '3%',
        color: 'white',
        maxWidth: '90%'
    },
    retourContainer : {
        borderWidth: 5,
        borderColor: 'white',
        borderRadius: 20,
        paddingHorizontal: windowWidth/17,
        width: windowWidth/1.1,
        alignItems: 'center',
        paddingBottom: "2%",
        marginTop: windowHeight/6
    }
})
export default ValidationAnnonceModifieeScreen;

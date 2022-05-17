import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, Dimensions} from "react-native";
import { AntDesign } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ValidationContactScreen = (props) => {

    return (
        <View style={styles.container}>
            <AntDesign name="checkcircleo" size={200} color="white" />
            <Text style={styles.text}>Nous avons bien reçu votre demande ! </Text>
               <Text style={styles.text}> Nous reviendrons vers vous rapidement</Text>
            <TouchableOpacity style={styles.retourContainer} onPress={() => props.navigation.navigate('ProfileScreen')}>
                <Text style={styles.text}>Retour au profil</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D51317',
        flex: 1,
        alignItems: 'center',
        paddingTop: windowHeight/12
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
        color: 'white'
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
export default ValidationContactScreen;

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {AntDesign} from "@expo/vector-icons";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PortefeuilleThankYouScreen = (props) => {
    return (
        <View style={styles.container2}>
            <AntDesign name="checkcircleo" size={200} color="white" />
            <Text style={styles.text2}>Votre article a été acheté avec l'argent de votre portefeuille !</Text>
            <TouchableOpacity style={styles.retourContainer} onPress={() => {
                props.navigation.navigate('AccueilScreen')
            }}>
                <Text style={styles.text2}>Retour au menu principal</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container2: {
        backgroundColor: '#D51317',
        flex: 1,
        alignItems: 'center',
        paddingTop: windowHeight/4
    },
    text2: {
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
        marginTop: windowHeight/9
    },
});

export default PortefeuilleThankYouScreen;
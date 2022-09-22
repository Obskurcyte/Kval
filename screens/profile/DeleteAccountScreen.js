import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL} from "../../constants/baseURL";
import authContext from "../../context/authContext";
import {useNavigation} from "@react-navigation/core";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DeleteAccountScreen = () => {

    const { setSignedIn } = useContext(authContext);
    const navigation = useNavigation()

    const handleDelete = async () => {
        const userId = await AsyncStorage.getItem("userId");
        await axios.delete(`${BASE_URL}/api/users/${userId}`);
        await AsyncStorage.removeItem("userId");
        setSignedIn(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Vous êtes sur le point de supprimer votre compte. Confimez-vous cette opération ?</Text>
            <TouchableOpacity
                style={styles.mettreEnVente}
                onPress={handleDelete}
            >
                <Text style={styles.mettreEnVenteText}>Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.otherButton} onPress={() => navigation.goBack()}>
                <Text style={styles.otherButtonText}>Non</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '10%',
        width: windowWidth/1.1,
        paddingVertical: '5%',
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    container: {
        alignItems: "center"
    },
    text: {
        textAlign: "center",
        fontSize: 20,
        marginTop: 20
    },
    otherButton: {
        width: windowWidth/1.1,
        paddingVertical: '5%',
        borderWidth: 1,
        borderColor: "black",
        marginTop: 30
    },
    otherButtonText: {
        color: "#D51317",
        textAlign: "center",
        fontSize: 18
    }
});

export default DeleteAccountScreen;
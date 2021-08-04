import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import * as userActions from "../../store/actions/users";

const windowWidth = Dimensions.get('window').width;

const PortefeuilleScreen = () => {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.userData);

    useEffect(() => {
        dispatch(userActions.getUser())
    }, [dispatch]);

    console.log(userData)
    return (
        <View>
            <Text style={styles.argent}>{userData.portefeuille} €</Text>
            <Text style={styles.montant}>Montant disponible</Text>
            <TouchableOpacity  style={styles.mettreEnVente}>
                <Text style={styles.mettreEnVenteText}>Transférer vers un compte bancaire</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '15%',
        marginLeft: '5%',
        width: windowWidth/1.1,
        paddingVertical: '5%',
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    argent: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        marginTop: '10%'
    },
    montant: {
        textAlign: 'center'
    }
})

export default PortefeuilleScreen;
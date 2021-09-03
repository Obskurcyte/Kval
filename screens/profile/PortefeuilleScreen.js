import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import * as userActions from "../../store/actions/users";
import firebase from "firebase";

const windowWidth = Dimensions.get('window').width;

const PortefeuilleScreen = () => {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.userData);

    useEffect(() => {
        dispatch(userActions.getUser())
    }, [dispatch]);

    console.log(userData)
    const logout = () => {
        firebase.auth().signOut();
    };

    return (
        <View>
            {userData ? <View>
                <Text style={styles.argent}>{userData.portefeuille} €</Text>
                <Text style={styles.montant}>Montant disponible</Text>
                <TouchableOpacity  style={styles.mettreEnVente}>
                    <Text style={styles.mettreEnVenteText}>Transférer vers un compte bancaire</Text>
                </TouchableOpacity>
            </View> :
                <View>
                    <Text style={styles.noData}>Aucune donnée disponible</Text>
                    <TouchableOpacity  style={styles.mettreEnVente} onPress={() => logout()}>
                        <Text style={styles.mettreEnVenteText}>Veuillez vous reconnecter</Text>
                    </TouchableOpacity>
                </View>
                }

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
    },
    noData: {
        fontSize: 20,
        textAlign: 'center'
    }
})

export default PortefeuilleScreen;
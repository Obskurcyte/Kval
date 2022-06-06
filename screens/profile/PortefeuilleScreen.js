import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import authContext from "../../context/authContext";
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";

const windowWidth = Dimensions.get('window').width;

const PortefeuilleScreen = (props) => {

    console.log(userData);
    const { setSignedIn } = useContext(authContext);

    const [userData, setUserData] = useState(null);

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

    const logout = async () => {
        await AsyncStorage.removeItem("userId");
        setSignedIn(false)
        console.log('done')
    };

    const [error, setError] = useState("");

    return (
        <View>
            {userData ? <View>
                    <Text style={styles.argent}>{userData.portefeuille.toFixed(2)} €</Text>
                    <Text style={styles.montant}>Montant disponible</Text>
                    <TouchableOpacity  style={styles.mettreEnVente} onPress={() => {
                        if (userData.portefeuille === 0) {
                            setError("Votre portefeuille ne contient pas d'argent votre virement ne peut pas être effectué")
                        } else {
                            props.navigation.navigate('EnterIbanScreen')
                        }
                    }}>
                        <Text style={styles.mettreEnVenteText}>Transférer vers un compte bancaire</Text>
                    </TouchableOpacity>

                    {error ? <Text style={styles.errors}>{error}</Text> : <Text/>}
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
    },
    errors: {
        color: 'red',
        textAlign: 'center'
    }
})

export default PortefeuilleScreen;

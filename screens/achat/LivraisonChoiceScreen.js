import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const LivraisonChoiceScreen = (props) => {

    const [livraison, setLivraison] = useState('');

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.itemForm3} onPress={() => {
                setLivraison('MondialRelay')
                props.navigation.navigate('CartScreen', {
                    livraison: 'MondialRelay'
                })
            }}>
                <Text style={styles.text}>MondialRelay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemForm3} onPress={() => {
                setLivraison('Personnalisée')
                props.navigation.navigate('CartScreen', {
                    livraison: 'Personnalisé'
                })
            }}>
                <Text style={styles.text}>Personnalisée</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemForm3} onPress={() => {
                setLivraison('Livraison article "lourd"')
                props.navigation.navigate('CartScreen', {
                    livraison: 'Livraison article "lourd"'
                })
            }}>
                <Text style={styles.text}>Livraison article "lourd"</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    itemForm3 : {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingVertical: "6%"
    },
    container: {
        paddingHorizontal: '5%'
    },
    text: {
        fontSize: 16
    }
});

export default LivraisonChoiceScreen;
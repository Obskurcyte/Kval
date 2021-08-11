import React from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions} from "react-native";
import * as cartActions from "../../store/actions/cart";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LivraisonArticleLourdScreen = () => {

    return (
       <View>
            <Text style={styles.contact}>Contactez nous et nous reviendrons vers vous dans les plus bref délais avec un prix pour votre livraison</Text>
           <TouchableOpacity
               style={styles.mettreEnVente}
           >
               <Text style={styles.mettreEnVenteText}>Nous contacter</Text>
           </TouchableOpacity>
       </View>
    );
};

const styles = StyleSheet.create({
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '5%',
        marginLeft: '5%',
        width: windowWidth/1.1,
        paddingVertical: '5%',
    },
    contact: {
        fontSize: 18,
        textAlign: 'center'
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
})
export default LivraisonArticleLourdScreen;
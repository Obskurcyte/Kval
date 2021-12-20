import React from 'react';
import {View, Text, Image, StyleSheet} from "react-native";
import {Entypo} from "@expo/vector-icons";

const RecapCommandeItem = (props) => {

    return (
        <View style={styles.cardContainer}>
            <View style={styles.imgContainer}>
                <Image
                    source={{uri: props.image}}
                    style={styles.image}
                />
            </View>
            <View style={styles.priceContainer}>
                <Text>{props.pseudoVendeur}</Text>
                <Text style={styles.cardTitle}>{props.title}</Text>
                <Text style={styles.price}>Prix : {props.price} €</Text>
                <Text style={styles.price}>Poids : {props.poids} kgs</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    price: {
        color: '#D51317',
        fontSize: 20
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 15
    },
    vendeurContainer: {
        backgroundColor: '#F9F9FA'
    },
    cardContainer: {
        backgroundColor: 'white',
        paddingHorizontal: '5%',
        marginTop: '5%',
        display: 'flex',
        height: 150,
        flexDirection: 'row'
    },
    cross: {
        marginLeft: 50
    },
    imgContainer: {
        alignItems: 'center',
        paddingTop: '5%',
        marginBottom: 10
    },
    image: {
        height: 130,
        width: 130
    },
    deleteContainer: {
        position: 'absolute',
        right: '5%',
        width: '12%',
        alignItems: 'center',
        top: '2%'
    },
    crossText: {
        fontSize: 20,
        color: '#A7A9BE'
    },
    priceContainer: {
        marginLeft: '10%',
        marginTop: '5%'
    }
});

export default RecapCommandeItem;

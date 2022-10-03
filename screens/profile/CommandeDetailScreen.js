import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView} from "react-native";
import {AntDesign, Fontisto} from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CommandeDetailScreen = (props) => {

    const product = props.route.params.product;
    const userData = props.route.params.user;

    console.log('hey', product)

    const FourStar = () => {
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="star" size={24} color="#FFC107" />
                <AntDesign name="star" size={24} color="#FFC107" />
                <AntDesign name="star" size={24} color="#FFC107" />
                <AntDesign name="star" size={24} color="#FFC107" />
            </View>
        )
    }

    return (
        <View>
            <View style={styles.container}>
                <ScrollView>

                    <View style={styles.imgContainer}>
                        <Image
                            source={{uri: product.image}}
                            style={styles.image}
                        />
                    </View>

                    <View style={styles.titleAndPrixContainer}>
                        <Text style={styles.title}>{product.title}</Text>
                        <Text style={styles.prix}>{product.prix} €</Text>
                    </View>


                    <View style={styles.vendeurContainer}>
                        {product.imageURL ? <Image source={require('../../assets/photoProfile.png')}/> :<Avatar
                            size="small"
                            rounded
                            title="MT"
                            onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                        />
                        }

                        <View>
                            <Text style={styles.pseudoVendeur}>{product.pseudoVendeur}</Text>
                            <FourStar />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.mettreEnVente} onPress={() => props.navigation.navigate('EvaluationScreen', {
                        product: product,
                        user: userData
                    })}>
                        <Text style={styles.mettreEnVenteText}>L'article a été reçu !</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingTop: '5%',
    },
    searchBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: '2%',
        alignItems: 'center'
    },
    searchBar: {
        width: '80%',
        borderRadius: 80
    },
    icon: {
        width: '10%',
        marginLeft: '5%',
    },
    searchBarInner: {
        borderRadius: 80
    },
    imgContainer: {
        width: windowWidth,
        height: windowHeight/3,
        marginTop: '3%',
        alignItems: 'center'
    },
    image: {
        height: '100%',
        width: '50%'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24
    },
    prix: {
        color: '#737379',
        fontWeight: 'bold',
        fontSize: 17
    },
    titleAndPrixContainer: {
        marginLeft: '5%'
    },
    descriptionContainer: {
        backgroundColor: '#E7E9EC',
        paddingVertical: '5%',
        paddingHorizontal: '2%',
        marginTop: '5%'
    },
    description: {
        textAlign: 'center'
    },
    itemForm3: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginLeft: '5%',
        height: windowHeight/14,
        alignItems: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1
    },
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '5%',
        marginLeft: '5%',
        width: windowWidth/1.1,
        paddingVertical: '5%',
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    vendeurContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#E7E9EC',
        paddingVertical: '5%',
        paddingHorizontal: '2%',
        alignItems: 'center'
    },
    pseudoVendeur: {
        color: 'black',
        fontSize: 16
    },
    envoyerMessageContainer: {
        borderWidth: 1,
        borderColor: '#D9353A',
        width: '50%',
        marginLeft: '25%',
        marginTop: '5%',
        alignItems: 'center',
        borderRadius: 4
    },
    envoyerMessageText: {
        color: '#D9353A',
        fontSize: 18
    }
});

export default CommandeDetailScreen;

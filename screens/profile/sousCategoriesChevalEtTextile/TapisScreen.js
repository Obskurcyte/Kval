import React from 'react';
import {View, Text, Dimensions, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TapisProfileScreen = (props) => {

    return (
        <View style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Masques anti-mouche'
                })}>
                    <Text style={styles.text}>Masques anti-mouche</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Bonnets chevaux'
                })}>
                    <Text style={styles.text}>Bonnets chevaux</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Tapis CSO et mixtes'
                })}>
                    <Text style={styles.text}>Tapis CSO et mixtes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Tapis de dressage'
                })}>
                    <Text style={styles.text}>Tapis de dressage</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Tapis de randonnée et d’endurance'
                })}>
                    <Text style={styles.text}>Tapis de randonnée et d’endurance</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Tapis hunter et forme de selle'
                })}>
                    <Text style={styles.text}>Tapis hunter et forme de selle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Amortisseurs'
                })}>
                    <Text style={styles.text}>Amortisseurs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Pad et tapis western'
                })}>
                    <Text style={styles.text}>Pad et tapis western</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemContainer} onPress={() => props.navigation.navigate('ModifierAnnonceScreen', {
                    categorie: 'Autres'
                })}>
                    <Text style={styles.text}>Autres</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgrey',
        flex: 1,
        alignItems: 'center'
    },
    itemContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: "3%",
        marginTop: "4%",
        width: windowWidth/1.1
    },
    text: {
        textAlign: 'center',
        fontSize: 20
    }
});

export default TapisProfileScreen;

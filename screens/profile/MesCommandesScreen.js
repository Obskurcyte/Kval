import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Dimensions, Text} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import CommandeItem from "../../components/CommandeItem";
import {BASE_URL} from "../../constants/baseURL";
import axios from "axios";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MesCommandesScreen = (props) => {

    const dispatch = useDispatch();

    const userData = props.route.params.user;
    const acheteur = userData._id;

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const getCommandes = async () => {
            const { data } = await axios.get(`${BASE_URL}/api/commandes/${acheteur}`)
            setArticles(data)
        }
        getCommandes()
    }, []);

    console.log('articles', articles)
    console.log(articles)

    const renderItem = ({item}) => {
        return (
            <CommandeItem
                item={item}
                onPress={() => {
                    props.navigation.navigate('CommandeDetailScreen', {
                        product: item,
                        user: userData
                    })
                }}
            />
        );
    }


    return (
        <View style={styles.container}>

            {articles?.length !== 0 ? <View style={styles.flatListContainer}>
                <FlatList
                    data={articles}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    extraData={articles}
                />
            </View> : <Text style={styles.noCommandeText}>Vous n'avez passé aucune commande</Text>}

        </View>
    );
};

const styles = StyleSheet.create({
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '5%',
        width: windowWidth/1.1,
        paddingVertical: '5%',
        marginLeft: '5%'
    },
    flatListContainer: {
        height: windowHeight/1.5
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    price: {
        color: '#B5B5BE',
        fontSize: 12
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    noCommandeText: {
      fontSize: 20,
        textAlign: 'center',
        marginTop: windowHeight/2.5
    },
    vendeurContainer: {
        backgroundColor: '#F9F9FA',
        paddingVertical: '4%'
    },
    selected: {
        backgroundColor: '#D6F5DB',
        paddingVertical: '4%'
    },
    cardContainer: {
        backgroundColor: 'white',
        width: '40%',
        marginTop: '5%',
        marginHorizontal: '4%'
    },
    imgContainer: {
        height: '80%'
    },
    image: {
        height: 140,
        width: 140
    }
});

export default MesCommandesScreen;

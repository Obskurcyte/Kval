import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import * as articlesActions from "../../store/actions/articlesCommandes";
import CommandeItem from "../../components/CommandeItem";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MesCommandesScreen = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(articlesActions.getCommandes())
    }, [dispatch]);
    let articles = useSelector(state => state.commandes.mesCommandes);

    console.log(articles)

    const renderItem = ({item}) => {
        return (
            <CommandeItem
                item={item}
                onPress={() => {
                    props.navigation.navigate('CommandeDetailScreen', {
                        product: item
                    })
                }}
            />
        );
    }


    return (
        <View style={styles.container}>

            <View style={styles.flatListContainer}>
                <FlatList
                    data={articles}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    extraData={articles}
                />
            </View>
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

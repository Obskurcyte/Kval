import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import * as articlesActions from "../../store/actions/articlesCommandes";
import {useDispatch, useSelector} from "react-redux";
import AvisCard from "../../components/AvisCard";
import CardVente from "../../components/CardVente";


const AvisScreen = ({navigation, route}) => {

    const product = route.params.product
    console.log(product)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(articlesActions.getAvis(product.idVendeur))
    }, [dispatch]);

    let commentaires = useSelector(state => state.commandes.commentaires);


    return (
           <FlatList
                data={commentaires}
                keyExtractor={item => item.id}
                renderItem={itemData => {
                    return (
                        <AvisCard
                            name={itemData.item.rateur}
                            commentaire={itemData.item.commentaire}
                            rating={itemData.item.rating}
                        />
                        )}}
                    >
           </FlatList>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        width: 50,
    },
    avisContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    avisText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    starsContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 15
    }
})

export default AvisScreen;

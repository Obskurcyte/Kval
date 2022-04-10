import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions} from 'react-native';
import CartItem from "../../components/CartItem";
import * as cartActions from "../../store/actions/cart";
import {useDispatch, useSelector} from "react-redux";
import * as userActions from "../../store/actions/users";
import * as productActions from "../../store/actions/products";

const windowWidth = Dimensions.get("window").width;
const FirstCartScreen = (props) => {

    const dispatch = useDispatch();

    let cartItems = useSelector((state) => {
        const transformedCartItems = [];
        console.log('state', state.cart.items)
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                image: state.cart.items[key].image,
                idVendeur: state.cart.items[key].idVendeur,
                pseudoVendeur: state.cart.items[key].pseudoVendeur,
                emailVendeur: state.cart.items[key].emailVendeur,
                categorie: state.cart.items[key].categorie,
                livraison: state.cart.items[key].livraison,
                poids: state.cart.items[key].poids,
                pushToken: state.cart.items[key].pushToken,
                sum: state.cart.items[key].sum,
            });
        }
        return transformedCartItems;
    });

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", () => {
            // The screen is focused
            dispatch(userActions.getUser());
            cartItems.map((item, index) => {
                dispatch(productActions.fetchProducts(item.categorie))
            })
        });
        return unsubscribe;
    }, [props.navigation, dispatch]);


    let total = 0;
    for (let data in cartItems) {
        total +=
            parseFloat(cartItems[data].quantity) *
            parseFloat(cartItems[data].productPrice);
    }

    console.log('itemes', cartItems);

    return (
        <ScrollView style={styles.container}>
            {cartItems.length !== 0 ? (
                <View>
                    <FlatList
                        style={styles.list}
                        data={cartItems}
                        keyExtractor={(item) => item.productId}
                        renderItem={(itemData) => {
                            return (
                                <CartItem
                                    title={itemData.item.productTitle}
                                    price={itemData.item.productPrice}
                                    image={itemData.item.image}
                                    poids={itemData.item.poids}
                                    pseudoVendeur={itemData.item.pseudoVendeur}
                                    onDelete={() => {
                                        dispatch(
                                            cartActions.removeFromCart(itemData.item.productId)
                                        );
                                    }}
                                />
                            );
                        }}
                    />
                    <Text style={styles.subTotal}>Total articles : {total} €</Text>
                    <Text style={styles.subTotal}>Prix protection acheteur : {(total * 0.05).toFixed(2)} € </Text>
                    <TouchableOpacity
                        style={styles.mettreEnVente}
                        onPress={() => props.navigation.navigate('CartScreen')}
                    >
                        <Text style={styles.mettreEnVenteText}>
                            Payer mes articles
                        </Text>
                    </TouchableOpacity>

                </View>
            ) : <Text>Vous n'avez pas d'articles dans votre panier</Text>}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: "5%",
        marginLeft: "5%",
        width: windowWidth / 1.1,
        paddingVertical: "5%",
    },
    mettreEnVenteText: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
    container: {
        flex: 1,
    },
    subTotal: {
        textAlign: 'center',
        fontSize: 20
    },
    list: {
        marginBottom: 50
    },
});

export default FirstCartScreen;

import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useNavigation } from '@react-navigation/native';
import {BASE_URL} from "../constants/baseURL";


import { useDispatch } from "react-redux";
const windowWidth = Dimensions.get("window").width;

const PaymentCard = ({amount, cartItems, userData, handlePay, modify, boost}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [cardDetails, setCardDetails] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { confirmPayment, loading } = useConfirmPayment();


    console.log('amount', amount)
    const params = {
        amount: amount * 100,
        email: userData.email
    };

    const fetchPaymentIntentClientSecret = async () => {
        const response = await fetch(`${BASE_URL}/create-payment-intent`, {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { clientSecret, error } = await response.json();
        return { clientSecret, error };
    };

    const handlePayPress = async () => {
        //1.Gather the customer's billing information (e.g., email)
        if (!cardDetails?.complete) {
            Alert.alert("Veuillez entrer vos coordonnées bancaires complètes");
            return;
        }
        const billingDetails = {
            email: userData.email,
        };
        //2.Fetch the intent client secret from the backend
        try {
            setIsLoading(true)
            const { clientSecret, error } = await fetchPaymentIntentClientSecret();
            //2. confirm the payment
            if (error) {
                setIsLoading(false)
                alert(`Une erreur s'est produite`);
            } else {
                const { paymentIntent, error } = await confirmPayment(clientSecret, {
                    paymentMethodType: 'Card',
                    paymentMethodData: {
                        billingDetails,
                    },
                });

                if (error) {
                    setIsLoading(false)
                    alert(`Payment Confirmation Error ${error.message}`);
                } else if (paymentIntent) {
                    console.log('ici435')
                    handlePay()
                    console.log('ici2')
                    setIsLoading(false)
                    if (modify) {
                        navigation.navigate("ValidationAnnonceModifieeScreen", {
                            boost: false
                        })
                    } else if (boost) {
                        navigation.navigate("ValidationAnnonceModifieeScreen", {
                            boost: true
                        })
                    } else {
                        navigation.navigate("ValidationPaymentScreen", {
                            cartItems: cartItems
                        })
                    }
                }
            }
        } catch (e) {
            setIsLoading(false)
            alert(`Une erreur s'est produite`);
        }
        //3.Confirm the payment with the card details
    };

    return (
        <StripeProvider publishableKey="pk_live_51K9SbZDfHBxLnJ9gxVxnfUlnGfagKPFLdFLmClUCQDd8TaOv4upR6sXXqvc9b0EZ482qkFtW7Idax4O6wHoPkzwt007qGvq7Wg">
            <View style={styles.container}>
                <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                        number: "4242 4242 4242 4242",
                    }}
                    cardStyle={styles.card}
                    style={styles.cardContainer}
                    onCardChange={cardDetails => {
                        setCardDetails(cardDetails);
                    }}
                />
                {isLoading ?   <View style={styles.containerLoading}>
                    <Text style={styles.loadingText}>
                        Veuillez patientez...
                    </Text>
                    <ActivityIndicator color="red"/>
                </View> :      <TouchableOpacity
                    style={styles.mettreEnVente}
                    onPress={handlePayPress}
                >
                    <Text style={styles.mettreEnVenteText}>Payer</Text>
                </TouchableOpacity>}

            </View>
        </StripeProvider>
    );
};
export default PaymentCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    input: {
        backgroundColor: "#efefefef",

        borderRadius: 8,
        fontSize: 20,
        height: 50,
        padding: 10,
    },
    card: {
        backgroundColor: "#efefefef",
    },
    cardContainer: {
        height: 50,
        marginVertical: 30,
    },
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: "5%",
        alignSelf: 'center',
        width: windowWidth / 1.1,
        paddingVertical: "5%",
    },
    mettreEnVenteText: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
    loadingText: {
        fontSize: 20,
        textAlign: "center",
        maxWidth: "90%",
        marginBottom: 20,
    },
    containerLoading: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "20%",
    }
});
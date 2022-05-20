import React, {useContext, useState} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert, ActivityIndicator, Dimensions
} from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import {BASE_URL} from "../constants/baseURL";
import authContext from "../context/authContext";
import {useNavigation} from "@react-navigation/core";
import axios from "axios";
import * as cartActions from "../store/actions/cart";
import {useDispatch} from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const AndroidPaymentView = ({
                                amount,
                                cartItems,
                                userData,
                                totalProtectionAcheteur,
                                sousTotal,
                                toggleCheckBoxPortefeuille,
                                livraison,
                                etiquette_url,
                                netVendeur,
                                newTotal
}) => {


    const [cardDetails, setCardDetails] = useState()
    const { confirmPayment, loading } = useConfirmPayment()

    const [paymentStatus, setPaymentStatus] = useState("");

    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const ctx = useContext(authContext);


    const dispatch = useDispatch()
   /* const fetchPaymentIntentClientSecret = async () => {

        const response = await fetch(`${BASE_URL}/create-payment-intent`, {
            method: "POST",
            body: JSON.stringify({
                amount: amount * 100
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const { clientSecret, err } = await response.json()
        return {clientSecret, err}
    }
    const handlePayPress = async () => {
        if (!cardDetails?.complete) {
            Alert.alert("Veuillez vos coordonnées bancaires")
        }
        const billingDetails = {
            email: "hadrien.jaubert99@gmail.com"
        }
        setIsLoading(true)
        try {
            const {clientSecret, err} = await fetchPaymentIntentClientSecret()
            if (err) {
                console.log("Erreur de paiment")
            } else {
                const { paymentIntent, err} = await confirmPayment(clientSecret, {
                    type: "Card",
                    billingDetails: billingDetails
                });
                console.log("1.1")
                console.log('payment', paymentIntent)
                if (err) {
                    alert(`Erreur de paiment ${err.message}`)
                    setPaymentStatus("Le paiement a échoué");
                    setIsLoading(false)
                } else if (paymentIntent) {
                    console.log("1.2")
                    for (const cartItem of cartItems) {
                        await axios.post(`${BASE_URL}/api/commandes`, {
                            title: cartItem.productTitle,
                            prix: cartItem.productPrice,
                            image: cartItem.image,
                            vendeur: cartItem.idVendeur,
                            pseudoVendeur: cartItem.pseudoVendeur,
                            emailVendeur: cartItem.emailVendeur,
                            categorie: cartItem.categorie,
                            livraison: cartItem.livraison,
                            poids: cartItem.poids,
                            description: cartItem.description,
                            prixProtectionAcheteur: totalProtectionAcheteur,
                            productTitle: cartItem.productTitle,
                            total: sousTotal,
                            acheteur: userData._id,
                            moyenPaiement: "CB",
                        })

                        console.log("1")
                        await axios.put(`${BASE_URL}/api/users`, {
                            id: cartItem.idVendeur,
                            unreadMessages: 1,
                            notificationsTitle: "Un article a été vendu !",
                            notificationsBody: `L'article ${cartItem.productTitle} a été acheté !`,
                            notificationsImage: cartItem.image,
                        });

                        console.log("2")

                        await axios.put(`${BASE_URL}/api/users`, {
                            id: userData._id,
                            minusPortefeuille: Number(sousTotal)
                        });

                        dispatch(cartActions.deleteCart());
                        const pushToken = cartItem.pushToken;
                        await fetch("https://exp.host/--/api/v2/push/send", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Accept-Encoding": "gzip, deflate",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                to: pushToken,
                                sound: 'default',
                                badge: 1,
                                title: "Un de vos articles a été acheté !",
                                body: `L'article ${cartItem.productTitle} a été acheté !`,
                            }),
                        });

                        console.log("3")

                        if (toggleCheckBoxPortefeuille) {
                            try {
                                await axios.put(`${BASE_URL}/api/users`, {
                                    id: userData._id,
                                    portefeuille: 0
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        }


                        if ((livraison == "MondialRelay")) {
                            const data = `<?xml version="1.0" encoding="utf-8"?>
<ShipmentCreationRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.example.org/Request">
    <Context>
        <Login>MRKVALOC@business-api.mondialrelay.com</Login>
        <Password>:0qjMV1DpHrMJPymQBkq</Password>
        <CustomerId>MRKVALOC</CustomerId>
        <Culture>fr-FR</Culture>
        <VersionAPI>1.0</VersionAPI>
    </Context>
    <OutputOptions>
        <OutputFormat>10x15</OutputFormat>
        <OutputType>PdfUrl</OutputType>
    </OutputOptions>
    <ShipmentsList>
        <Shipment>
            <OrderNo></OrderNo>
            <CustomerNo></CustomerNo>
            <ParcelCount>1</ParcelCount>
            <DeliveryMode Mode="24R" Location="FR-${cartItem.adresse.ID}" />
            <CollectionMode Mode="REL" Location="" />
            <Parcels>
                <Parcel>
                    <Content>Materiel Equitation</Content>
                    <Weight Value="${
                                Number(cartItem.poids) * 1000
                            }" Unit="gr" />
                </Parcel>
            </Parcels>
            <DeliveryInstruction></DeliveryInstruction>
            <Sender>
                <Address>
                    <Title />
                    <Firstname> Kval Occaz</Firstname>
                    <Lastname />
                    <Streetname> Les termes</Streetname>
                    <HouseNo>17 bis</HouseNo>
                    <CountryCode>FR</CountryCode>
                    <PostCode>13124</PostCode>
                    <City>PEYPIN</City>
                    <AddressAdd1></AddressAdd1>
                    <AddressAdd2 />
                    <AddressAdd3></AddressAdd3>
                    <PhoneNo />
                    <MobileNo></MobileNo>
                    <Email>info@k-val.com</Email>
                </Address>
            </Sender>
            <Recipient>
                <Address>
                    <Title></Title>
                    <Firstname>${userData.prenom}</Firstname>
                    <Lastname>${userData.nom}</Lastname>
                    <Streetname></Streetname>
                    <HouseNo></HouseNo>
                    <CountryCode>FR</CountryCode>
                    <PostCode>${cartItem.adresse.CP}</PostCode>
                    <City>${cartItem.adresse.Ville}</City>
                    <AddressAdd1 />
                    <AddressAdd2 />
                    <AddressAdd3 />
                    <PhoneNo></PhoneNo>
                    <MobileNo />
                    <Email></Email>
                </Address>
            </Recipient>
        </Shipment>
    </ShipmentsList>
</ShipmentCreationRequest>
                                                `;
                            var config = {
                                method: "post",
                                url: "https://connect-api.mondialrelay.com/api/shipment",
                                headers: {
                                    "Content-Type": "text/xml",
                                },
                                data: data,
                            };

                            etiquette_url = await new Promise((resolve) =>
                                axios(config)
                                    .then(function (response) {
                                        console.log(JSON.stringify(response.data));
                                        resolve(
                                            response.data.shipmentsListField[0].labelListField
                                                .labelField.outputField
                                        );
                                    })
                                    .catch(function (error) {
                                        console.log("Mondial relay error :", error);
                                    })
                            );
                        }

                        if (cartItem.adresse) {
                            console.log("yes");
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: userData.email,
                                subject: "Confirmation d'achat",
                                html_output: `
<div>
    <p>Félicitations ${userData.pseudo}, <br></p> 
    <p>Vous venez d'acheter un article à ${cartItem.pseudoVendeur}.</p>
    <p>Récapitulatif de l'achat : </p>
    <hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
            <p style="margin: 0">Description : ${cartItem.description}</p>
            <p style="margin: 0">Prix de l'article: ${cartItem.productPrice} €</p>
            <p style="margin: 0">Protection acheteur : ${totalProtectionAcheteur} €</p>
            <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
            <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : </p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.Adresse1}</p>
            <p style="margin: 0">Ville: ${cartItem.adresse.Ville}</p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.CP}</p>
            <p style="margin: 0">Nom du point relay: ${cartItem.adresse.Nom}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé par CB</p>
        </div>
    </div>
    
    <hr>
    
  
        <p>Le vendeur a 5 jours pour expédier votre article et <span style="font-weight: bold">vous avez 2 jours dès réception de l’article</span> en conformité avec sa description, pour le signaler reçu et conforme <span style="font-weight: bold">via l’application</span> (Profile, Mes commandes)</p>
   
        <p>Ce signalement donnera immédiatement lieu au paiement du vendeur.</p>
    <p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté au crédit du vendeur et une enquête sera effectuée par nos soins.</p>
    <br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                            });
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: cartItem.emailVendeur,
                                subject: "Confirmation de vente",
                                html_output: `<div><p>Félicitations ${
                                    cartItem.pseudoVendeur
                                },<br></p> 
<p>Votre article vient d'être acheté par ${userData.pseudo}.</p>
<p>Résumé de votre article : </p>

<hr>

<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${
                                    cartItem.image
                                }" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
        <p style="margin: 0">Description : ${cartItem.description}</p>
        <p style="margin: 0">Prix net vendeur: ${cartItem.productPrice} €</p>
        <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
          <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : </p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.Adresse1}</p>
            <p style="margin: 0">Ville: ${cartItem.adresse.Ville}</p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.CP}</p>
            <p style="margin: 0">Nom du point relay: ${cartItem.adresse.Nom}</p>
        <p style="margin: 0">Prix de la livraison: attente de Mondial Relay</p>
        ${cartItems.length > 1 ? <p></p> : <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p> }
                </div>
</div>

<hr>

<p>Vous avez 5 jours pour expédier votre article et l’acheteur à 2 jours dès réception de l’article en conformité avec sa description, pour le signalé reçu et conforme via l’application.</p>
<p>Ce signalement donnera immédiatement lieu au crédit dans votre portefeuille.</p>
<p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté dans votre portefeuille et donnera lieu à une enquête de notre part.</p>
<br>
${
                                    livraison === "MondialRelay"
                                        ? `<a href="${etiquette_url}">ETIQUETTE MONDIAL RELAY A UTILISER POUR L'EXPEDITION</p>`
                                        : ``
                                }
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
                            });
                        } else {
                            console.log("4")
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: userData.email,
                                subject: "Confirmation d'achat",
                                html_output: `
<div>
    <p>Félicitations ${userData.pseudo}, <br></p> 
    <p>Vous venez d'acheter un article à ${cartItem.pseudoVendeur}.</p>
    <p>Récapitulatif de l'achat : </p>
    
    <hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
            <p style="margin: 0">Description : ${cartItem.description}</p>
            <p style="margin: 0">Prix de l'article: ${cartItem.productPrice} €</p>
            <p style="margin: 0">Protection acheteur : ${totalProtectionAcheteur} €</p>
            <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
            <p style="margin: 0">Livraison: ${cartItem.livraison}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé par CB</p>
        </div>
    </div>
    
    <hr>
    
           <p>Le vendeur a 5 jours pour expédier votre article et <span style="font-weight: bold">vous avez 2 jours dès réception de l’article</span> en conformité avec sa description, pour le signaler reçu et conforme <span style="font-weight: bold">via l’application</span> (Profile, Mes commandes)</p>
   
    <p>Ce signalement donnera immédiatement lieu au paiement du vendeur.</p>
    <p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté au crédit du vendeur et une enquête sera effectuée par nos soins.</p>
    <br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                            });
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: cartItem.emailVendeur,
                                subject: "Confirmation de vente",
                                html_output: `<div><p>Félicitations ${cartItem.pseudoVendeur},<br></p> 
<p>Votre article vient d'être acheté par ${userData.pseudo}.</p>
<p>Résumé de votre article : </p>

<hr>


<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
        <p style="margin: 0">Description : ${cartItem.description}</p>
        <p style="margin: 0">Prix net vendeur: ${cartItem.productPrice} €</p>
        <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
        <p style="margin: 0">Livraison: ${cartItem.livraison}</p>
        ${cartItems.length > 1 ? <p></p> : <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p> }
                </div>
</div>

<hr>

<p>Vous avez 5 jours pour expédier votre article et l’acheteur à 2 jours dès réception de l’article en conformité avec sa description, pour le signalé reçu et conforme via l’application.</p>
<p>Ce signalement donnera immédiatement lieu au crédit dans votre portefeuille.</p>
<p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté dans votre portefeuille et donnera lieu à une enquête de notre part.</p>
<br>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
                            });
                        }
                    }
                    setIsLoading(false)
                    navigation.navigate("ValidationPaymentScreen", {
                        cartItems: cartItems
                    })
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    */

    const fetchPaymentIntentClientSecret = async () => {
        const response = await fetch(`${BASE_URL}/create-payment-intent`, {
            method: "POST",
            body: JSON.stringify({
                amount: amount * 100
            }),
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
            Alert.alert("Please enter Complete card details and Email");
            return;
        }
        const billingDetails = {
            email: "hadrien.jaubert99@gmail.com",
        };
        //2.Fetch the intent client secret from the backend
        try {
            const { clientSecret, err } = await fetchPaymentIntentClientSecret();
            //2. confirm the payment
            if (err) {
                console.log("Unable to process payment");
            } else {
                const { paymentIntent, error } = await confirmPayment(clientSecret, {
                    type: "Card",
                    billingDetails: billingDetails,
                });
                if (error) {
                    alert(`Payment Confirmation Error ${error.message}`);
                } else if (paymentIntent) {
                    console.log("Payment successful ", paymentIntent);
                    setIsLoading(true)
                    for (const cartItem of cartItems) {
                        await axios.post(`${BASE_URL}/api/commandes`, {
                            title: cartItem.productTitle,
                            prix: cartItem.productPrice,
                            image: cartItem.image,
                            vendeur: cartItem.idVendeur,
                            pseudoVendeur: cartItem.pseudoVendeur,
                            emailVendeur: cartItem.emailVendeur,
                            categorie: cartItem.categorie,
                            livraison: cartItem.livraison,
                            poids: cartItem.poids,
                            description: cartItem.description,
                            prixProtectionAcheteur: totalProtectionAcheteur,
                            productTitle: cartItem.productTitle,
                            total: sousTotal,
                            acheteur: userData._id,
                            moyenPaiement: "CB",
                        })

                        console.log("1")
                        await axios.put(`${BASE_URL}/api/users`, {
                            id: cartItem.idVendeur,
                            unreadMessages: 1,
                            notificationsTitle: "Un article a été vendu !",
                            notificationsBody: `L'article ${cartItem.productTitle} a été acheté !`,
                            notificationsImage: cartItem.image,
                        });

                        console.log("2")

                        await axios.put(`${BASE_URL}/api/users`, {
                            id: userData._id,
                            minusPortefeuille: Number(sousTotal)
                        });

                        dispatch(cartActions.deleteCart());
                        const pushToken = cartItem.pushToken;
                        await fetch("https://exp.host/--/api/v2/push/send", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Accept-Encoding": "gzip, deflate",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                to: pushToken,
                                sound: 'default',
                                badge: 1,
                                title: "Un de vos articles a été acheté !",
                                body: `L'article ${cartItem.productTitle} a été acheté !`,
                            }),
                        });

                        console.log("3")

                        if (toggleCheckBoxPortefeuille) {
                            try {
                                await axios.put(`${BASE_URL}/api/users`, {
                                    id: userData._id,
                                    portefeuille: 0
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        }


                        if ((livraison == "MondialRelay")) {
                            const data = `<?xml version="1.0" encoding="utf-8"?>
<ShipmentCreationRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.example.org/Request">
    <Context>
        <Login>MRKVALOC@business-api.mondialrelay.com</Login>
        <Password>:0qjMV1DpHrMJPymQBkq</Password>
        <CustomerId>MRKVALOC</CustomerId>
        <Culture>fr-FR</Culture>
        <VersionAPI>1.0</VersionAPI>
    </Context>
    <OutputOptions>
        <OutputFormat>10x15</OutputFormat>
        <OutputType>PdfUrl</OutputType>
    </OutputOptions>
    <ShipmentsList>
        <Shipment>
            <OrderNo></OrderNo>
            <CustomerNo></CustomerNo>
            <ParcelCount>1</ParcelCount>
            <DeliveryMode Mode="24R" Location="FR-${cartItem.adresse.ID}" />
            <CollectionMode Mode="REL" Location="" />
            <Parcels>
                <Parcel>
                    <Content>Materiel Equitation</Content>
                    <Weight Value="${
                                Number(cartItem.poids) * 1000
                            }" Unit="gr" />
                </Parcel>
            </Parcels>
            <DeliveryInstruction></DeliveryInstruction>
            <Sender>
                <Address>
                    <Title />
                    <Firstname> Kval Occaz</Firstname>
                    <Lastname />
                    <Streetname> Les termes</Streetname>
                    <HouseNo>17 bis</HouseNo>
                    <CountryCode>FR</CountryCode>
                    <PostCode>13124</PostCode>
                    <City>PEYPIN</City>
                    <AddressAdd1></AddressAdd1>
                    <AddressAdd2 />
                    <AddressAdd3></AddressAdd3>
                    <PhoneNo />
                    <MobileNo></MobileNo>
                    <Email>info@k-val.com</Email>
                </Address>
            </Sender>
            <Recipient>
                <Address>
                    <Title></Title>
                    <Firstname>${userData.prenom}</Firstname>
                    <Lastname>${userData.nom}</Lastname>
                    <Streetname></Streetname>
                    <HouseNo></HouseNo>
                    <CountryCode>FR</CountryCode>
                    <PostCode>${cartItem.adresse.CP}</PostCode>
                    <City>${cartItem.adresse.Ville}</City>
                    <AddressAdd1 />
                    <AddressAdd2 />
                    <AddressAdd3 />
                    <PhoneNo></PhoneNo>
                    <MobileNo />
                    <Email></Email>
                </Address>
            </Recipient>
        </Shipment>
    </ShipmentsList>
</ShipmentCreationRequest>
                                                `;
                            var config = {
                                method: "post",
                                url: "https://connect-api.mondialrelay.com/api/shipment",
                                headers: {
                                    "Content-Type": "text/xml",
                                },
                                data: data,
                            };

                            etiquette_url = await new Promise((resolve) =>
                                axios(config)
                                    .then(function (response) {
                                        console.log(JSON.stringify(response.data));
                                        resolve(
                                            response.data.shipmentsListField[0].labelListField
                                                .labelField.outputField
                                        );
                                    })
                                    .catch(function (error) {
                                        console.log("Mondial relay error :", error);
                                    })
                            );
                        }

                        if (cartItem.adresse) {
                            console.log("yes");
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: userData.email,
                                subject: "Confirmation d'achat",
                                html_output: `
<div>
    <p>Félicitations ${userData.pseudo}, <br></p> 
    <p>Vous venez d'acheter un article à ${cartItem.pseudoVendeur}.</p>
    <p>Récapitulatif de l'achat : </p>
    <hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
            <p style="margin: 0">Description : ${cartItem.description}</p>
            <p style="margin: 0">Prix de l'article: ${cartItem.productPrice} €</p>
            <p style="margin: 0">Protection acheteur : ${totalProtectionAcheteur} €</p>
            <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
            <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : </p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.Adresse1}</p>
            <p style="margin: 0">Ville: ${cartItem.adresse.Ville}</p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.CP}</p>
            <p style="margin: 0">Nom du point relay: ${cartItem.adresse.Nom}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé par CB</p>
        </div>
    </div>
    
    <hr>
    
  
        <p>Le vendeur a 5 jours pour expédier votre article et <span style="font-weight: bold">vous avez 2 jours dès réception de l’article</span> en conformité avec sa description, pour le signaler reçu et conforme <span style="font-weight: bold">via l’application</span> (Profile, Mes commandes)</p>
   
        <p>Ce signalement donnera immédiatement lieu au paiement du vendeur.</p>
    <p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté au crédit du vendeur et une enquête sera effectuée par nos soins.</p>
    <br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                            });
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: cartItem.emailVendeur,
                                subject: "Confirmation de vente",
                                html_output: `<div><p>Félicitations ${
                                    cartItem.pseudoVendeur
                                },<br></p> 
<p>Votre article vient d'être acheté par ${userData.pseudo}.</p>
<p>Résumé de votre article : </p>

<hr>

<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${
                                    cartItem.image
                                }" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
        <p style="margin: 0">Description : ${cartItem.description}</p>
        <p style="margin: 0">Prix net vendeur: ${cartItem.productPrice} €</p>
        <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
          <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : </p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.Adresse1}</p>
            <p style="margin: 0">Ville: ${cartItem.adresse.Ville}</p>
            <p style="margin: 0">Code Postal: ${cartItem.adresse.CP}</p>
            <p style="margin: 0">Nom du point relay: ${cartItem.adresse.Nom}</p>
        <p style="margin: 0">Prix de la livraison: attente de Mondial Relay</p>
        ${cartItems.length > 1 ? <p></p> : <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p> }
                </div>
</div>

<hr>

<p>Vous avez 5 jours pour expédier votre article et l’acheteur à 2 jours dès réception de l’article en conformité avec sa description, pour le signalé reçu et conforme via l’application.</p>
<p>Ce signalement donnera immédiatement lieu au crédit dans votre portefeuille.</p>
<p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté dans votre portefeuille et donnera lieu à une enquête de notre part.</p>
<br>
${
                                    livraison === "MondialRelay"
                                        ? `<a href="${etiquette_url}">ETIQUETTE MONDIAL RELAY A UTILISER POUR L'EXPEDITION</p>`
                                        : ``
                                }
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
                            });
                        } else {
                            console.log("4")
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: userData.email,
                                subject: "Confirmation d'achat",
                                html_output: `
<div>
    <p>Félicitations ${userData.pseudo}, <br></p> 
    <p>Vous venez d'acheter un article à ${cartItem.pseudoVendeur}.</p>
    <p>Récapitulatif de l'achat : </p>
    
    <hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
            <p style="margin: 0">Description : ${cartItem.description}</p>
            <p style="margin: 0">Prix de l'article: ${cartItem.productPrice} €</p>
            <p style="margin: 0">Protection acheteur : ${totalProtectionAcheteur} €</p>
            <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
            <p style="margin: 0">Livraison: ${cartItem.livraison}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé par CB</p>
        </div>
    </div>
    
    <hr>
    
           <p>Le vendeur a 5 jours pour expédier votre article et <span style="font-weight: bold">vous avez 2 jours dès réception de l’article</span> en conformité avec sa description, pour le signaler reçu et conforme <span style="font-weight: bold">via l’application</span> (Profile, Mes commandes)</p>
   
    <p>Ce signalement donnera immédiatement lieu au paiement du vendeur.</p>
    <p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté au crédit du vendeur et une enquête sera effectuée par nos soins.</p>
    <br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                            });
                            await axios.post("https://kval-backend.herokuapp.com/send", {
                                mail: cartItem.emailVendeur,
                                subject: "Confirmation de vente",
                                html_output: `<div><p>Félicitations ${cartItem.pseudoVendeur},<br></p> 
<p>Votre article vient d'être acheté par ${userData.pseudo}.</p>
<p>Résumé de votre article : </p>

<hr>


<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${cartItem.productTitle}</p>
        <p style="margin: 0">Description : ${cartItem.description}</p>
        <p style="margin: 0">Prix net vendeur: ${cartItem.productPrice} €</p>
        <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
        <p style="margin: 0">Livraison: ${cartItem.livraison}</p>
        ${cartItems.length > 1 ? <p></p> : <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p> }
                </div>
</div>

<hr>

<p>Vous avez 5 jours pour expédier votre article et l’acheteur à 2 jours dès réception de l’article en conformité avec sa description, pour le signalé reçu et conforme via l’application.</p>
<p>Ce signalement donnera immédiatement lieu au crédit dans votre portefeuille.</p>
<p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté dans votre portefeuille et donnera lieu à une enquête de notre part.</p>
<br>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
                            });
                        }
                    }
                    setIsLoading(false)
                    navigation.navigate("ValidationPaymentScreen", {
                        cartItems: cartItems
                    })
                }
                }
        } catch (e) {
            console.log(e);
        }
        //3.Confirm the payment with the card details
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.treatmentText}>Votre paiement est en cours de traitement</Text>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    } else {
        return (
            <View>
                <Text style={{textAlign: "center", fontSize: 18}}>
                    Montant à régler : {toggleCheckBoxPortefeuille ? `${newTotal} €` : `${sousTotal}€ `}
                </Text>
                <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                        number: "4242 4242 4242 4242"
                    }}
                    cardStyle={styles.card}
                    style={styles.cardContainer}
                    onCardChange={cardDetails => {
                        setCardDetails(cardDetails)
                    }}
                />

                <TouchableOpacity style={styles.paymentButton} disabled={loading} onPress={handlePayPress}>
                    <Text style={styles.paymentButtonText}>Payer</Text>
                </TouchableOpacity>

                <Text style={{textAlign: "center", fontSize: 18}}>
                    Payment Powered by Stripe
                </Text>
                <TouchableOpacity
                    style={styles.mettreEnVenteOptional}
                    onPress={() => {
                        navigation.navigate("AccueilScreen")
                    }}
                >
                    <Text style={styles.mettreEnVenteTextOptional}>
                        Annuler Paiement
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        height: 50,
        marginVertical: 50
    },
    mettreEnVenteOptional: {
        backgroundColor: "#fff",
        borderColor: "#D51317",
        marginTop: 10,
        width: windowWidth - 20,
        paddingVertical: "5%",
    },
    mettreEnVenteTextOptional: {
        color: "#D51317",
        textAlign: "center",
        fontSize: 18,
    },
    treatmentText: {
        textAlign: 'center',
        fontSize: 20
    },
    paymentButton: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D51317",
        color: "white",
        marginVertical: 50
    },
    paymentButtonText: {
        color: "white",
        fontSize: 20
    }
})

export default AndroidPaymentView;

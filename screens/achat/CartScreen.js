import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";
import * as productActions from "../../store/actions/products";
import { PaymentView } from "../../components/PaymentView";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import firebase from "firebase";
import * as userActions from "../../store/actions/users";
import RecapCommandeItem from "../../components/RecapCommandeItem";
import { get_mondial_relay_price } from "../../components/MondialRelayShippingPrices";
import {Formik} from "formik";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CartScreen = (props) => {
  const dispatch = useDispatch();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBoxPortefeuille, setToggleCheckBoxPortefeuille] =
    useState(false);
  const userData = useSelector((state) => state.user.userData);

  let livraison;
  let cartItems2;
  let adresse;
  let IBAN;

  if (props.route.params) {
    livraison = props.route.params.livraison;
    cartItems2 = props.route.params.cartItems;
    if (props.route.params.index != undefined) {
      cartItems2[props.route.params.index].adresse = props.route.params.adresse;
    }
  }


  let cartItems = useSelector((state) => {
    const transformedCartItems = [];
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
          description: state.cart.items[key].description,
      });
    }
    return transformedCartItems;
  });

  if (cartItems2) {
    cartItems = cartItems2;
  }
  let total = 0;

  console.log('cart', )
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // The screen is focused
      dispatch(userActions.getUser());
      cartItems.map((item, index) => {
        dispatch(productActions.fetchProducts(item.categorie));
      });
    });
    return unsubscribe;
  }, [props.navigation, dispatch]);

  let portefeuilleAcheteur = 0;
  for (let data in cartItems) {
    total +=
      parseFloat(cartItems[data].quantity) *
      parseFloat(cartItems[data].productPrice);
  }

  const cartInfo = {
    id: "5eruyt35eggr76476236523t3",
    description: "T Shirt - With react Native Logo",
    amount: 1,
  };


  console.log('cartItems', cartItems);

  const [response, setResponse] = useState();
  const [makePayment, setMakePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [portefeuillePayment, setPortefeuillePayment] = useState(false);

  let sousTotal = (total * 1.05).toFixed(2);
  let netVendeur = Number(total).toFixed(2);

  let deductionPortefeuille = Number(userData?.portefeuille)
  console.log('soustotal', sousTotal);
    let etiquette_url = "";
  const onCheckStatus = async (paymentResponse) => {
    setPaymentStatus("Votre paiement est en cours de traitement");
    setResponse(paymentResponse);

    let jsonResponse = JSON.parse(paymentResponse);

    try {
      const stripeResponse = await axios.post(
        "https://kval-backend.herokuapp.com/paymentonetime",
        {
          email: `${userData.email}`,
          product: cartInfo,
          authToken: jsonResponse,
          amount: toggleCheckBoxPortefeuille ? newTotal * 100 : sousTotal * 100,
        }
      );
      if (stripeResponse) {
          console.log(stripeResponse)
        const { paid } = stripeResponse.data;
        if (paid === true) {
          for (const cartItem of cartItems) {
              console.log('cartItem', cartItem)
            await firebase
              .firestore()
              .collection("commandes")
              .doc(firebase.auth().currentUser.uid)
              .collection("userCommandes")
              .doc(`${cartItem.productId}`)
              .set({
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
                moyenPaiement: "CB",
              });
            await firebase
              .firestore()
              .collection("notifications")
              .doc(cartItem.idVendeur)
              .collection("listeNotifs")
              .add({
                notificationsTitle: "Un article a été vendu !",
                notificationsBody: `L'article ${cartItem.productTitle} a été acheté !`,
                image: cartItem.image,
              });
            await firebase
              .firestore()
              .collection("notifications")
              .doc(cartItem.idVendeur)
              .set({
                test: "test",
              });
            await firebase
              .firestore()
              .collection("users")
              .doc(cartItem.idVendeur)
              .collection("unreadMessage")
              .doc(cartItem.idVendeur)
                .get().then(async (doc) => {
                    if (doc.exists) {
                        console.log('yeah')
                    } else {
                        await firebase.firestore()
                            .collection('users')
                            .doc(cartItem.idVendeur)
                            .collection('unreadMessage')
                            .doc(cartItem.idVendeur)
                            .set({
                                count: 1
                            })
                        console.log("New doc created !");
                    }
                })
              .catch((error) => {
                console.log("Error getting document:", error);
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
                to: pushToken.data,
                title: "Un de vos articles a été acheté !",
                body: `L'article ${cartItem.productTitle} a été acheté !`,
              }),
            });

            if (toggleCheckBoxPortefeuille) {
                try {
                    await firebase
                        .firestore()
                        .collection("users")
                        .doc(firebase.auth().currentUser.uid)
                        .update({
                            portefeuille : 0
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
            <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : ${cartItem.adresse}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé par CB</p>
        </div>
    </div>
    
    <hr>
    
    <p>Le vendeur a 5 jours pour expédier votre article et <p style="font-weight: bold">vous avez 2 jours dès réception de l’article</p> en conformité avec sa description, pour le signaler reçu et conforme <p style="font-weight: bold">via l’application</p>(Profile, Mes commandes)</p>
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
        <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : ${
          cartItem.adresse
        }</p>
        <p style="margin: 0">Prix de la livraison: attente de Mondial Relay</p>
        <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p>
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
    
    <p>Le vendeur a 5 jours pour expédier votre article et <p style="font-weight: bold">vous avez 2 jours dès réception de l’article</p> en conformité avec sa description, pour le signaler reçu et conforme <p style="font-weight: bold">via l’application</p>(Profile, Mes commandes)</p>
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
        <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p>
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
        }
        setPaymentStatus(
          "Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro"
        );
      } else {
        setPaymentStatus("Le paiement a échoué");
      }
    } catch (error) {
      console.log(error);
      setPaymentStatus("Le paiement a échoué");
    }
  };

  const cartTotalAmount = useSelector((state) => state.cart.items);

  const [errors, setErrors] = useState(false);
  let enteredAdresse = false;
  if (userData) {
    enteredAdresse = true;
    IBAN = userData.IBAN;
  }


  const ViewPortefeuille = () => {
      const [auth, setAuth] = useState(false);
      const [confirmAuth, setConfirmAuth] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const initialValues = {
          email: "",
          password: "",
      };
      console.log('auth', auth);
      const [err, setErr] = useState(null);

    const PaymentPortefeuille = async () => {
      for (const cartItem of cartItems) {
        await firebase
          .firestore()
          .collection("commandes")
          .doc(firebase.auth().currentUser.uid)
          .collection("userCommandes")
          .doc(`${cartItem.productId}`)
          .set({
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
              moyenPaiement: "portefeuille",
          });

        await firebase
          .firestore()
          .collection("notifications")
          .doc(cartItem.idVendeur)
          .collection("listeNotifs")
          .add({
            notificationsTitle: "Un article a été vendu !",
            notificationsBody: `L'article ${cartItem.productTitle} a été acheté !`,
            image: cartItem.image,
          });
        await firebase
          .firestore()
          .collection("notifications")
          .doc(cartItem.idVendeur)
          .set({
            test: "test",
          });
          await firebase
              .firestore()
              .collection("users")
              .doc(cartItem.idVendeur)
              .collection("unreadMessage")
              .doc(cartItem.idVendeur)
              .get().then(async (doc) => {
                  if (doc.exists) {
                      console.log('yeah')
                  } else {
                      await firebase.firestore()
                          .collection('users')
                          .doc(cartItem.idVendeur)
                          .collection('unreadMessage')
                          .doc(cartItem.idVendeur)
                          .set({
                              count: 1
                          })
                      console.log("New doc created !");
                  }
              })
              .catch((error) => {
                  console.log("Error getting document:", error);
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
            to: pushToken.data,
            title: "Un de vos articles a été acheté !",
            body: `L'article ${cartItem.productTitle} a été acheté !`,
          }),
        });
        try {
          await firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
              portefeuilleAcheteur = doc.data().portefeuille;
            })
            .then(() => {
              if (portefeuilleAcheteur > 0) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(firebase.auth().currentUser.uid)
                  .update({
                    portefeuille:
                      portefeuilleAcheteur - Number(sousTotal),
                  });
              }
            });
        } catch (err) {
          console.log(err);
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
            <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : ${cartItem.adresse}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé avec le portefeuille</p>
        </div>
    </div>
    
    <hr>
    
    <p>Le vendeur a 5 jours pour expédier votre article et <p style="font-weight: bold">vous avez 2 jours dès réception de l’article</p> en conformité avec sa description, pour le signaler reçu et conforme <p style="font-weight: bold">via l’application</p>(Profile, Mes commandes)</p>
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
        <p style="margin: 0">Livraison: Mondial Relay à l'adresse suivante : ${
                      cartItem.adresse
                  }</p>
        <p style="margin: 0">Prix de la livraison: attente de Mondial Relay</p>
        <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p>
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
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € payé avec le portefeuille</p>
        </div>
    </div>
    
    <hr>
    
    <p>Le vendeur a 5 jours pour expédier votre article et <p style="font-weight: bold">vous avez 2 jours dès réception de l’article</p> en conformité avec sa description, pour le signaler reçu et conforme <p style="font-weight: bold">via l’application</p>(Profile, Mes commandes)</p>
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
        <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${netVendeur} € net vendeur crédité dans votre portefeuille dès l'instant où l'acheteur validera la réception du colis si celui-ci est conforme à sa description.</p>
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
      props.navigation.navigate("PortefeuilleThankYouScreen");
    };
    return (
      <View>
          <View>

              {isLoading ?
                  <View style={styles.containerLoading}>
                      <Text style={styles.loadingText}>
                          Veuillez patientez...
                      </Text>
                      <ActivityIndicator color="red"/>
                  </View>
                  : <View>
                      {auth ? <View>
                          <Text style={styles.portefeuilleText}>
                              Vous avez suffisamment d'argent sur votre portefeuille
                          </Text>
                          <TouchableOpacity
                              style={styles.mettreEnVente}
                              onPress={async () => {
                                  setIsLoading(true);
                                  await PaymentPortefeuille();
                                  setIsLoading(false);
                              }}
                          >
                              <Text style={styles.mettreEnVenteText}>
                                  Procéder au paiement avec l'argent de mon portefeuille
                              </Text>
                          </TouchableOpacity>
                      </View> : <View>
                          {!confirmAuth ? <View>
                              <Text style={styles.authText}>Pour l'utilisation de votre portefeuille et pour votre sécurité nous vous demandons de vous authentifier</Text>
                              <TouchableOpacity
                                  style={styles.mettreEnVente}
                                  onPress={() => setConfirmAuth(true)}
                              >
                                  <Text style={styles.mettreEnVenteText}>
                                      M'authentifier
                                  </Text>
                              </TouchableOpacity>
                          </View> :    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container3}>
                              <KeyboardAvoidingView style={styles.container3} behavior="padding">
                                  <Text style={styles.title}>Se connecter</Text>
                                  <Formik
                                      initialValues={initialValues}
                                      onSubmit={async (values) => {

                                          try {
                                              await firebase
                                                  .auth()
                                                  .signInWithEmailAndPassword(values.email, values.password);
                                              setAuth(true);
                                          } catch (err) {
                                              console.log(err);
                                              setErr(err);
                                          }
                                      }}
                                  >
                                      {(props) => (
                                          <View style={styles.formContainer}>
                                              <View>
                                                  <Text style={styles.text4}>Email</Text>
                                                  <TextInput
                                                      placeholder="Email"
                                                      keyboardType="email-address"
                                                      autoCompleteType="email"
                                                      placeholderTextColor="white"
                                                      value={props.values.email}
                                                      style={styles.textInput}
                                                      onChangeText={props.handleChange("email")}
                                                  />
                                              </View>

                                              <View>
                                                  <Text style={styles.text4}>Mot de passe</Text>
                                                  <TextInput
                                                      placeholder="Mot de passe"
                                                      placeholderTextColor="white"
                                                      value={props.values.password}
                                                      style={styles.textInput}
                                                      secureTextEntry={true}
                                                      onChangeText={props.handleChange("password")}
                                                  />
                                              </View>

                                              {err ? (
                                                  <Text style={styles.err}>Vos identifiants sont incorrects</Text>
                                              ) : (
                                                  <Text />
                                              )}
                                              <TouchableOpacity
                                                  style={styles.buttonContainer}
                                                  onPress={props.handleSubmit}
                                              >
                                                  <Text style={styles.createCompte}>Valider</Text>
                                              </TouchableOpacity>
                                          </View>
                                      )}
                                  </Formik>
                              </KeyboardAvoidingView>
                          </TouchableWithoutFeedback>}

                      </View>}
                  </View>
              }

          </View>
      </View>
    );
  };

  const [goConfirmation, setGoConfirmation] = useState(false);

  let totalProtectionAcheteur = 0;
  let totalLivraison = 0;
  for (let item of cartItems) {
    totalProtectionAcheteur += parseFloat(item.productPrice * 0.05);
    if (item.livraison === "MondialRelay") {
      totalLivraison += Number(get_mondial_relay_price(item.poids));
    }
  }
  totalProtectionAcheteur = totalProtectionAcheteur.toFixed(2);
  totalLivraison = totalLivraison.toFixed(2);

  sousTotal = (Number(sousTotal) + Number(totalLivraison)).toFixed(2);
  let reductionPortefeuille;
  let goPaymentPortefeuille = userData?.portefeuille >= sousTotal;

  if (userData?.portefeuille <= sousTotal) {
        reductionPortefeuille = userData.portefeuille.toFixed(2);
  } else {
        reductionPortefeuille = sousTotal;
  }
  const newTotal = (sousTotal - reductionPortefeuille).toFixed(2);
  const paymentUI = (props) => {
    if (portefeuillePayment && goPaymentPortefeuille) {
      return <ViewPortefeuille />;
    }

    console.log('makePayment', makePayment)
    if (!makePayment) {
      if (!goConfirmation) {
        return (
          <ScrollView>
            {cartItems.map((item, index) => {
                console.log('item', item)
              const protectionAcheteur = parseFloat(item.productPrice * 0.05);
              const price = parseFloat(item.productPrice);
              const sousTotal = (
                price +
                protectionAcheteur +
                (item.livraison === "MondialRelay" &&
                  Number(get_mondial_relay_price(item.poids)))
              ).toFixed(2);

              console.log('sous', sousTotal)
              return (
                <View style={{ marginBottom: 50 }}>
                  {cartItems.length > 1 ? (
                    <Text style={styles.articleTitle}>Article {index + 1}</Text>
                  ) : (
                    <Text />
                  )}

                  <RecapCommandeItem
                    title={item.productTitle}
                    price={item.productPrice}
                    poids={item.poids}
                    image={item.image}
                    key={index}
                  />
                  <View
                    style={[
                      styles.itemForm3,
                      {
                        borderTopColor: "lightgrey",
                        borderTopWidth: 1,
                        marginTop: 10,
                        display: "flex",
                        flexDirection: "column",
                      },
                    ]}
                  >
                    <Text
                      style={
                        !item.livraison ? styles.modeErrors : styles.noError
                      }
                    >
                      Mode de livraison {item.productTitle}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate("LivraisonChoiceScreen", {
                          product: cartItems[index],
                          cartItems: cartItems,
                          index: index,
                        });
                      }}
                    >
                      {item.livraison ? (
                        <Text>{item.livraison}</Text>
                      ) : (
                        <Text>Choisir</Text>
                      )}
                    </TouchableOpacity>
                    {item.livraison === "Livraison Article Lourd" ? (
                      <Text style={{ textAlign: "center" }}>
                        Nous reviendrons vers vous dans les plus bref délais
                        avec une estimation du prix
                      </Text>
                    ) : (
                      <Text />
                    )}
                  </View>
                  {item.livraison === "MondialRelay" && (
                    <View style={styles.itemForm3}>
                      <View style={styles.adresseText}>
                        <Text
                          style={
                            !enteredAdresse || !item.adresse
                              ? styles.modeErrors
                              : styles.noError
                          }
                        >
                          Adresse
                        </Text>
                      </View>

                      <View style={styles.adresseContainer}>
                        <Text style={styles.adresseInner}>
                          {item.adresse ? (
                            `Point Relais : n°${item.adresse.ID} \n${item.adresse.Nom}\n${item.adresse.Adresse1}\n${item.adresse.CP} \n ${item.adresse.Ville}`
                          ) : (
                            <Text />
                          )}

                          {item.adresse || enteredAdresse ? (
                            <TouchableOpacity
                              onPress={() =>
                                props.navigation.navigate("AdresseChoiceScreen")
                              }
                              style={styles.modifierAdresse}
                            >
                              <Text>Modifier</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text />
                          )}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.itemForm3}>
                    <Text style={{ fontSize: 18 }}>Prix de l'article</Text>
                    <Text style={{ fontSize: 18 }}>{item.productPrice} €</Text>
                  </View>

                  {item.livraison === "MondialRelay" && (
                    <View style={styles.itemForm3}>
                      <Text style={{ fontSize: 18 }}>
                        + Frais de livraison Mondial Relay
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        {get_mondial_relay_price(item.poids)} €
                      </Text>
                    </View>
                  )}

                  <View style={styles.itemForm3}>
                    <Text style={{ fontSize: 18 }}>Protection acheteur</Text>
                    <Text style={{ fontSize: 18 }}>
                      {(item.productPrice * 0.05).toFixed(2)} €
                    </Text>
                  </View>

                  <View style={styles.itemForm3}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Sous-total
                    </Text>
                    <Text style={{ fontSize: 18 }}>{sousTotal} €</Text>
                  </View>
                </View>
              );
            })}

            {errors ? (
              <Text style={{ textAlign: "center", color: "red" }}>
                Veuillez remplir tous les champs
              </Text>
            ) : (
              <Text />
            )}
            <TouchableOpacity
              style={styles.mettreEnVente}
              onPress={async () => {
                for (let item of cartItems) {
                  if (item.livraison === "Choisir") {
                    setErrors(true);
                  } else {
                    setGoConfirmation(true);
                  }
                }
              }}
            >
              <Text style={styles.mettreEnVenteText}>
                Finaliser ma commande
              </Text>
            </TouchableOpacity>
          </ScrollView>
        );
      } else {
        return (
          <ScrollView>
            <Text style={styles.articleTitle}>
              Récapitulatif de votre commande
            </Text>
            {cartItems.map((item, index) => {
                return (
                <RecapCommandeItem
                  title={item.productTitle}
                  price={item.productPrice}
                  image={item.image}
                  poids={item.poids}
                  key={index}
                />
              );
            })}

            <View style={styles.itemForm3}>
              <Text style={{ fontSize: 18 }}>Total articles</Text>
              <Text style={{ fontSize: 18 }}>{total.toFixed(2)} €</Text>
            </View>

            <View style={styles.itemForm3}>
              <Text style={{ fontSize: 18 }}>Protection acheteur</Text>
              <Text style={{ fontSize: 18 }}>{totalProtectionAcheteur} €</Text>
            </View>

            <View style={styles.itemForm3}>
              <Text style={{ fontSize: 18 }}>Total livraison</Text>
              <Text style={{ fontSize: 18 }}>{totalLivraison} €</Text>
            </View>

            <View style={styles.itemForm3}>
              <Text style={{ fontSize: 18 }}>Dans le portefeuille</Text>
              <Text style={{ fontSize: 18 }}>
                {userData?.portefeuille.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.itemForm3}>
              <Text style={{ fontSize: 18 }}>Sous-Total</Text>
              <Text style={{ fontSize: 18 }}>{sousTotal} €</Text>
            </View>

            <View style={styles.itemForm3}>
              <BouncyCheckbox
                size={25}
                fillColor="red"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "red" }}
                onPress={() => {
                    setToggleCheckBoxPortefeuille(!toggleCheckBoxPortefeuille)
                }
                }
              />
              <Text style={{ fontSize: 18 }}>Déduction Portefeuille</Text>
              <Text style={{ fontSize: 18 }}>- {reductionPortefeuille} €</Text>
            </View>

            <View style={styles.itemForm3}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total</Text>
              <Text style={styles.totalPrice}>
                {toggleCheckBoxPortefeuille ? newTotal : sousTotal} €
              </Text>
            </View>

            <View style={styles.checkBoxContainer}>
              <View style={styles.checkboxInner}>
                <BouncyCheckbox
                  size={25}
                  fillColor="red"
                  unfillColor="#FFFFFF"
                  iconStyle={{ borderColor: "red" }}
                  onPress={() => setToggleCheckBox(!toggleCheckBox)}
                />
              </View>
              <Text style={styles.acceptGeneralConditions}>
                J’accepte les conditions générales de vente, cliques{" "}
                <Text
                  style={styles.ici}
                  onPress={() =>
                    props.navigation.navigate("Profil", {
                      screen: "CGUScreen",
                      params: { from: "CartScreen" },
                    })
                  }
                >
                  ici
                </Text>{" "}
                pour les consulter{" "}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.mettreEnVente}
              onPress={async () => {
                if (props.loggedInAsVisit) {
                  props.setLoggedInAsVisit(!props.loggedInAsVisit);
                } else {
                  if (!toggleCheckBox) {
                    setErrors(true);
                  } else if (toggleCheckBoxPortefeuille && goPaymentPortefeuille) {
                    setErrors(false);
                    setPortefeuillePayment(true);
                  } else {
                    setErrors(false);
                    setMakePayment(true);
                  }
                }
              }}
            >
              <Text style={styles.mettreEnVenteText}>Payer ma commande</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      }
    } else {
      if (response !== undefined) {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            {paymentStatus === "Votre paiement est en cours de traitement" ? (
              <View>
                <Text>{paymentStatus}</Text>
                <ActivityIndicator />
              </View>
            ) : (
              <Text></Text>
            )}

            {paymentStatus === "Le paiement a échoué" ? (
              <View style={styles.container2}>
                <AntDesign name="close" size={200} color="white" />
                <Text style={styles.text3}>Le paiment a échoué</Text>
                <TouchableOpacity
                  style={styles.retourContainer}
                  onPress={() => {
                    props.navigation.navigate("AccueilScreen");
                  }}
                >
                  <Text style={styles.text2}>Retour au menu principal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text />
            )}
            {paymentStatus ===
            "Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro" ? (
              <View style={styles.container2}>
                <AntDesign name="checkcircleo" size={200} color="white" />
                <Text style={styles.text3}>
                  Vous avez bien acheté l'article !
                </Text>
                <TouchableOpacity
                  style={styles.retourContainer}
                  onPress={() => {
                    props.navigation.navigate("AccueilScreen");
                  }}
                >
                  <Text style={styles.text2}>Retour au menu principal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text></Text>
            )}
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Montant à régler : {toggleCheckBoxPortefeuille ? `${newTotal} €` : `${sousTotal}€ `}
            </Text>
            <PaymentView
              onCheckStatus={onCheckStatus}
              product={"Paiement unique"}
              amount={sousTotal}
            />
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Payment Powered by Stripe
            </Text>
            <TouchableOpacity
              style={styles.mettreEnVenteOptional}
              onPress={() => {
                adresse = null;
                enteredAdresse = null;
                setToggleCheckBox(false);
                setMakePayment(!makePayment);
              }}
            >
              <Text style={styles.mettreEnVenteTextOptional}>
                Annuler Paiement
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  };

  return <View style={styles.container}>{paymentUI(props)}</View>;
};

const styles = StyleSheet.create({
  suivantContainer: {
    position: "absolute",
    top: "92%",
    width: "100%",
    paddingVertical: "3%",
    alignItems: "center",
    backgroundColor: "#0d1b3d",
  },
  itemForm3: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginLeft: "5%",
    paddingVertical: "5%",
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
  },
  noCommandeText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: windowHeight / 2.5,
  },
  totalContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "90%",
    marginLeft: "5%",
    paddingVertical: "5%",
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  totalPrice: {
    color: "black",
    fontSize: 18,
    width: "70%",
  },
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
  startContainer: {
    position: "absolute",
    top: "900%",
    width: windowWidth / 1.2,
    left: "4%",
    paddingVertical: "3%",
    alignItems: "center",
    backgroundColor: "#0d1b3d",
  },
  suivantText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  suivantText2: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  modeErrors: {
    color: "red",
    fontSize: 18,
  },
  noError: {
    fontSize: 18,
  },
  paiementstatus: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
    container3: {
        backgroundColor: "#D51317",
        alignItems: "center",
        paddingBottom: "40%"
    },
    title: {
        fontSize: 27,
        marginTop: 15,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    textInput: {
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        color: 'white',
        paddingVertical: "4%",
        marginTop: 10,
        paddingLeft: "8%",
    },
    buttonContainer: {
        backgroundColor: "white",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 1,
        shadowColor: "grey",
        width: "100%",
        paddingVertical: "5%",
        borderRadius: 10,
        marginTop: 15,
        marginBottom: "100%"
    },
    err: {
        color: "black",
        fontSize: 15,
        textAlign: "center",
        marginTop: 20,
    },
    createCompte: {
        color: "black",
        fontSize: 18,
        textAlign: "center",
    },
    text4: {
        color: "white",
        fontSize: 18,
        marginTop: 35,
    },
    connecteContainer: {
        display: "flex",
        flexDirection: "row",
    },
    formContainer: {
        width: "70%",
    },
    connecte: {
        marginBottom: "1%",
    },
  container2: {
    backgroundColor: "#D51317",
    flex: 1,
    alignItems: "center",
    paddingTop: windowHeight / 4,
  },
  image: {
    height: 200,
    width: 200,
  },
  text2: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: "3%",
    color: "white",
  },
  text3: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: "3%",
    color: "white",
    width: windowWidth / 2,
  },
  retourContainer: {
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 20,
    paddingHorizontal: windowWidth / 17,
    width: windowWidth / 1.1,
    alignItems: "center",
    paddingBottom: "2%",
    marginTop: windowHeight / 9,
  },
  imageContainer: {
    height: "20%",
  },
  ombre: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  ombreContainer: {
    position: "absolute",
    top: "6%",
    alignItems: "center",
    left: "5%",
  },
  innerText: {
    color: "white",
    fontSize: 16,
  },
  innerTextPlus: {
    color: "white",
    fontSize: 18,
    marginTop: "10%",
  },
  innerText2: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  modifierAdresse: {
    marginBottom: -20,
    marginLeft: 20,
    height: 30,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textContainer: {
    width: "90%",
  },
  superContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "40%",
    borderTopColor: "white",
    borderTopWidth: 1,
  },
  boutonContainer: {
    textAlign: "center",
    justifyContent: "space-around",
    marginBottom: "5%",
    display: "flex",
    flexDirection: "row",
  },
  decline: {
    backgroundColor: "black",
    paddingHorizontal: "10%",
    paddingVertical: "5%",
    alignItems: "center",
    marginTop: "5%",
  },
  text: {
    color: "white",
    fontSize: 16,
    borderBottomWidth: 5,
    borderBottomColor: "white",
  },
  paiementContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "20%",
  },
  textEntrainement: {
    color: "white",
    fontSize: 16,
  },
  entrainementCherContainer: {
    borderWidth: 1,
    borderColor: "white",
    display: "flex",
    flexDirection: "row",
    width: "110%",
    marginTop: "10%",
  },
  entrainementPasClicked: {
    display: "flex",
    flexDirection: "row",
    width: "110%",
    marginTop: "10%",
  },
  entrainementPasCher: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  entrainementPasCherClicked: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
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
    },
  paymentStatusText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },
  codePromoContainer: {
    borderWidth: 1,
    borderColor: "white",
    width: "60%",
    padding: "2% 2%",
    marginLeft: "20%",
    alignItems: "center",
    margin: "2%",
  },
  codePromo: {
    color: "white",
  },
  suivantContainer2: {
    width: "60%",
    paddingVertical: "3%",
    marginLeft: "20%",
    alignItems: "center",
    backgroundColor: "#0d1b3d",
  },
  modalContainer: {
    backgroundColor: "black",
    alignItems: "center",
    flex: 1,
    paddingTop: "20%",
    paddingHorizontal: "10%",
  },
  modalTextContainer: {
    marginTop: "20%",
    textAlign: "center",
  },
  adresseText: {
    width: "30%",
  },
  adresseContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 5,
    width: "60%",
  },
  portefeuilleText: {
    fontSize: 18,
    textAlign: "center",
  },
  acceptGeneralConditions: {
    maxWidth: "80%",
  },
  iciContainer: {
    margin: 0,
    padding: 0,
  },
  ici: {
    marginTop: 25,
    padding: 0,
    color: "blue",
  },
  subTotal: {
    textAlign: "center",
    fontSize: 20,
  },
  list: {
    marginBottom: 50,
  },
  articleTitle: {
    textAlign: "center",
    fontSize: 25,
  },
    authText: {
      fontSize: 20,
        textAlign: 'center'
    }
});

export default CartScreen;

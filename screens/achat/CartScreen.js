import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../../components/CartItem";
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
    adresse = props.route.params.adresse;
    cartItems2 = props.route.params.cartItems;
  }

  console.log(adresse);
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
      });
    }
    return transformedCartItems;
  });

  if (cartItems2) {
    cartItems = cartItems2;
    console.log(cartItems);
  }
  let total = 0;

  console.log("email", userData.email);
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

  let portefeuilleVendeur = 0;
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

  const [response, setResponse] = useState();
  const [makePayment, setMakePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [portefeuillePayment, setPortefeuillePayment] = useState(false);

  const sousTotal = (total * 1.095).toFixed(2);
  let reductionPortefeuille;

  if (userData?.portefeuille <= sousTotal) {
    reductionPortefeuille = userData.portefeuille;
  } else {
    reductionPortefeuille = sousTotal;
  }

  const newTotal = (sousTotal - reductionPortefeuille).toFixed(2);

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
        const { paid } = stripeResponse.data;
        if (paid === true) {
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
                prixProtectionAcheteur: totalProtectionAcheteur,
                productTitle: cartItem.productTitle,
                total: sousTotal,
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
              .doc(firebase.auth().currentUser.uid)
              .collection("unreadMessage")
              .doc(firebase.auth().currentUser.uid)
              .get()
              .then(async (doc) => {
                if (doc.exists) {
                  await firebase
                    .firestore()
                    .collection("users")
                    .doc(cartItem.idVendeur)
                    .collection("unreadMessage")
                    .doc(cartItem.idVendeur)
                    .update({
                      count: doc.data().count + 1,
                    });
                } else {
                  await firebase
                    .firestore()
                    .collection("users")
                    .doc(cartItem.idVendeur)
                    .collection("unreadMessage")
                    .doc(cartItem.idVendeur)
                    .set({
                      count: 1,
                    });
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
            await firebase
              .firestore()
              .collection("users")
              .doc(cartItem.idVendeur)
              .get()
              .then((doc) => {
                portefeuilleVendeur = doc.data().portefeuille;
              })
              .then(() => {
                if (portefeuilleVendeur >= 0) {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(cartItem.idVendeur)
                    .update({
                      portefeuille:
                        portefeuilleVendeur + parseInt(cartItem.sum),
                    });
                }
              });
           /* let etiquette_url = "";
            if ((livraison = "MondialRelay")) {
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
            <DeliveryMode Mode="24R" Location="${adresse.ID}" />
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
                    <PostCode>${adresse.CP}</PostCode>
                    <City>${adresse.Ville}</City>
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

              etiquette_url = await axios(config)
                .then(function (response) {
                  return response
                    .data.shipmentsListField[0].labelListField.labelField.outputField;
                })
                .catch(function (error) {
                  console.log(error);
                });
            }

            */
            await axios.post("https://kval-backend.herokuapp.com/send", {
              mail: userData.email,
              subject: "Confirmation d'achat",
              html_output: `
<div>
    <p>Félicitations, ${userData.pseudo}, <br></p> 
    <p>Vous venez d'acheter un article à ${cartItem.pseudoVendeur}.</p>
    <p>Récapitulatif de l'achat : </p>
    <hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">${cartItem.productTitle}</p>
            <p style="margin: 0">Prix de l'article: ${cartItem.productPrice} €</p>
            <p style="margin: 0">Protection acheteur : ${totalProtectionAcheteur} €</p>
            <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
            <p style="margin: 0">Livraison: ${cartItem.livraison} à l'adresse suivante : ${userData.adresse}</p>
            <p style="font-weight: bold; margin: 0">Total: ${sousTotal} €</p>
        </div>
    </div>
    
    <hr>
    
    <p>Le vendeur à 5 jours pour expédier votre article et vous avez 2 jours dès réception de l’article en conformité avec sa description, pour le signalé reçu et conforme via l’application.</p>
    <p>Ce signalement donnera immédiatement lieu au paiement du vendeur.</p>
    <p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté au crédit du vendeur et une enquête sera effectuée par nos soins.</p>
    <br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 200px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
            });
            await axios.post("https://kval-backend.herokuapp.com/send", {
              mail: cartItem.emailVendeur,
              subject: "Confirmation de vente",
              html_output: `<div><p>Félicitations, ${cartItem.pseudoVendeur},<br></p> 
<p>Votre article vient d'être acheté par ${userData.pseudo}.</p>
<p>Résumé de votre article : </p>

<hr>

<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${cartItem.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">${cartItem.productTitle}</p>
        <p style="margin: 0">Prix net vendeur: ${cartItem.productPrice} €</p>
        <p style="margin: 0">Poids: ${cartItem.poids} kgs</p>
        <p style="margin: 0">Livraison: ${cartItem.livraison}</p>
        <p style="margin: 0">Prix de la livraison: ${cartItem.livraison}</p>
        <p style="font-weight: bold; margin: 0">Total: ${sousTotal} € dont ${sousTotal} € net vendeur crédité dans votre portefeuille</p>
    </div>
</div>

<hr>

<p>Vous avez 5 jours pour expédier votre article et l’acheteur à 2 jours dès réception de l’article en conformité avec sa description, pour le signalé reçu et conforme via l’application.</p>
<p>Ce signalement donnera immédiatement lieu au crédit dans votre portefeuille.</p>
<p>Si l’article n’est pas conforme, le crédit de la vente ne sera pas porté dans votre portefeuille et donnera lieu à une enquête de notre part.</p>
<br>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 200px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
            });
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
            .doc(cartItem.idVendeur)
            .get()
            .then((doc) => {
              portefeuilleVendeur = doc.data().portefeuille;
            })
            .then(() => {
              if (portefeuilleVendeur >= 0) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(cartItem.idVendeur)
                  .update({
                    portefeuille: portefeuilleVendeur + parseInt(cartItem.sum),
                  });
              }
            });
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
                      portefeuilleAcheteur - parseInt(cartItem.productPrice),
                  });
              }
            });
        } catch (err) {
          console.log(err);
        }
      }
    };
    //PaymentPortefeuille().then(() => props.navigation.navigate('PortefeuilleThankYouScreen'))
    return (
      <View>
        <Text style={styles.portefeuilleText}>
          Vous avez suffisamment d'argent sur votre portefeuille
        </Text>
        <TouchableOpacity
          style={styles.mettreEnVente}
          onPress={async () => {
            await PaymentPortefeuille().then(() =>
              props.navigation.navigate("PortefeuilleThankYouScreen")
            );
          }}
        >
          <Text style={styles.mettreEnVenteText}>
            Procéder au paiement avec l'argent de mon portefeuille
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  console.log("cart", cartItems);
  const [goPaiement, setGoPaiement] = useState(false);
  const [goConfirmation, setGoConfirmation] = useState(false);

  let totalProtectionAcheteur = 0;
  for (let item of cartItems) {
    totalProtectionAcheteur += parseFloat(item.productPrice * 0.095);
  }
  totalProtectionAcheteur = totalProtectionAcheteur.toFixed(2);

  const paymentUI = (props) => {
    if (portefeuillePayment) {
      return <ViewPortefeuille />;
    }

    if (!makePayment) {
      if (!goConfirmation) {
        return (
          <ScrollView>
            {cartItems.map((item, index) => {
              const protectionAcheteur = parseFloat(item.productPrice * 0.095);
              const price = parseFloat(item.productPrice);
              const sousTotal = (
                price +
                protectionAcheteur +
                (item.livraison === "MondialRelay" &&
                  get_mondial_relay_price(item.poids))
              ).toFixed(2);

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
                            !enteredAdresse || !adresse
                              ? styles.modeErrors
                              : styles.noError
                          }
                        >
                          Adresse
                        </Text>
                      </View>

                      <View style={styles.adresseContainer}>
                        <Text style={styles.adresseInner}>
                          {adresse ? (
                            `Point Relais : n°${adresse.ID} \n${adresse.Nom}\n${adresse.Adresse1}\n${adresse.CP} \n ${adresse.Ville}`
                          ) : (
                            <Text />
                          )}

                          {enteredAdresse && !adresse ? (
                            `${userData?.adresse} \n${userData?.postalCode}\n${userData?.ville}\n${userData?.pays} `
                          ) : (
                            <Text />
                          )}

                          {adresse || enteredAdresse ? (
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
                      {(item.productPrice * 0.095).toFixed(2)} €
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
              const protectionAcheteur = parseFloat(item.productPrice * 0.095);
              const price = parseFloat(item.productPrice);
              const sousTotal = (price + protectionAcheteur).toFixed(2);

              return (
                <RecapCommandeItem
                  title={item.productTitle}
                  price={item.productPrice}
                  image={item.image}
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
              <Text style={{ fontSize: 18 }}>{totalProtectionAcheteur} €</Text>
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
                onPress={() =>
                  setToggleCheckBoxPortefeuille(!toggleCheckBoxPortefeuille)
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
                  } else if (newTotal == 0.0 && toggleCheckBoxPortefeuille) {
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
      /*  {cartItems.map((item, index) => {
                          return (
                              <View
                                  style={[
                                    styles.itemForm3,
                                    {
                                      borderTopColor: "lightgrey",
                                      borderTopWidth: 1,
                                      marginTop: 10,
                                    },
                                  ]}
                              >
                                <Text style={!livraison ? styles.modeErrors : styles.noError}>
                                  Mode de livraison {item.productTitle}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                      props.navigation.navigate("LivraisonChoiceScreen", {
                                        product: cartItems[index],
                                        cartItems: cartItems,
                                        index: index
                                      });
                                    }}
                                >
                                  {item.livraison ? <Text>{item.livraison}</Text> : <Text>Choisir</Text>}
                                </TouchableOpacity>
                              </View>
                          )
                        }

                    )}


                    <View style={styles.itemForm3}>
                      <View style={styles.adresseText}>
                        <Text style={!enteredAdresse ? styles.modeErrors : styles.noError}>Adresse</Text>
                      </View>
                      <View style={styles.adresseContainer}>
                        <Text style={styles.adresseInner}>
                          {adresse ? (
                              `Point Relais : n°${adresse.ID} \n${adresse.Nom}\n${adresse.Adresse1}\n${adresse.CP} \n ${adresse.Ville}`
                          ) : (
                              <Text />
                          )}

                          {enteredAdresse && !adresse ? (
                              `${userData?.adresse} \n${userData?.postalCode}\n${userData?.ville}\n${userData?.pays} `
                          ) : (
                              <Text />
                          )}

                          {adresse || enteredAdresse ? (
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

                    <View style={styles.totalContainer}>
                      <View style={styles.itemForm3}>
                        <Text style={{ fontSize: 18 }}>Prix protection acheteur</Text>
                        <Text style={{ fontSize: 18 }}>
                          {(total * 0.095).toFixed(2)} €
                        </Text>
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
                            onPress={() => setToggleCheckBoxPortefeuille(!toggleCheckBoxPortefeuille)}
                        />
                        <Text style={{ fontSize: 18 }}>Déduction Portefeuille</Text>
                        <Text style={{ fontSize: 18 }}>
                          - {reductionPortefeuille} €
                        </Text>
                      </View>
                      <View style={styles.itemForm3}>
                        <Text style={{ fontSize: 18 }}>Total</Text>
                        <Text style={styles.totalPrice}>{toggleCheckBoxPortefeuille ? newTotal : sousTotal} €</Text>
                      </View>
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
                            } else if (newTotal == 0.0 && toggleCheckBoxPortefeuille) {
                              setErrors(false)
                              setPortefeuillePayment(true);
                            } else {
                              setErrors(false)
                              setMakePayment(true);
                            }
                          }
                        }}
                    >
                      <Text style={styles.mettreEnVenteText}>
                        Procéder au paiement
                      </Text>
                    </TouchableOpacity>
                    {errors ? (
                        <Text style={{ textAlign: "center", color: "red" }}>
                          Veuillez remplir tous les champs
                        </Text>
                    ) : (
                        <Text />
                    )}
                  </View>
              ) : (
                  <Text style={styles.noCommandeText}>Votre panier est vide</Text>
              )}
            </ScrollView>
        );
      }

                   */
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
            <PaymentView
              onCheckStatus={onCheckStatus}
              product={"Paiement unique"}
              amount={total}
            />
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
});

export default CartScreen;

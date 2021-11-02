import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../../components/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as productActions from '../../store/actions/products';
import { PaymentView } from "../../components/PaymentView";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import firebase from "firebase";
import * as userActions from "../../store/actions/users";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CartScreen = (props) => {
  const dispatch = useDispatch();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBoxPortefeuille, setToggleCheckBoxPortefeuille] = useState(false);
  const userData = useSelector((state) => state.user.userData);




  let livraison;
  let cartItems2;
  let adresse;
  let IBAN;

  if (props.route.params) {
    livraison = props.route.params.livraison;
    adresse = props.route.params.adresse;
    cartItems2 = props.route.params.cartItems
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
    cartItems = cartItems2
  }
  console.log('items', cartItems2);
  let total = 0;





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

  let idVendeurArray = cartItems.map(item => item.idVendeur)

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
          amount: toggleCheckBoxPortefeuille ? (newTotal * 100) : (sousTotal * 100),
        }
      );

      if (stripeResponse) {
        const { paid } = stripeResponse.data;
        if (paid === true) {
          for (const cartItem of cartItems) {
            console.log(cartItem)
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
                  console.log("doc data", doc.data().portefeuille);
                  console.log("portefeuille", portefeuilleVendeur);
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
                      })
                  }
                });
              await axios.post("https://kval-backend.herokuapp.com/send", {
                mail: userData.email,
                subject: "Confirmation d'achat",
                html_output: `<div><p>Bonjour, ${userData.pseudo}, <br></p> 
<p>Nous vous confirmons l'achat de l'article ${cartItem.productTitle} à ${cartItem.pseudoVendeur}.</p>
<p>A présent, ${cartItem.pseudoVendeur} dispose de 5 jours ouvrés pour vous envoyer l'article</p>
<p>Une fois l’article reçu vous disposerez de 2 jours pour faire une réclamation dans la rubrique « signaler un litige » de votre profil.</p>
<p>Le numéro de suivi vous sera communiqué lorsque l’envoie aura été effectué par ${cartItem.pseudoVendeur}</p>
<p>N’oubliez pas de vous rendre dans votre profil, rubrique « mes commandes » afin de nous informer de la bonne réception et conformité du colis.</p>
</div>`
              })
            } catch (err) {
              console.log(err);
            }
          }

          setPaymentStatus(
            "Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro"
          );
        } else {
          setPaymentStatus("Le paiement a échoué");
        }
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
              console.log("doc data", doc.data().portefeuille);
              console.log("portefeuille", portefeuilleVendeur);
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
              console.log("doc data", doc.data().portefeuille);
              console.log("portefeuille", portefeuilleAcheteur);
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

  const paymentUI = (props) => {
    console.log(makePayment);

    if (portefeuillePayment) {
      return <ViewPortefeuille />;
    }

    if (!makePayment) {
      return (
        <ScrollView style={styles.container}>
          {cartItems.length !== 0 ? (
            <View>
              <ScrollView horizontal={true}>
              <FlatList
                style={styles.list}
                data={cartItems}
                horizontal={true}
                keyExtractor={(item) => item.productId}
                renderItem={(itemData) => {
                  return (
                    <CartItem
                      title={itemData.item.productTitle}
                      price={itemData.item.productPrice}
                      image={itemData.item.image}
                      onDelete={() => {
                        dispatch(
                          cartActions.removeFromCart(itemData.item.productId)
                        );
                      }}
                    />
                  );
                }}
              />
              </ScrollView>

              {cartItems.map((item, index) => {
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
  list: {
    width: 8000
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
});

export default CartScreen;

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, ScrollView, Dimensions, ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Modal} from 'react-native';
import {useSelector, useDispatch} from "react-redux";
import CartItem from "../../components/CartItem";
import * as cartActions from '../../store/actions/cart'
import {PaymentView} from "../../components/PaymentView";
import axios from 'axios';
import {AntDesign} from "@expo/vector-icons";
import {Feather} from "@expo/vector-icons";
import firebase from "firebase";
import * as userActions from "../../store/actions/users";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CartScreen = (props) => {


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getUser())
  }, [dispatch]);


  const userData = useSelector(state => state.user.userData);



  let livraison;

  if (props.route.params) {
    livraison = props.route.params.livraison
  }

  let total = 0;
  const cartItems = useSelector(state => {
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
        pushToken: state.cart.items[key].pushToken,
        sum: state.cart.items[key].sum
      })

    }
    return transformedCartItems
  });


  let portefeuilleVendeur = 0

  for (let data in cartItems) {
    total += parseFloat(cartItems[data].quantity) * parseFloat(cartItems[data].productPrice)
  }


  const cartInfo = {
    id: '5eruyt35eggr76476236523t3',
    description: 'T Shirt - With react Native Logo',
    amount: 1
  }

  const [response, setResponse] = useState()
  const [makePayment, setMakePayment] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')

  const onCheckStatus = async (paymentResponse) => {
    setPaymentStatus('Votre paiement est en cours de traitement')
    setResponse(paymentResponse)

    let jsonResponse = JSON.parse(paymentResponse);

    // perform operation to check payment status

    try {

      const stripeResponse = await axios.post('https://stopgene.herokuapp.com/paymentonetime', {
        email: 'hadrien.jaubert99@gmail.com',
        product: cartInfo,
        authToken: jsonResponse,
        amount: 2
      })

      if (stripeResponse) {
        const {paid} = stripeResponse.data;
        if (paid === true) {
          for (const cartItem of cartItems) {
            console.log(cartItem)
            await firebase.firestore()
                .collection('commandes')
                .doc(firebase.auth().currentUser.uid)
                .collection("userCommandes")
                .doc(`${cartItem.productId}`)
                .set({
                  title: cartItem.productTitle,
                  prix: cartItem.productPrice,
                  image: cartItem.image,
                  vendeur: cartItem.idVendeur,
                  pseudoVendeur: cartItem.pseudoVendeur
                })
            await firebase.firestore()
              .collection('notifications')
              .doc(firebase.auth().currentUser.uid)
              .collection('listeNotifs')
              .add({
                notificationsTitle: 'Un article a été vendu !',
                notificationsBody: `L'article ${cartItem.productTitle} a été acheté !`
              })
            dispatch(cartActions.deleteCart())
            const pushToken = cartItem.pushToken;
            await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                to: pushToken,
                title: 'Un de vos articles a été acheté !',
                body: `L'article ${cartItem.productTitle} a été acheté !`
              })
            })
            try {
              await firebase.firestore().collection('users')
                  .doc(cartItem.idVendeur)
                  .get().then((doc) => {

                    portefeuilleVendeur = doc.data().portefeuille
                    console.log('doc data', doc.data().portefeuille)
                    console.log('portefeuille', portefeuilleVendeur)
                  }).then(() => {
                    firebase.firestore().collection('users')
                        .doc(cartItem.idVendeur)
                        .update({
                          portefeuille: portefeuilleVendeur + parseInt(cartItem.sum)
                        })
                  })
            } catch (err) {
              console.log(err)
            }

          }

          setPaymentStatus('Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro')
        } else {
          setPaymentStatus('Le paiement a échoué')
        }
      } else {
        setPaymentStatus('Le paiement a échoué')
      }
    } catch (error) {
      console.log(error)
      setPaymentStatus('Le paiement a échoué')
    }
  }

  const cartTotalAmount = useSelector(state => state.cart.items)

  console.log(userData)
  const paymentUI = props => {
    console.log(makePayment)
    if (!makePayment) {
      return (
        <ScrollView style={styles.container}>
          <FlatList
            style={styles.list}
            data={cartItems}
            horizontal={true}
            keyExtractor={item => item.productId}
            renderItem={itemData => {
              return (
                <CartItem
                  title={itemData.item.productTitle}
                  price={itemData.item.productPrice}
                  image={itemData.item.image}
                  onDelete={() => {
                    dispatch(cartActions.removeFromCart(itemData.item.productId));
                  }}
                />
              )
            }
            }
          />


          <View style={styles.itemForm3}>
            <Text style={{fontSize: 18}}>Mode de livraison</Text>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('LivraisonChoiceScreen')
            }}>
              {livraison ? <Text>{livraison}</Text> : <Text>Choisir</Text>}
            </TouchableOpacity>
          </View>


          <View style={styles.itemForm3}>
            <Text style={{fontSize: 18}}>Adresse</Text>
            <View style={styles.adresseContainer}>
            <Text style={styles.totalPrice}>{userData?.adresse}</Text>
              <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.totalPrice}>{userData?.postalCode}, </Text>
            <Text style={styles.totalPrice}>{userData?.ville}</Text>
              </View>
            <Text style={styles.totalPrice}>{userData?.pays}</Text>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <View style={styles.itemForm3}>
              <Text style={{fontSize: 18}}>Prix protection acheteur</Text>
              <Text style={{fontSize: 18}}>{total * 0.095} €</Text>
            </View>
            <View style={styles.itemForm3}>
              <Text style={{fontSize: 18}}>Portefeuille</Text>
              <Text style={{fontSize: 18}}>{userData?.portefeuille.toFixed(2)} €</Text>
            </View>
            <View style={styles.itemForm3}>
              <Text style={{fontSize: 18}}>Total</Text>
              <Text style={styles.totalPrice}>{total.toFixed(2)} €</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.mettreEnVente}
            onPress={async () => {
              if (userData?.portefeuille >= total) {
                for (const cartItem of cartItems) {
                  await firebase.firestore().collection('users')
                      .doc(cartItem.idVendeur)
                      .get().then((doc) => {
                        portefeuilleVendeur = doc.data().portefeuille
                        console.log('doc data', doc.data().portefeuille)
                        console.log('portefeuille', portefeuilleVendeur)
                      }).then(() => {
                        firebase.firestore().collection('users')
                            .doc(cartItem.idVendeur)
                            .update({
                              portefeuille: portefeuilleVendeur - parseInt(total)
                            })
                      })
                }
              } else {
                setMakePayment(true)
              }

            }}
          >
            <Text style={styles.mettreEnVenteText}>Procéder au paiement</Text>
          </TouchableOpacity>

        </ScrollView>
      )
    } else {

      if (response !== undefined) {
        console.log('paimentstatus', paymentStatus)
        return <View style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
          {paymentStatus === 'Votre paiement est en cours de traitement' ?
            <View>
              <Text>{paymentStatus}</Text>
              <ActivityIndicator/>
            </View> : <Text></Text>}

          {paymentStatus === 'Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro' ?
            <View style={styles.container2}>
              <AntDesign name="checkcircleo" size={200} color="white" />
              <Text style={styles.text3}>Vous avez bien acheté l'article !</Text>
              <TouchableOpacity style={styles.retourContainer} onPress={() => {
                props.navigation.navigate('AccueilScreen')
              }}>
                <Text style={styles.text2}>Retour au menu principal</Text>
              </TouchableOpacity>
            </View> : <Text></Text>}
        </View>

      } else {
        return (
          <PaymentView onCheckStatus={onCheckStatus} product={"Paiement unique"} amount={total}/>
        )

      }
    }
  }

  return (
    <View style={styles.container}>
      {paymentUI(props)}
    </View>
  );
}

const styles = StyleSheet.create({
  suivantContainer: {
    position: 'absolute',
    top: '92%',
    width: '100%',
    paddingVertical: '3%',
    alignItems: 'center',
    backgroundColor: '#0d1b3d'
  },
  itemForm3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    paddingVertical: '5%',
    alignItems: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  totalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    paddingVertical: '5%',
    alignItems: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  totalPrice: {
    color: '#D51317',
    fontSize: 18
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: '5%',
    marginLeft: '5%',
    width: windowWidth/1.1,
    paddingVertical: '5%'
  },
  mettreEnVenteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  startContainer: {
    position: 'absolute',
    top: '900%',
    width: windowWidth/1.2,
    left: '4%',
    paddingVertical: '3%',
    alignItems: 'center',
    backgroundColor: '#0d1b3d'
  },
  suivantText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  suivantText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  paiementstatus: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },
  container: {
    flex: 1,
  },
  container2: {
    backgroundColor: '#D51317',
    flex: 1,
    alignItems: 'center',
    paddingTop: windowHeight/4
  },
  image: {
    height: 200,
    width: 200
  },
  text2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '3%',
    color: 'white',
  },
  text3: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '3%',
    color: 'white',
    width: windowWidth/2
  },
  retourContainer : {
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: windowWidth/17,
    width: windowWidth/1.1,
    alignItems: 'center',
    paddingBottom: "2%",
    marginTop: windowHeight/9
  },
  imageContainer: {
    height: '20%'
  },
  ombre: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  ombreContainer: {
    position: 'absolute',
    top: '6%',
    alignItems: 'center',
    left: '5%'
  },
  innerText: {
    color: 'white',
    fontSize: 16
  },
  innerTextPlus: {
    color: 'white',
    fontSize: 18,
    marginTop: '10%'
  },
  innerText2: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  textContainer: {
    width: '90%'
  },
  superContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '40%',
    borderTopColor: 'white',
    borderTopWidth: 1
  },
  boutonContainer: {
    textAlign: 'center',
    justifyContent: 'space-around',
    marginBottom: '5%',
    display: 'flex',
    flexDirection: 'row'
  },
  decline: {
    backgroundColor: 'black',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    alignItems: 'center',
    marginTop: '5%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    borderBottomWidth: 5,
    borderBottomColor: 'white'
  },
  paiementContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '20%'
  },
  textEntrainement: {
    color: 'white',
    fontSize: 16
  },
  entrainementCherContainer: {
    borderWidth: 1,
    borderColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    width: '110%',
    marginTop: '10%'
  },
  entrainementPasClicked : {
    display: 'flex',
    flexDirection: 'row',
    width: '110%',
    marginTop: '10%'
  },
  entrainementPasCher: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  entrainementPasCherClicked: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  paymentStatusText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20
  },
  codePromoContainer : {
    borderWidth: 1,
    borderColor: 'white',
    width: '60%',
    padding: '2% 2%',
    marginLeft: '20%',
    alignItems: 'center',
    margin: '2%'
  },
  codePromo : {
    color: 'white'
  },
  suivantContainer2: {
    width: '60%',
    paddingVertical: '3%',
    marginLeft: '20%',
    alignItems: 'center',
    backgroundColor: '#0d1b3d'
  },
  modalContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    flex: 1,
    paddingTop: '20%',
    paddingHorizontal: '10%'
  },
  modalTextContainer: {
    marginTop: '20%',
    textAlign: 'center',
  },
  adresseContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
})

export default CartScreen;

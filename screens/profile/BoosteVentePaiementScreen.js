import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView, Image
} from 'react-native';
import Booste from "../../components/CartItem";
import * as cartActions from "../../store/actions/cart";
import CartItem from "../../components/CartItem";
import BoosteVentePaiementItem from "../../components/BoosteVentePaiementItem";
import RoundedCheckbox from "react-native-rounded-checkbox";
import {AntDesign, Entypo} from "@expo/vector-icons";
import {PaymentView} from "../../components/PaymentView";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import firebase from "firebase";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const BoosteVentePaiementScreen = (props) => {

  let articles;
  if (props.route.params && props.route.params.articles) {
    articles = props.route.params.articles
  }

  console.log('articles', articles)
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const [goPaiement, setGoPaiement] = useState(false);

  const cartInfo = {
    id: '5eruyt35eggr76476236523t3',
    description: 'T Shirt - With react Native Logo',
    amount: 1
  }
  const [response, setResponse] = useState()
  const [makePayment, setMakePayment] = useState(false);
  const [price, setPrice] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState('')

  console.log((price*100).toFixed(0))
  console.log('wola', articles)
  const onCheckStatus = async (paymentResponse) => {
    setPaymentStatus('Votre paiement est en cours de traitement')
    setResponse(paymentResponse)

    let jsonResponse = JSON.parse(paymentResponse);
    console.log('paymentresponse', paymentResponse)
    // perform operation to check payment status

    try {
      const stripeResponse = await axios.post('https://kval-backend.herokuapp.com/paymentonetime', {
        email: 'hadrien.jaubert99@gmail.com',
        product: cartInfo,
        authToken: jsonResponse,
        amount: (price*100).toFixed(0)
      })

      console.log('TSRIPE RESPONSE', stripeResponse)

      if (stripeResponse) {
        const {paid} = stripeResponse.data;
        if (paid === true) {
          for (let data in articles) {
            firebase.firestore().collection('BoostedVentes').doc(articles[data].id).set({
              description: articles[data].description,
              etat: articles[data].etat,
              prix: articles[data].prix,
              title: articles[data].title,
              image: articles[data].downloadURL,
              categorie: articles[data].categorie,
              pseudoVendeur: articles[data].pseudoVendeur,
              time: new Date()
            })
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
  console.log(cartTotalAmount)

  const paymentUI = props => {
    console.log(makePayment)
    if (!makePayment) {
      return (
        <ScrollView>
          <View style={styles.flatlistContainer}>
            <FlatList
              horizontal={true}
              style={styles.list}
              data={articles}
              keyExtractor={item => item.id}
              renderItem={itemData => {
                console.log('wola', articles)
                return (
                  <View style={styles.cardContainer}>
                    <Entypo name="circle-with-cross" size={30} color="black" style={styles.cross} onPress={props.onDelete}/>
                    <View style={styles.imgContainer}>
                      <Image
                        source={{uri: itemData.item.downloadURL}}
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.cardTitle}>{itemData.item.title}</Text>
                      <Text style={styles.price}>{itemData.item.prix} €</Text>
                    </View>

                  </View>
                )
              }
              }
            />
          </View>

          <View style={styles.choicePaiementContainer}>
            <View style={styles.choicePaiement}>
              <Text>3 jours</Text>
              <Text>1,15 €</Text>
              <RoundedCheckbox onPress={(checked1) => {
                setChecked1(!checked1)
                setChecked2(false)
                setPrice(1.15)
                setGoPaiement(!goPaiement)
              }} text="" outerBorderColor="black" uncheckedColor="white" outerSize={40} innerSize={30}/>
            </View>

            <View style={styles.choicePaiement}>
              <Text>7 jours</Text>
              <Text>1,95 €</Text>
              <RoundedCheckbox onPress={(checked2) => {
                setChecked2(!checked2)
                setChecked1(false)
                setPrice(1.95)
                setGoPaiement(!goPaiement)
              }} text="" outerBorderColor="black" uncheckedColor="white" outerSize={40} innerSize={30}/>
            </View>

            {goPaiement && (

              <TouchableOpacity style={styles.mettreEnVente} onPress={() => setMakePayment(true)}>
                <Text style={styles.mettreEnVenteText}>Payer</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )
    } else {

      if (response !== undefined) {
        console.log('paimentstatus', paymentStatus)
        console.log(response)
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
              <Text style={styles.text2}>Boost validé !</Text>
              <TouchableOpacity style={styles.retourContainer} onPress={() => {
                props.navigation.navigate('AccueilScreen')
              }}>
                <Text style={styles.text2}>Retour au menu principal</Text>
              </TouchableOpacity>
            </View> : <Text></Text>}
        </View>

      } else {
        console.log('wola')
        return (
          <PaymentView onCheckStatus={onCheckStatus} product={"Paiement unique"} amount={2}/>
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
  flatlistContainer: {
    width: '100%'
  },
  list: {
    width: '100%'
  },
  choicePaiementContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  choicePaiement: {
    borderBottomColor: '#E0ECF8',
    borderBottomWidth: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: '5%'
  },
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
    height: windowHeight/14,
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
    height: 150,
    width: 180
  },
  text2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '3%',
    color: 'white'
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
  price: {
    color: '#D51317',
    fontSize: 14
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA'
  },
  cardContainer: {
    backgroundColor: 'white',
    width: 200,
    height: 250,
    marginTop: '5%',
    borderLeftWidth: 3,
    borderLeftColor: 'black'
  },
  imgContainer: {
    alignItems: 'center',
    paddingTop: '5%',
    overflow: 'hidden'
  },
  cross: {
    marginLeft: '85%'
  },
  deleteContainer: {
    position: 'absolute',
    right: '5%',
    width: '12%',
    alignItems: 'center',
    top: '2%'
  },
  crossText: {
    fontSize: 20,
    color: '#A7A9BE'
  },
  priceContainer: {
    marginLeft: '10%'
  }
});
export default BoosteVentePaiementScreen;

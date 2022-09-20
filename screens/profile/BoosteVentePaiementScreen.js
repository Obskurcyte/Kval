import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  Button,
} from "react-native";
import RoundedCheckbox from "react-native-rounded-checkbox";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { PaymentView } from "../../components/PaymentView";
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";
import PaymentCard from "../../components/PaymentCard";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const BoosteVentePaiementScreen = (props) => {
  let articles;
  if (props.route.params && props.route.params.articles) {
    articles = props.route.params.articles;
  }
  const currentUser = props.route.params.user

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const [goPaiement, setGoPaiement] = useState(false);

  const [response, setResponse] = useState();
  const [makePayment, setMakePayment] = useState(false);
  const [price, setPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  console.log('status', paymentStatus)

  console.log('price', price.toFixed(2))
  const [dureeBoost, setDureeBoost] = useState(0);
  const [numberOfDaysToAdd, setNumberOfDayToAdd] = useState(0);

  let someDate = new Date();
  let hours = someDate.getHours();
  let minutes = someDate.getMinutes();
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  let dd = someDate.getDate();
  let mm = someDate.getMonth() + 1;
  let y = someDate.getFullYear();
  let someFormattedDate = dd + "/" + mm + "/" + y;


  const handlePay = async () => {
    console.log('1')
    try {
      for (let i = 0; i < articles.length; i++) {
        if (dureeBoost === 3) {
          await axios.put(`${BASE_URL}/api/products`, {
            id: articles[i]._id,
            boosted: true,
            boostedDuration: 3,
            boostedTime: Date.now()
          })
        } else {
          await axios.put(`${BASE_URL}/api/products`, {
            id: articles[i]._id,
            boosted: true,
            boostedDuration: 7,
            boostedTime: Date.now()
          })
        }
        console.log('2')
        await axios.post("https://kval-backend.herokuapp.com/send", {
          mail: currentUser.email,
          subject: "Confirmation de mise en avant première",
          html_output: `<div><p>Félicitations ${currentUser.pseudo}, <br></p> 
<p>Votre article vient d'être boosté pour une durée de ${dureeBoost} jours jusqu'au ${someFormattedDate} à ${hours}:${minutes}.</p>
<p>Résumé de votre article : </p>
<hr>
<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${articles[i].images[0]}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${articles[i].title}</p>
        <p style="margin: 0">Description : ${articles[i].description}</p>
        <p style="margin: 0">Catégorie : ${articles[i].category}</p>
        <p style="margin: 0">Prix net vendeur: ${articles[i].prix} €</p>
    </div>
</div>
<hr>
<p>Vous pouvez retrouver cet article dans la page d’accueil dans la catégorie : Annonces en avant première</p>
<p>A savoir : Si vous boostez de nouveau votre annonce avant la fin de la période ci-dessus mentionnée, la durée du nouveau boost partira de cette nouvelle date. S'il restait du temps sur le boost initial, il sera définitivement perdu.</p>
<br>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="" >
</div>`,
        });
      }
    } catch(err) {
      console.log(err)
    }
  };

  const paymentUI = (props) => {
    if (!makePayment) {
      return (
          <ScrollView>
            <View style={styles.flatlistContainer}>
              <FlatList
                  horizontal={true}
                  style={styles.list}
                  data={articles}
                  keyExtractor={(item) => item._id}
                  renderItem={(itemData) => {
                    return (
                        <View style={styles.cardContainer}>
                          <Entypo
                              name="circle-with-cross"
                              size={30}
                              color="black"
                              style={styles.cross}
                              onPress={props.onDelete}
                          />
                          <View style={styles.imgContainer}>
                            <Image
                                source={{ uri: itemData.item.images[0] }}
                                style={styles.image}
                            />
                          </View>
                          <View style={styles.priceContainer}>
                            <Text style={styles.cardTitle}>
                              {itemData.item.title}
                            </Text>
                            <Text style={styles.price}>{itemData.item.prix} €</Text>
                          </View>
                        </View>
                    );
                  }}
              />
            </View>

            <View style={styles.choicePaiementContainer}>
              <View style={styles.choicePaiement}>
                <Text>3 jours</Text>
                <Text>1,15 €</Text>
                <RoundedCheckbox
                    onPress={(checked1) => {
                      setChecked1(!checked1);
                      setChecked2(!checked2);
                      setPrice(1.15);
                      setDureeBoost(3);
                      setNumberOfDayToAdd(3);
                      setGoPaiement(!goPaiement);
                    }}
                    text=""
                    outerBorderColor="black"
                    uncheckedColor="white"
                    outerSize={40}
                    innerSize={30}
                />
              </View>

              <View style={styles.choicePaiement}>
                <Text>7 jours</Text>
                <Text>1,95 €</Text>
                <RoundedCheckbox
                    onPress={(checked2) => {
                      setChecked2(!checked2);
                      setChecked1(!checked1);
                      setPrice(1.95);
                      setDureeBoost(7);
                      setNumberOfDayToAdd(7);
                      setGoPaiement(!goPaiement);
                    }}
                    text=""
                    outerBorderColor="black"
                    uncheckedColor="white"
                    outerSize={40}
                    innerSize={30}
                />
              </View>

              {goPaiement && (
                  <>
                    <TouchableOpacity
                        style={styles.mettreEnVente}
                        onPress={() => setMakePayment(true)}
                    >
                      <Text style={styles.mettreEnVenteText}>Payer</Text>
                    </TouchableOpacity>
                  </>
              )}
            </View>
          </ScrollView>
      )
    } else {
      if (paymentStatus === 'Votre paiement est en cours de traitement') {
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
              <View>
                <Text>{paymentStatus}</Text>
                <ActivityIndicator />
              </View>
            </View>
        )
      }

      else if (paymentStatus === 'Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro') {
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
              <View style={styles.container2}>
                <AntDesign name="checkcircleo" size={200} color="white" />
                <Text style={styles.text2}>Boost validé !</Text>
                <TouchableOpacity
                    style={styles.retourContainer}
                    onPress={() => {
                      props.navigation.navigate("ProfileScreen")
                      props.navigation.navigate("Accueil", {
                        screen: 'AcceuilScreen'
                      })
                    }}
                >
                  <Text style={styles.text2}>Retour au menu principal</Text>
                </TouchableOpacity>
              </View>
            </View>
        )
      }
      else {
        return (
            <PaymentCard
                handlePay={handlePay}
                userData={currentUser}
                boost={true}
                amount={price.toFixed(2)}
            />
        );
      }
    }


  };

  return <View style={styles.container}>{paymentUI(props)}</View>;
};

const styles = StyleSheet.create({
  flatlistContainer: {
    width: "100%",
  },
  list: {
    width: "100%",
  },
  choicePaiementContainer: {
    display: "flex",
    flexDirection: "column",
  },
  choicePaiement: {
    borderBottomColor: "#E0ECF8",
    borderBottomWidth: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: "5%",
  },
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
    height: windowHeight / 14,
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  totalPrice: {
    color: "#D51317",
    fontSize: 18,
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
    height: 150,
    width: 180,
  },
  text2: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: "3%",
    color: "white",
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
  price: {
    color: "#D51317",
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  vendeurContainer: {
    backgroundColor: "#F9F9FA",
  },
  cardContainer: {
    backgroundColor: "white",
    width: 200,
    height: 250,
    marginTop: "5%",
    borderLeftWidth: 3,
    borderLeftColor: "black",
  },
  imgContainer: {
    alignItems: "center",
    paddingTop: "5%",
    overflow: "hidden",
  },
  cross: {
    marginLeft: "85%",
  },
  deleteContainer: {
    position: "absolute",
    right: "5%",
    width: "12%",
    alignItems: "center",
    top: "2%",
  },
  crossText: {
    fontSize: 20,
    color: "#A7A9BE",
  },
  priceContainer: {
    marginLeft: "10%",
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
  cardContainerStripe: {
    height: 50,
    backgroundColor: 'white',
    marginVertical: 30,
  },
});
export default BoosteVentePaiementScreen;

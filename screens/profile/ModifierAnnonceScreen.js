import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
import * as Notifications from "expo-notifications";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { PaymentView } from "../../components/PaymentView";
import axios from "axios";
import {BASE_URL} from "../../constants/baseURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const uploadSchema = Yup.object().shape({
  title: Yup.string().required("Veuillez rentrer un titre"),
  description: Yup.string().required("Veuillez rentrer une description"),
  price: Yup.string().required("Veuillez rentrer un prix"),
});

const ModifierAnnonceScreen = (props) => {
  const dispatch = useDispatch();

  let initialValues = {
    title: props.route.params.product.title,
    description: props.route.params.product.description,
    price: props.route.params.product.prix,
    poids: props.route.params.product.poids,
  };


  let propsProduct = props.route.params.product;
  let price = props.route.params.prix;

  const product_id = props.route.params.product._id;

  console.log('initial',initialValues)

  console.log('props', propsProduct)

  const [etat, setEtat] = useState(null);
  const [categorie, setCategorie] = useState(props.route.params.product.category)
  const [marques, setMarques] = useState(props.route.params.product.brand);
  const [titre, setTitre] = useState(props.route.params.product.title);
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState(props.route.params.product.prix);
  const [poids, setPoids] = useState("");
  const [makePayment, setMakePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [response, setResponse] = useState();
  const [goMessagePayment, setGoMessagePayment] = useState(false);

  useEffect(() => {
    setCategorie(props.route.params.product.category)
  }, [categorie]);



  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setUserData(data)
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
      getUser()
    });
    return unsubscribe
  }, [props.navigation]);

  useEffect(() => {
    if (props.route.params) {
      setEtat(props.route.params.product.status);
      setCategorie(props.route.params.product.category);
      setMarques(props.route.params.product.brand);
      setImagesTableau(props.route.params.product.images);
    }
  }, [props.route.params]);

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagesTableau, setImagesTableau] = useState([]);

  const removePicture = (index) => {
    imagesTableau.splice(index, 1);
    setImagesTableau([...imagesTableau]);
  };


  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status_camera } =
            await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.2,
    });
    setImagesTableau((oldImage) => [...oldImage, result.uri]);
    if (!result.cancelled) {
      setImage(result.uri);
    }
    console.log(imagesTableau);
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.2,
    });
    setImagesTableau((oldImage) => [...oldImage, result.uri]);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const navigateCategories = () => {
    props.navigation.navigate("CategoriesChoiceProfileScreen");
  };

  const navigateMarques = () => {
    props.navigation.navigate("MarquesChoiceProfileScreen");
  };

  const navigatePhotoScreen = (image) => {
    props.navigation.navigate("PhotoModifierAnnonceScreen", { image });
  };

  const navigateEtat = () => {
    props.navigation.navigate("EtatChoiceProfileScreen");
  };

  const [error, setError] = useState("");


  const date = new Date();

  const onCheckStatus = async (paymentResponse) => {
    setPaymentStatus("Votre paiement est en cours de traitement");
    setResponse(paymentResponse);

    let jsonResponse = JSON.parse(paymentResponse);

    try {
      const stripeResponse = await axios.post(
          "https://kval-backend.herokuapp.com/paymentonetime",
          {
            email: "hadrien.jaubert@gmail.com",
            authToken: jsonResponse,
            amount: 999,
          }
      );

      if (stripeResponse) {
        const { paid } = stripeResponse.data;
        if (paid === true) {
          let pushToken;
          let statusObj = await Notifications.getPermissionsAsync();
          if (statusObj.status !== "granted") {
            statusObj = await Notifications.requestPermissionsAsync();
          }
          if (statusObj.status !== "granted") {
            pushToken = null;
          } else {
            pushToken = (await Notifications.getExpoPushTokenAsync()).data;
          }

          const old_id = product_id;
          const id = Math.random() * 300000000;
          if (imagesTableau.length === 0) {
            setError("Veuillez uploader des photos");
          } else {
            console.log("1");
            try {
              await axios.delete(`${BASE_URL}/api/products/${old_id}`)
              const { data } = await axios.post(`${BASE_URL}/api/products`, {
                category: categorie,
                status: etat,
                brand: marques,
                title: titre,
                description: description,
                prix: price,
                poids: poids,
                pushToken,
                emailVendeur: userData.email,
                idVendeur: userData._id,
                pseudoVendeur: userData.pseudo,
              })
              const uploadImage = async (index) => {
                return new Promise(async (resolve) => {
                  const uri = imagesTableau[index];
                  const response = await fetch(uri);
                  const blob = await response.blob();

                  const task = firebase
                      .storage()
                      .ref()
                      .child(`${categorie}/${Math.random().toString(36)}`)
                      .put(blob);

                  const taskProgress = (snapshot) => {
                    console.log(`transferred: ${snapshot.bytesTransferred}`);
                  };

                  const taskCompleted = (snapshot) => {
                    task.snapshot.ref.getDownloadURL().then(async(snapshot) => {
                      const response = await axios.put(`${BASE_URL}/api/products`, {
                        id: data.product._id,
                        image: snapshot
                      })
                      resolve();
                    });
                  };

                  const taskError = (snapshot) => {
                    console.log(snapshot);
                  };

                  task.on(
                      "state_changed",
                      taskProgress,
                      taskError,
                      taskCompleted
                  );
                });
              };

              console.log("6");
              await Promise.all(
                  imagesTableau.map(async (image, index) => {
                    console.log("test");
                    await uploadImage(index);
                  })
              );
            } catch (err) {
              console.log(err);
            }


            setPaymentStatus(
                "Votre paiement a été validé ! Les utilisateurs vont pouvoir désormais voir votre numéro"
            );
          }
        } else {
          setPaymentStatus("Le paiement a échoué");
        }
      } else {
        setPaymentStatus("Le paiement a échoué");
      }
    } catch (error) {
      setPaymentStatus("Le paiement a échoué");
    }
  };

  const paymentUI = (props) => {
    if (!makePayment && !goMessagePayment) {
      return (
          <View style={styles.container}>
            <ScrollView style={styles.container}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {isLoading ? (
                    <View style={styles.containerLoading}>
                      <Text style={styles.loadingText}>
                        Cette opération peut prendre plusieurs minutes en fonction
                        de la taille de vos photos, merci de ne pas interrompre la
                        mise à jour de votre annonce…
                      </Text>
                      <ActivityIndicator />
                    </View>
                ) : (
                    <View>
                      <Text style={styles.text}>
                        Vous êtes entrain de modifier votre article :{" "}
                        {initialValues.title}
                      </Text>
                      <Formik
                          initialValues={initialValues}
                          validationSchema={uploadSchema}
                          onSubmit={async (values) => {
                            console.log('price', values.price)
                            console.log("price", prix)
                            let data = {};
                            if (imagesTableau.length === 0) {
                              setError("Veuillez uploader des photos");
                            }
                            if (categorie !== propsProduct.category) {
                              setCategorie(categorie)
                            } else {
                              setCategorie(propsProduct.category)
                            }
                            if (etat !== propsProduct.status) {
                              setEtat(etat)
                            } else {
                              setEtat(propsProduct.status)
                            }
                            if (marques !== propsProduct.brand) {
                              setMarques(marques)
                            } else {
                              setMarques(propsProduct.brand)
                            }
                            if (prix !== values.price) {
                              setGoMessagePayment(true);
                              setTitre(values.title);
                              setDescription(values.description);
                              setPrix(values.price);
                              setPoids(values.poids);
                            } else {
                              setIsLoading(true);

                              let pushToken;
                              let statusObj =
                                  await Notifications.getPermissionsAsync();
                              if (statusObj.status !== "granted") {
                                statusObj =
                                    await Notifications.requestPermissionsAsync();
                              }
                              if (statusObj.status !== "granted") {
                                pushToken = null;
                              } else {
                                pushToken = (
                                    await Notifications.getExpoPushTokenAsync()
                                ).data;
                              }


                              console.log(marques, categorie, etat)
                              const old_id = product_id;

                              console.log('1')
                              console.log(old_id)

                              try {
                                console.log('1;1')
                                await axios.delete(`${BASE_URL}/api/products/${old_id}`)
                              } catch (err) {
                                console.log(err);
                              }

                              console.log('2')

                              const { data } = await axios.post(`${BASE_URL}/api/products`, {
                                category: categorie,
                                status: etat,
                                brand: marques,
                                title: values.title,
                                description: values.description,
                                prix: values.price,
                                poids: values.poids,
                                emailVendeur: userData.email,
                                idVendeur: userData._id,
                                pseudoVendeur: userData.pseudo
                              });

                              const uploadImage = async (index) => {
                                return new Promise(async (resolve) => {
                                  const uri = imagesTableau[index];
                                  const response = await fetch(uri);
                                  const blob = await response.blob();

                                  const task = firebase
                                      .storage()
                                      .ref()
                                      .child(
                                          `${categorie}/${Math.random().toString(36)}`
                                      )
                                      .put(blob);

                                  const taskProgress = (snapshot) => {
                                    console.log(
                                        `transferred: ${snapshot.bytesTransferred}`
                                    );
                                  };

                                  const taskCompleted = (snapshot) => {
                                    task.snapshot.ref
                                        .getDownloadURL()
                                        .then(async (snapshot) => {
                                          const response = await axios.put(`${BASE_URL}/api/products`, {
                                            id: data.product._id,
                                            image: snapshot
                                          })
                                          await axios.post(
                                              "https://kval-backend.herokuapp.com/send",
                                              {
                                                mail: userData.email,
                                                subject: "Confirmation de modification ",
                                                html_output: `<div><p>Félicitations ${userData.pseudo}, <br></p> 
<p>Nous vous confirmons la modification de votre article comme suit :</p>
<hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${snapshot}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">${values.title}</p>
            <p style="margin: 0">${values.description}</p>
            <p style="margin: 0">Prix net vendeur: ${values.price} €</p>
            <p style="margin: 0">Poids : ${values.poids} kgs</p>
            <p style="margin: 0">Catégorie: ${categorie}</p>
        </div>
    </div>
<hr>
<p style="margin: 0">Vous pouvez retrouver cet article dans votre profil dans la rubrique « Mes articles en vente »</p>
<p style="margin: 0">où vous pourrez également booster cet article pour le rendre encore plus visible et le placer dans la catégorie </p>
<p style="margin: 0">« Annonces en avant première » du menu d’accueil de l’application.
</p>
<br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                                              }
                                          );
                                          resolve();
                                        });
                                  };

                                  const taskError = (snapshot) => {
                                    console.log(snapshot);
                                  };

                                  task.on(
                                      "state_changed",
                                      taskProgress,
                                      taskError,
                                      taskCompleted
                                  );
                                });
                              };

                              console.log("6");

                              await Promise.all(
                                  imagesTableau.map(async (image, index) => {
                                    console.log("test");
                                    await uploadImage(index);
                                  })
                              );
                              setIsLoading(false);
                              setImagesTableau([]);
                              setImage(null);


                              props.navigation.navigate(
                                  "ValidationAnnonceModifieeScreen"
                              );
                            }
                          }}
                      >
                        {(props) => (
                            <View style={styles.formContainer}>
                              <View style={styles.itemForm}>
                                <Text style={styles.text}>Titre</Text>
                                <TextInput
                                    value={props.values.title}
                                    style={styles.input}
                                    placeholder="Ex: Selle Randol's"
                                    onChangeText={props.handleChange("title")}
                                />
                              </View>
                              {props.errors.title && props.touched.title ? (
                                  <Text style={{ color: "#D51317" }}>
                                    {props.errors.title}
                                  </Text>
                              ) : null}

                              <TouchableOpacity
                                  style={styles.itemForm3}
                                  onPress={() => navigateCategories()}
                              >
                                <Text style={styles.text}>Catégorie</Text>
                                {categorie ? (
                                    <Text style={{ color: "black" }}>{categorie}</Text>
                                ) : (
                                    <Text style={{ color: "black" }}>{propsProduct.category}</Text>
                                )}
                                <AntDesign name="right" size={24} color="grey" />
                              </TouchableOpacity>

                              <TouchableOpacity
                                  style={styles.itemForm3}
                                  onPress={() => navigateMarques()}
                              >
                                <Text style={styles.text}>Marques</Text>
                                {marques ? (
                                    <Text style={{ color: "black" }}>{marques}</Text>
                                ) : (
                                    <Text style={{ color: "black" }}>{propsProduct.brand}</Text>
                                )}
                                <AntDesign name="right" size={24} color="grey" />
                              </TouchableOpacity>

                              <TouchableOpacity
                                  style={styles.itemForm3}
                                  onPress={() => {
                                    navigateEtat();
                                  }}
                              >
                                <Text>Etat</Text>
                                {etat ? (
                                    <Text style={{ color: "black" }}>{etat}</Text>
                                ) : (
                                    <Text style={{ color: "black" }}>{propsProduct.status}</Text>
                                )}
                                <AntDesign name="right" size={24} color="grey" />
                              </TouchableOpacity>
                              <View style={styles.itemForm2}>
                                <Text>Description</Text>
                                <TextInput
                                    style={styles.input2}
                                    multiline
                                    placeholder="Ex : Neuf, jamais utilisé"
                                    value={props.values.description}
                                    onChangeText={props.handleChange("description")}
                                />
                              </View>
                              {props.errors.description &&
                              props.touched.description ? (
                                  <Text style={{ color: "#D51317" }}>
                                    {props.errors.description}
                                  </Text>
                              ) : null}
                              <View style={styles.itemForm3}>
                                <Text>Prix €</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Ex: 150,00"
                                    inlineImageLeft="euro_icon"
                                    style={styles.input}
                                    value={props.values.price}
                                    onChangeText={props.handleChange("price")}
                                />
                              </View>
                              {props.errors.price && props.touched.price ? (
                                  <Text style={{ color: "#D51317" }}>
                                    {props.errors.price}
                                  </Text>
                              ) : null}
                              <View style={styles.itemForm3}>
                                <Text>Poids kg</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Ex: 30kg"
                                    style={styles.input}
                                    value={props.values.poids}
                                    onChangeText={props.handleChange("poids")}
                                />
                              </View>

                              <ScrollView
                                  horizontal={true}
                                  style={styles.horizontalScrollList}
                              >
                                <View style={styles.photoBigContainer}>
                                  {imagesTableau &&
                                      imagesTableau.length <= 5 &&
                                      imagesTableau.map((image, index) => (
                                          <View style={styles.imageList} key={index}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigatePhotoScreen(imagesTableau[index])
                                                }
                                            >
                                              <Image
                                                  style={styles.image}
                                                  source={{ uri: imagesTableau[index] }}
                                              />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => removePicture(index)}
                                            >
                                              <AntDesign
                                                  name="close"
                                                  size={24}
                                                  color="#DADADA"
                                                  style={styles.closeIcon}
                                              />
                                            </TouchableOpacity>
                                          </View>
                                      ))}
                                </View>
                              </ScrollView>
                              {imagesTableau && imagesTableau.length < 5 ? (
                                  <View>
                                    <TouchableOpacity
                                        style={styles.photoContainer}
                                        onPress={pickImage}
                                    >
                                      <Text style={styles.addPhotoText}>
                                        Ajouter des photos depuis la librairie
                                      </Text>
                                      <Text style={styles.addPhotoText}>
                                        (jusqu'à 5)
                                      </Text>
                                      <AntDesign
                                          name="picture"
                                          size={24}
                                          color="#DADADA"
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.photoContainer}
                                        onPress={takePicture}
                                    >
                                      <Text style={styles.addPhotoText}>
                                        Prendre une photo
                                      </Text>
                                      <AntDesign
                                          name="camera"
                                          size={24}
                                          color="#DADADA"
                                      />
                                    </TouchableOpacity>
                                  </View>
                              ) : (
                                  <Text />
                              )}

                              <Text style={{ color: "#D51317" }}>{error}</Text>
                              <TouchableOpacity
                                  style={styles.mettreEnVente}
                                  onPress={props.handleSubmit}
                              >
                                <Text style={styles.mettreEnVenteText}>
                                  Enregistrer la modification
                                </Text>
                              </TouchableOpacity>
                            </View>
                        )}
                      </Formik>
                    </View>
                )}
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
      );
    }
    if (goMessagePayment) {
      return (
          <View style={styles.container}>
            <Text style={styles.intermediateMessage}>
              Vous avez changé le prix de votre annonce. Vous devez en conséquence
              payer 0.99€.
            </Text>
            <TouchableOpacity
                style={styles.mettreEnVenteIntermediate}
                onPress={() => {
                  setGoMessagePayment(false);
                  setMakePayment(true);
                }}
            >
              <Text style={styles.mettreEnVenteText}>
                Poursuivre vers le paiement
              </Text>
            </TouchableOpacity>
          </View>
      );
    } else {
      if (response !== undefined) {
        console.log("paimentstatus", paymentStatus);
        return (
            <View>
              {paymentStatus === "Votre paiement est en cours de traitement" ? (
                  <View>
                    <Text style={styles.paymentStatus}>{paymentStatus}</Text>
                    <ActivityIndicator style={styles.indicator} />
                  </View>
              ) : (
                  <Text></Text>
              )}

              {paymentStatus === "Le paiement a échoué" ? (
                  <View>
                    <Text>Le paiment a échoué</Text>
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
                    <AntDesign
                        name="checkcircleo"
                        size={200}
                        color="white"
                        style={styles.icon}
                    />
                    <Text style={styles.text3}>
                      Votre annonce a bien été modifiée
                    </Text>
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
              ) : (
                  <Text></Text>
              )}
            </View>
        );
      } else {
        return (
            <View style={styles.container}>
              <PaymentView
                  onCheckStatus={onCheckStatus}
                  product={"Paiement unique"}
                  amount={0.99}
              />
              <TouchableOpacity
                  style={styles.mettreEnVenteOptional}
                  onPress={() => {
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
  container: {
    backgroundColor: "#F8F7F8",
    flex: 1,
    margin: 5,
  },
  container2: {
    backgroundColor: "#D51317",
    height: "100%",
  },
  icon: {
    marginLeft: "22%",
    marginTop: 20,
  },
  indicator: {
    width: 30,
    marginLeft: "45%",
    marginTop: "10%",
  },
  closeIcon: {
    position: "relative",
    marginLeft: -10,
    padding: 0,
    color: "#D51317",
  },
  horizontalScrollList: {
    paddingBottom: 10,
  },
  paymentStatus: {
    fontSize: 20,
    textAlign: "center",
    maxWidth: "90%",
    marginLeft: 10,
  },
  text2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  photoBigContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagesListFirstContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagesListSecondContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
  },
  imageListBig: {
    display: "flex",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  photoContainer: {
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#DADADA",
    borderWidth: 1,
    paddingTop: "10%",
    marginTop: "4%",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.6,
    elevation: 6,
    shadowRadius: 5,
    backgroundColor: "white",
    height: windowHeight / 6,
    width: windowWidth / 1.1,
    shadowOffset: { width: 1, height: 13 },
  },
  itemForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: windowHeight / 11,
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  itemForm2: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingTop: "1%",
    height: windowHeight / 8,
  },
  text3: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: "6%",
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
    marginLeft: 10,
    marginTop: windowHeight / 9,
  },
  itemForm3: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: windowHeight / 14,
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  input2: {
    height: "80%",
    width: "90%",
  },
  input: {
    width: "80%",
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
  addPhotoText: {
    color: "black",
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
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    width: windowWidth / 1.2,
    paddingVertical: "5%",
    marginBottom: 15,
  },
  mettreEnVenteIntermediate: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    paddingVertical: "5%",
    marginBottom: 15,
  },
  resetText: {
    color: "#D51317",
    textAlign: "center",
    fontSize: 18,
  },
  reset: {
    backgroundColor: "#fff",
    marginTop: "5%",
    borderColor: "#D51317",
    width: windowWidth / 1.2,
    paddingVertical: "5%",
    marginBottom: 15,
  },
  mettreEnVenteText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  image: {
    height: 120,
    width: 120,
    resizeMode: "contain",
    margin: 5,
  },
  imageList: {
    marginTop: "3%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  intermediateMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    marginBottom: 70,
  },
});

export default ModifierAnnonceScreen;

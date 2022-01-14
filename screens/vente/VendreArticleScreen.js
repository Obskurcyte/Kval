import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { Formik, setIn } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
import * as Notifications from "expo-notifications";
import * as usersActions from "../../store/actions/users";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import PhotoArticleScreen from "./PhotoArticleScreen";
import axios from "axios";
import * as messageAction from "../../store/actions/messages";
import { set } from "react-native-reanimated";
import { get_mondial_relay_price } from "../../components/MondialRelayShippingPrices";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const uploadSchema = Yup.object().shape({
  title: Yup.string().required("Veuillez rentrer un titre"),
  description: Yup.string().required("Veuillez rentrer une description"),
  price: Yup.string().required("Veuillez rentrer un prix"),
});

const VendreArticleScreen = (props) => {
  const dispatch = useDispatch();
  const [modify, setModify] = useState(
    props.route.params ? props.route.params.modify : null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [shippinPrice, setShippingPrice] = useState("");
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatch(messageAction.fetchUnreadMessage());
    });
    return unsubscribe;
  }, [props.navigation, dispatch]);

  let initialValues = {
    title: "",
    description: "",
    price: "",
    shipping_price: "",
    poids: "",
  };

  let nonValues = {
    title: "",
    description: "",
    price: "",
    shipping_price: "",
    poids: "",
  };

  const [etat, setEtat] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [marques, setMarques] = useState(null);

  useEffect(() => {
    dispatch(usersActions.getUser());
  }, []);

  const currentUser = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (props.route.params) {
      setEtat(props.route.params.etat);
      setCategorie(props.route.params.categorie);
      setMarques(props.route.params.marque);
      setModify(props.route.params && props.route.params.modify);
      const images = [];
      props.route.params.downloadURL &&
        images.push(props.route.params.downloadURL);
      props.route.params.downloadURL1 &&
        images.push(props.route.params.downloadURL1);
      props.route.params.downloadURL2 &&
        images.push(props.route.params.downloadURL2);
      props.route.params.downloadURL3 &&
        images.push(props.route.params.downloadURL3);
      props.route.params.downloadURL4 &&
        images.push(props.route.params.downloadURL4);
      setImagesTableau(images);
    }
  }, [props.route.params]);

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagesTableau, setImagesTableau] = useState([]);

  const resetForm = () => {
    setEtat(null);
    setCategorie(null);
    setMarques(null);
    setImage(null);
    setImagesTableau([]);
    setModify(false);
    props.route.params.etat = null;
    props.route.params.categorie = null;
    props.route.params.marque = null;
  };

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
    props.navigation.navigate("CategoriesChoiceScreen");
  };

  const navigateMarques = () => {
    props.navigation.navigate("MarquesChoiceScreen");
  };

  const navigateVendre = () => {
    props.navigation.navigate("VendreArticleScreen", { modify: false });
  };

  const navigatePhotoScreen = (image) => {
    props.navigation.navigate("PhotoArticleScreen", { image });
  };

  const navigateEtat = () => {
    props.navigation.navigate("EtatChoiceScreen");
  };

  const [error, setError] = useState("");
  const [errors, setErrors] = useState(false);
  const date = new Date();
  const [imageEmail, setImageMail] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {isLoading ? (
            <View style={styles.containerLoading}>
              <Text style={styles.loadingText}>
                Cette opération peut prendre plusieurs minutes en fonction de la
                taille de vos photos, merci de ne pas interrompre la mise en
                vente…
              </Text>
              <ActivityIndicator color="red" />
            </View>
          ) : (
            <View>
              <Formik
                initialValues={initialValues}
                validationSchema={uploadSchema}
                onSubmit={async (values) => {
                  let data = {};
                  setErrors(false);
                  if (!etat || !categorie || !marques) {
                    setErrors(true);
                  }

                  if (!errors) {
                    let pushToken;
                    let statusObj = await Notifications.getPermissionsAsync();
                    if (statusObj.status !== "granted") {
                      statusObj = await Notifications.requestPermissionsAsync({
                        ios: {
                          allowAlert: true,
                          allowBadge: true,
                          allowSound: true,
                          allowAnnouncements: true,
                        },
                      });
                    }
                    if (statusObj.status !== "granted") {
                      pushToken = null;
                    } else {
                      pushToken = await Notifications.getExpoPushTokenAsync();
                    }

                    const id = Math.random() * 300000000;

                    if (imagesTableau.length === 0) {
                      setError("Veuillez uploader des photos");
                    } else {
                      try {
                        setIsLoading(true);
                        console.log("1");
                        await firebase
                          .firestore()
                          .collection("products")
                          .doc(`${id}`)
                          .set({
                            categorie,
                            etat,
                            id,
                            marques,
                            date: date,
                            title: values.title,
                            description: values.description,
                            prix: values.price.replace(',', '.'),
                            poids: values.poids.replace(',', '.'),
                            pushToken,
                            idVendeur: currentUser.id,
                            emailVendeur: currentUser.email,
                            livraison: "Choisir",
                            pseudoVendeur: currentUser.pseudo,
                          });
                        console.log("2");
                        await firebase
                          .firestore()
                          .collection("posts")
                          .doc(currentUser.id)
                          .collection("userPosts")
                          .doc(`${id}`)
                          .set({
                            pseudoVendeur: currentUser.pseudo,
                            categorie,
                            marques,
                            etat,
                            date: date,
                            idVendeur: currentUser.id,
                            emailVendeur: currentUser.email,
                            title: values.title,
                            description: values.description,
                            prix: values.price.replace(',', '.'),
                            pushToken,
                            livraison: "Choisir",
                            poids: values.poids.replace(',', '.'),
                          });

                        console.log("3");
                        await firebase
                          .firestore()
                          .collection("allProducts")
                          .doc(`${id}`)
                          .set({
                            pseudoVendeur: currentUser.pseudo,
                            categorie,
                            marques,
                            etat,
                            pushToken,
                            date: date,
                            idVendeur: currentUser.id,
                            emailVendeur: currentUser.email,
                            title: values.title,
                            description: values.description,
                            prix: values.price.replace(',', '.'),
                            livraison: "Choisir",
                            poids: values.poids.replace(',', '.'),
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
                                .then((snapshot) => {
                                  saveImageData(snapshot, index);
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

                        const saveImageData = (downloadURL, index) => {
                          const property_name =
                            index === 0 ? "downloadURL" : `downloadURL${index}`;
                          data[property_name] = downloadURL;
                          setImageMail(data.downloadURL);
                          console.log('imageEmail', imageEmail);
                          console.log('data', data);
                          firebase
                            .firestore()
                            .collection("products")
                            .doc(`${id}`)
                            .update(data);
                          firebase
                            .firestore()
                            .collection("posts")
                            .doc(currentUser.id)
                            .collection("userPosts")
                            .doc(`${id}`)
                            .update(data);
                          firebase
                            .firestore()
                            .collection("allProducts")
                            .doc(`${id}`)
                            .update(data);
                        };

                        await Promise.all(
                          imagesTableau.map(async (image, index) => {
                            console.log("test");
                            await uploadImage(index);
                          })
                        );
                      } catch (err) {
                        console.log(err);
                      }

                      setIsLoading(false);
                      setImagesTableau([]);
                      setImage(null);
                      setCategorie(null);
                      setMarques(null);
                      setEtat(null);
                      await axios.post(
                        "https://kval-backend.herokuapp.com/send",
                        {
                          mail: currentUser.email,
                          subject: "Confirmation de mise en vente",
                          html_output: `<div><p>Félicitations ${currentUser.pseudo}, <br></p> 
<p>Votre article vient d'être mis en vente.</p>
<p>Résumé de votre article : </p>
<hr>
    <div style="display: flex">
        <div style="margin-right: 30px">
            <img src="${data.downloadURL}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
        </div>
                
        <div style="margin-top: 20px">
            <p style="margin: 0">Titre : ${values.title}</p>
            <p style="margin: 0">Description : ${values.description}</p>
            <p style="margin: 0">Prix net vendeur: ${values.price} €</p>
            <p style="margin: 0">Poids : ${values.poids} kgs</p>
            <p style="margin: 0">Catégorie: ${categorie}</p>
        </div>
    </div>
<hr>
<p style="margin: 0">Vous pouvez retrouver cet article dans votre profil dans la rubrique « Mes articles en vente »</p>
<p style="margin: 0">où vous pourrez également booster cet article pour le rendre encore plus visible et le placer dans la catégorie </p>
<p style="margin: 0">« Annonces en avant première » du menu d’accueil de l’application.
</p>
<br>
    <p style="margin: 0">L'équipe KVal Occaz</p>
    <img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                        }
                      );
                      props.navigation.navigate("ValidationScreen", {
                        props: props,
                        modify: false,
                      });
                    }
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
                      <Text style={categorie ? styles.noErrors : styles.errors}>
                        Catégorie
                      </Text>
                      {categorie ? (
                        <Text style={{ color: "black" }}>{categorie}</Text>
                      ) : (
                        <Text />
                      )}
                      <AntDesign name="right" size={24} color="grey" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.itemForm3}
                      onPress={() => navigateMarques()}
                    >
                      <Text style={marques ? styles.noErrors : styles.errors}>
                        Marques
                      </Text>
                      {marques ? (
                        <Text style={{ color: "black" }}>{marques}</Text>
                      ) : (
                        <Text />
                      )}
                      <AntDesign name="right" size={24} color="grey" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.itemForm3}
                      onPress={() => {
                        navigateEtat();
                      }}
                    >
                      <Text style={etat ? styles.noErrors : styles.errors}>
                        Etat
                      </Text>
                      {etat ? (
                        <Text style={{ color: "black" }}>{etat}</Text>
                      ) : (
                        <Text />
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
                    {props.errors.description && props.touched.description ? (
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
                        onChangeText={(value) => {
                          props.handleChange("poids")(value);
                          setShippingPrice(get_mondial_relay_price(value));
                        }}
                      />
                    </View>
                    <View style={styles.itemForm3}>
                      <Text>Frais d'envoi Mondial Relay €</Text>
                      <Text style={styles.input}>{shippinPrice}</Text>
                    </View>
                    <View style={{ flex: 1, margin: 5 }}>
                      <Text>
                        Si l'acheteur choisit l'option de livraison MONDIAL
                        RELAY, il devra également payer les frais d'envoi
                        calculés à partir du poids du colis. Ce montant sera
                        retenu par Kval pour payer les frais d'éxpéditions.
                      </Text>
                      <Text>
                        Lorsque vous vous rendrez en point relais pour expédier
                        votre colis, rien ne vous sera jamais demandé.
                        Cependant, si vous indiquez un mauvais poids pour votre
                        colis nous nous octroyons le droit de retenir ce qui
                        nous aura été facturé en plus.
                      </Text>
                      <Text>
                        SOYEZ VIGILEANT EN INDIQUANT LE POIDS DE VOTRE COLIS
                      </Text>
                      <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>
                          Grille des frais MONDIAL RELAY{" "}
                        </Text>
                      </Pressable>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Image
                              style={{
                                width: "90%",
                                height: "90%",
                                resizeMode: "contain",
                              }}
                              source={{
                                uri: "https://firebasestorage.googleapis.com/v0/b/kval-c264a.appspot.com/o/documents%2Fmondial_relay_prices.png?alt=media&token=ba29b550-b8c6-4cd6-ac54-360c45d2c3c4",
                              }}
                            />
                            <Pressable
                              style={[styles.button, styles.buttonClose]}
                              onPress={() => setModalVisible(!modalVisible)}
                            >
                              <Text style={styles.textStyle}>Fermer</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    <ScrollView
                      horizontal={true}
                      style={styles.horizontalScrollList}
                    >
                      <View style={styles.photoBigContainer}>
                        {imagesTableau &&
                          imagesTableau.length <= 5 &&
                          imagesTableau.map((image, index) => (
                            <View style={styles.imageList}>
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
                          <Text style={styles.addPhotoText}>(jusqu'à 5)</Text>
                          <AntDesign name="picture" size={24} color="#DADADA" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.photoContainer}
                          onPress={takePicture}
                        >
                          <Text style={styles.addPhotoText}>
                            Prendre une photo
                          </Text>
                          <AntDesign name="camera" size={24} color="#DADADA" />
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
                        Mettre en vente !
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reset}
                      onPress={() => {
                        props.resetForm({
                          values: nonValues,
                        });
                        resetForm();
                        //  props.handleReset();
                        //navigateVendre();
                      }}
                    >
                      <Text style={styles.resetText}>
                        Réinitialiser le formulaire
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F7F8",
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
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  noErrors: {
    color: "black",
  },
  errors: {
    color: "red",
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
  addPhotoText: {
    color: "black",
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    width: windowWidth / 1.2,
    paddingVertical: "5%",
    marginBottom: 15,
  },
  resetText: {
    color: "#D51317",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#D51317",
  },
  buttonClose: {
    backgroundColor: "#D51317",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default VendreArticleScreen;

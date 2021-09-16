import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
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
  /* const [initialValues, setInitialValues] = useState({
    title: modify ? props.route.params.title : "",
    description: modify ? props.route.params.description : "",
    price: modify ? props.route.params.prix : "",
    poids: modify ? props.route.params.poids : "",
  });

  */

  let initialValues = {
    title: modify ? props.route.params.title : "",
    description: modify ? props.route.params.description : "",
    price: modify ? props.route.params.prix : "",
    poids: modify ? props.route.params.poids : "",
  };

  let nonValues = {
    title: "",
    description: "",
    price: "",
    poids: "",
  };

  console.log("modify", modify);
  console.log("initial", initialValues);
  const old_categorie = modify ? props.route.params.categorie : null;

  const product_id = modify ? props.route.params.id : null;

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
    console.log(props.route.params);
  }, [props.route.params]);

  console.log("cat", categorie);
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

    /* setInitialValues({
      title: "",
      description: "",
      price: "",
      poids: "",
    });

   */
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

  const date = new Date();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {modify && (
          <Text style={styles.text}>
            Vous êtes entrain de modifier votre article : {initialValues.title}
          </Text>
        )}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {isLoading ? (
            <View style={styles.containerLoading}>
              <Text>
                Cette opération peut prendre plusieurs minutes en fonction de la taille de vos photos, merci de ne pas interrompre la mise en vente…
              </Text>
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              <Formik
                initialValues={initialValues}
                validationSchema={uploadSchema}
                onSubmit={async (values) => {
                  console.log("values", values);
                  setIsLoading(true);

                  let pushToken;
                  let statusObj = await Notifications.getPermissionsAsync();
                  if (statusObj.status !== "granted") {
                    statusObj = await Notifications.requestPermissionsAsync();
                  }
                  if (statusObj.status !== "granted") {
                    pushToken = null;
                  } else {
                    pushToken = (await Notifications.getExpoPushTokenAsync())
                      .data;
                  }

                  const old_id = product_id;
                  const id = Math.random() * 300000000;

                  if (imagesTableau.length === 0) {
                    setError("Veuillez uploader des photos");
                  } else {
                    if (modify) {
                      try {
                        await firebase
                          .firestore()
                          .collection(`${old_categorie}`)
                          .doc(`${old_id}`)
                          .delete();

                        await firebase
                          .firestore()
                          .collection("posts")
                          .doc(firebase.auth().currentUser.uid)
                          .collection("userPosts")
                          .doc(`${old_id}`)
                          .delete();
                      } catch (err) {
                        console.log(err);
                      }
                    }
                    await firebase
                      .firestore()
                      .collection(`${categorie}`)
                      .doc(`${id}`)
                      .set({
                        categorie,
                        etat,
                        id,
                        marques,
                        date: date,
                        title: values.title,
                        description: values.description,
                        prix: values.price,
                        poids: values.poids,
                        pushToken,
                        idVendeur: firebase.auth().currentUser.uid,
                        pseudoVendeur: currentUser.pseudo,
                      });
                    await firebase
                      .firestore()
                      .collection("posts")
                      .doc(firebase.auth().currentUser.uid)
                      .collection("userPosts")
                      .doc(`${id}`)
                      .set({
                        pseudoVendeur: currentUser.pseudo,
                        categorie,
                        marques,
                        etat,
                        date: date,
                        title: values.title,
                        description: values.description,
                        prix: values.price,
                        poids: values.poids,
                      });

                    if (!modify) {
                      await firebase
                        .firestore()
                        .collection("allProducts")
                        .doc(`${id}`)
                        .set({
                          pseudoVendeur: currentUser.pseudo,
                          categorie,
                          marques,
                          etat,
                          date: date,
                          title: values.title,
                          description: values.description,
                          prix: values.price,
                          poids: values.poids,
                        });
                    }

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
                          console.log(
                            `transferred: ${snapshot.bytesTransferred}`
                          );
                        };

                        const taskCompleted = (snapshot) => {
                          task.snapshot.ref
                            .getDownloadURL()
                            .then((snapshot) => {
                              saveImageData(snapshot, index);
                              console.log("snapshot", snapshot);
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
                      const data = {};
                      data[property_name] = downloadURL;
                      firebase
                        .firestore()
                        .collection(`${categorie}`)
                        .doc(`${id}`)
                        .update(data);
                      firebase
                        .firestore()
                        .collection("posts")
                        .doc(firebase.auth().currentUser.uid)
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
                    setIsLoading(false);
                    setImagesTableau([]);
                    setImage(null);
                    props.navigation.navigate("ValidationScreen", {
                      modify: modify,
                    });
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
                        <Text />
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
                      <Text>Etat</Text>
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
                        {modify
                          ? "Enregistrer la modification"
                          : "Mettre en vente !"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reset}
                      onPress={() => {
                        console.log("hey");
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
});

export default VendreArticleScreen;

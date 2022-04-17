import React, {useContext, useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView, Modal,
} from "react-native";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as messageAction from "../../store/actions/messages";
import {BASE_URL} from "../../constants/baseURL";
import axios from 'axios';
import authContext from "../../context/authContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState(null);

  const { setSignedIn } = useContext(authContext);


  const { messageLength, setMessageLength } = useContext(authContext);

  const ctx = useContext(authContext);
  console.log('ctx', ctx);

  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setMessageLength(data.unreadMessages)
    }
    getUser()
  }, [messageLength]);

  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      console.log('userId', userId);
      const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setUserData(data)
    }
    const unsubscribe = props.navigation.addListener('focus', () => {
        getUser()
    });
    return unsubscribe
  }, [props.navigation]);


  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(messageAction.fetchUnreadMessage())
    });
    return unsubscribe
  }, [props.navigation, dispatch])

  const logout = async () => {
    await AsyncStorage.removeItem("userId");
    setSignedIn(false)
    console.log('done')
  };

  let data = {};
  const [image, setImage] = useState(null);
  const [imagesTableau, setImagesTableau] = useState("");

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

  let imageProfil;
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.2,
    });
    console.log("1")
    imageProfil = result.uri;
    console.log(imagesTableau)
    if (!result.cancelled) {
      setImage(result.uri);
    }
    setIsLoading(true);
    await uploadImage(0)
    setIsLoading(false);
    props.navigation.navigate("ValidationPhotoProfileScreen")
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.2,
    });
    console.log("result", result.uri);
    console.log("yesss");
    imageProfil = result.uri;
    console.log("image", imageProfil);
    setImagesTableau(result.uri);
    if (!result.cancelled) {
      setImage(result.uri);
    }
    console.log("wola")
    setIsLoading(true);
    console.log("imageTableau", imagesTableau)
    await uploadImage(0);
    setIsLoading(false);
    setModalVisible(false);
    props.navigation.navigate("ValidationPhotoProfileScreen")
  };

  const uploadImage = async (index) => {
    return new Promise(async (resolve) => {

      const uri = imageProfil;
      console.log('uri', uri)
      const response = await fetch(uri);
      const blob = await response.blob();

      console.log("3")
      const task = firebase
          .storage()
          .ref()
          .child(
              `profils/${Math.random().toString(36)}`
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
                await axios.put(`${BASE_URL}/api/users`, {
                  id: userData._id,
                  image: snapshot
                })
                console.log('done')
                resolve();
              });
      }

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
  // ----------------- MODAL ---------------- //
  const [modalVisible, setModalVisible] = useState(false);

  console.log('data', userData);

  if (isLoading) {
    return (
        <View style={styles.containerLoading}>
          <Text style={styles.loadingText}>
            Veuillez patientez...
          </Text>
          <ActivityIndicator color="red" />
        </View>
    );
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Modal transparent={true} visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Comment souhaitez-vous choisir votre photo ?
                </Text>
                <TouchableOpacity
                    style={styles.mettreEnVentePopup}
                    onPress={async () => {
                      await pickImage();
                      setModalVisible(false);
                    }}
                >
                  <Text style={styles.mettreEnVenteText}>
                    Depuis la galerie
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.reset}
                    onPress={async () => {
                      await takePicture();
                    }}
                >
                  <Text style={styles.resetText}>Prendre une photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.profileHeader}>
            <View style={styles.imgContainer}>
              {userData && userData.downloadURL ? (
                <View>
                  <Image
                    style={styles.image}
                    source={{ uri: userData.downloadURL }}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addPhoto}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.addPhotoText}>Ajouter une photo</Text>
                  <MaterialIcons
                    name="add-a-photo"
                    size={24}
                    color="lightgrey"
                    style={styles.iconPhoto}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View>
              <Text style={styles.nomText}>
                {userData?.firstName} {userData?.lastName}
              </Text>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.boutonList}
              onPress={() => props.navigation.navigate("MesCommandesScreen", {
                user: userData
              })}
            >
              <Text style={styles.text}>Mes commandes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boutonList}
              onPress={() => props.navigation.navigate("ArticlesEnVenteScreen", {
                user: userData
              })}
            >
              <Text style={styles.text}>Mes articles en vente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boutonList}
              onPress={() => props.navigation.navigate("InformationsScreen", {
                user: userData
              })}
            >
              <Text style={styles.text}>Mes informations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boutonList}
              onPress={() => props.navigation.navigate("PortefeuilleScreen", {
                user: userData
              })}
            >
              <Text style={styles.text}>Mon portefeuille</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.boutonList}
                onPress={() => props.navigation.navigate("CommentCaMarcheScreen")}
            >
              <Text style={styles.text}>Comment ça marche</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.boutonList}
                onPress={() => props.navigation.navigate("ContactScreen")}
            >
              <Text style={styles.text}>Nous contacter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boutonList}
              onPress={() => props.navigation.navigate("ViePriveeScreen")}
            >
              <Text style={styles.text}>Vie privée</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boutonList}>
              <Text
                style={styles.text}
                onPress={() => props.navigation.navigate("CGUScreen")}
              >
                Conditions générales d'utilisations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boutonList}
              onPress={() => props.navigation.navigate("MentionLegaleScreen")}
            >
              <Text style={styles.text}>Mentions Légales</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.boutonList}
                onPress={() =>
                    props.navigation.navigate("SignalerUnLitigeScreen")
                }
            >
              <Text style={styles.text}>Signaler un litige</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mettreEnVente}
              onPress={() => logout()}
            >
              <Text style={styles.mettreEnVenteText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profileHeader: {
    display: "flex",
    width: "100%",
    marginTop: "2%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imgContainer: {
    borderRadius: 50,
    borderColor: "grey",
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    height: 100,
    width: 100,
  },
  iconPhoto: {
    textAlign: "center",
  },
  boutonList: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: "3%",
    marginTop: "4%",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    width: windowWidth / 1.1,
    paddingVertical: "3%",
  },
  mettreEnVenteText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  addPhotoText: {
    color: "lightgrey",
    textAlign: "center",
    marginTop: "20%",
  },
  nomText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  image: {
    height: windowHeight / 8,
    width: windowWidth / 4,
    marginRight: "3%",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
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
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
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
  mettreEnVentePopup: {
    backgroundColor: "#D51317",
    marginTop: "5%",
    marginLeft: "5%",
    width: windowWidth / 1.5,
    paddingVertical: "5%",
  },
  resetText: {
    color: "#D51317",
    textAlign: "center",
    fontSize: 18,
  },
  reset: {
    backgroundColor: "#fff",
    marginTop: "5%",
    marginLeft: "5%",
    width: windowWidth / 1.1,
    borderColor: "#D51317",
    paddingVertical: "5%",
    marginBottom: 15,
  },
});
export default ProfileScreen;

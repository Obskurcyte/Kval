import React, {useEffect, useState} from 'react';
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
  TouchableOpacity, Dimensions
} from 'react-native';
import {Formik} from 'formik';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firebase from "firebase";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as usersActions from '../../store/actions/users';
import {useDispatch, useSelector} from "react-redux";
import * as Yup from 'yup';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const uploadSchema = Yup.object().shape({
  title: Yup.string()
      .required('Veuillez rentrer un titre'),
  description: Yup.string()
      .required('Veuillez rentrer une description'),
  price: Yup.string().required('Veuillez rentrer un prix'),
});

const VendreArticleScreen = (props) => {

  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    description: "",
    price: ""
  }

  let etat;
  let categorie;

  useEffect(() => {
    dispatch(usersActions.getUser())
  }, [])

  console.log(firebase.auth().currentUser)
  const currentUser = useSelector(state => state.user.userData)
  console.log(currentUser);


  if (props.route.params) {
    etat = props.route.params.etat
    categorie = props.route.params.categorie
  }

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagesTableau, setImagesTableau] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImagesTableau(oldImage => [...oldImage, result.uri])
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };



  const navigateCategories = () => {
    props.navigation.navigate('CategoriesChoiceScreen')
  }

  const navigateEtat = () => {
    props.navigation.navigate('EtatChoiceScreen')
  }

  const [error, setError] = useState('');

  console.log(currentUser)
  console.log(isLoading)
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="height"
      >
        <ScrollView>
          {isLoading ? (
            <View>
              <Text>Votre produit est en train d'être mis en vente, veuillez patientez !</Text>
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              <Formik
                initialValues={initialValues}
                validationSchema={uploadSchema}
                onSubmit={async (values) => {
                  let pushToken;
                  let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                  if (statusObj.status !== 'granted') {
                    statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS)
                  }
                  if (statusObj.status !== 'granted') {
                      pushToken = null;
                  } else {
                    pushToken = (await Notifications.getExpoPushTokenAsync()).data
                  }
                  const id = Math.random() * 300000000
                  console.log(values)

                  if (imagesTableau.length === 0) {
                    setError('Veuillez uploader des photos')
                  } else {
                    await firebase.firestore()
                        .collection(`${categorie}`)
                        .doc(`${id}`)
                        .set({
                          categorie,
                          etat,
                          id,
                          title: values.title,
                          description: values.description,
                          prix: values.price,
                          pushToken,
                          idVendeur: firebase.auth().currentUser.uid,
                          pseudoVendeur: currentUser.pseudo
                        })
                    await firebase.firestore()
                        .collection('posts')
                        .doc(firebase.auth().currentUser.uid)
                        .collection("userPosts")
                        .doc(`${id}`)
                        .set({
                          categorie,
                          etat,
                          title: values.title,
                          description: values.description,
                          prix: values.price,
                        })


                    const uploadImage = async () => {
                      setIsLoading(true)
                      const uri = imagesTableau[0];
                      const response = await fetch(uri);
                      const blob = await response.blob();

                      const task = firebase
                          .storage()
                          .ref()
                          .child(`${categorie}/${Math.random().toString(36)}`)
                          .put(blob);

                      const taskProgress = snapshot => {
                        console.log(`transferred: ${snapshot.bytesTransferred}`)
                      }

                      const taskCompleted = snapshot => {
                        if (imagesTableau && imagesTableau.length === 1) {
                          task.snapshot.ref.getDownloadURL().then((snapshot) => {
                            saveImageData(snapshot)
                            console.log('snapshot', snapshot)
                          }).then(() => setIsLoading(false)).then(() => {
                            etat = '';
                            categorie = '';
                            setImagesTableau([])
                            setImage(null)
                          }).then(() => props.navigation.navigate('ValidationScreen'))
                        } else {
                          task.snapshot.ref.getDownloadURL().then((snapshot) => {
                            saveImageData(snapshot)
                            console.log('snapshot', snapshot)
                          })}
                      }

                      const taskError = snapshot => {
                        console.log(snapshot)
                      }

                      task.on("state_changed", taskProgress, taskError, taskCompleted)
                    }

                    const uploadImage1 = async () => {
                      const uri = imagesTableau[1];
                      const response = await fetch(uri);
                      const blob = await response.blob();

                      const task = firebase
                          .storage()
                          .ref()
                          .child(`${categorie}/${Math.random().toString(36)}`)
                          .put(blob);

                      const taskProgress = snapshot => {
                        console.log(`transferred: ${snapshot.bytesTransferred}`)
                      }

                      const taskCompleted = snapshot => {
                        if (imagesTableau && imagesTableau.length === 2) {
                          task.snapshot.ref.getDownloadURL().then((snapshot) => {
                            saveImageData1(snapshot)
                            console.log('snapshot', snapshot)
                          }).then(() => setIsLoading(false)).then(() => {
                            etat = '';
                            categorie = '';
                            setImagesTableau([])
                            setImage(null)
                          }).then(() => props.navigation.navigate('ValidationScreen'))
                        } else {
                          task.snapshot.ref.getDownloadURL().then((snapshot) => {
                            saveImageData1(snapshot)
                            console.log('snapshot', snapshot)
                          })}
                      }

                      const taskError = snapshot => {
                        console.log(snapshot)
                      }

                      task.on("state_changed", taskProgress, taskError, taskCompleted)
                    }

                    const uploadImage2 = async () => {
                      const uri = imagesTableau[2];
                      const response = await fetch(uri);
                      const blob = await response.blob();

                      const task = firebase
                          .storage()
                          .ref()
                          .child(`${categorie}/${Math.random().toString(36)}`)
                          .put(blob);

                      const taskProgress = snapshot => {
                        console.log(`transferred: ${snapshot.bytesTransferred}`)
                      }
                      const taskCompleted = snapshot => {
                        task.snapshot.ref.getDownloadURL().then((snapshot) => {
                          saveImageData2(snapshot)
                          console.log(snapshot)
                        }).then(() => setIsLoading(false)).then(() => {
                          etat = '';
                          categorie = '';
                          setImagesTableau([])
                          setImage(null)
                        }).then(() => props.navigation.navigate('ValidationScreen'))
                      }
                      const taskError = snapshot => {
                        console.log(snapshot)
                      }
                      task.on("state_changed", taskProgress, taskError, taskCompleted)
                    }

                    const saveImageData = (downloadURL) => {
                      firebase.firestore()
                          .collection(`${categorie}`)
                          .doc(`${id}`)
                          .update({
                            downloadURL,
                          })
                      firebase.firestore()
                          .collection('posts')
                          .doc(firebase.auth().currentUser.uid)
                          .collection("userPosts")
                          .doc(`${id}`)
                          .update({
                            downloadURL
                          })

                    }
                    const saveImageData1 = (downloadURL1) => {
                      firebase.firestore()
                          .collection(`${categorie}`)
                          .doc(`${id}`)
                          .update({
                            downloadURL1,
                          })
                      firebase.firestore()
                          .collection('posts')
                          .doc(firebase.auth().currentUser.uid)
                          .collection("userPosts")
                          .add({
                            downloadURL1
                          })
                    }

                    const saveImageData2 = (downloadURL2) => {
                      firebase.firestore()
                          .collection(`${categorie}`)
                          .doc(`${id}`)
                          .update({
                            downloadURL2,
                          })
                      firebase.firestore()
                          .collection('posts')
                          .doc(firebase.auth().currentUser.uid)
                          .collection("userPosts")
                          .add({
                            downloadURL2
                          })
                    }
                    if (imagesTableau && imagesTableau.length === 1) {
                      await uploadImage()
                    }
                    if (imagesTableau && imagesTableau.length === 2) {
                      await uploadImage()
                      await uploadImage1()
                    }
                    if (imagesTableau && imagesTableau.length === 3) {
                      await uploadImage()
                      await uploadImage1()
                      await uploadImage2()
                    }}}
                  }


              >
                {props => (
                  <View style={styles.formContainer}>
                    <View style={styles.itemForm}>
                      <Text style={styles.text}>Titre</Text>
                      <TextInput
                        value={props.values.title}
                        style={styles.input}
                        placeholder="Ex: Selle Randol's"
                        onChangeText={props.handleChange('title')}
                      />
                    </View>
                    {props.errors.title && props.touched.title ? (
                        <Text style={{color: '#D51317'}}>{props.errors.title}</Text>
                    ) : null}
                    <TouchableOpacity style={styles.itemForm3} onPress={() => navigateCategories()}>
                      <Text style={styles.text}>Catégorie</Text>
                      {categorie ? <Text style={{color: 'black'}}>{categorie}</Text> : <Text/>}
                      <AntDesign name="right" size={24} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemForm3} onPress={() => {
                      navigateEtat()
                    }}>
                      <Text>Etat</Text>
                      {etat ? <Text style={{color: 'black'}}>{etat}</Text> : <Text/>}
                      <AntDesign name="right" size={24} color="grey" />
                    </TouchableOpacity>
                    <View style={styles.itemForm2}>
                      <Text>Description</Text>
                      <TextInput
                        style={styles.input2}
                        multiline
                        placeholder="Ex : Neuf, jamais utilisé"
                        value={props.values.description}
                        onChangeText={props.handleChange('description')}
                      />

                    </View>
                    {props.errors.description && props.touched.description ? (
                        <Text style={{color: '#D51317'}}>{props.errors.description}</Text>
                    ) : null}
                    <View style={styles.itemForm3}>
                      <Text>Prix</Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Ex: 150,00"
                        style={styles.input}
                        value={props.values.price}
                        onChangeText={props.handleChange('price')}
                      />
                    </View>
                    {props.errors.price && props.touched.price ? (
                        <Text style={{color: '#D51317'}}>{props.errors.price}</Text>
                    ) : null}
                    {(imagesTableau && imagesTableau.length === 1) ? (
                      <View style={styles.imageList}>
                        <Image
                          style={styles.image}
                          source={{uri: imagesTableau[0]}}
                        />
                      </View>
                    ): <Text />}
                    {(imagesTableau && imagesTableau.length === 2) ? (
                      <View style={styles.imageList}>
                        <Image
                          style={styles.image}
                          source={{uri: imagesTableau[0]}}
                        />
                        <Image
                          style={styles.image}
                          source={{uri: imagesTableau[1]}}
                        />
                      </View>
                    ): <Text />}
                    {(imagesTableau && imagesTableau.length === 3) ? (
                      <View style={styles.imageList}>
                        <Image
                          style={styles.image}
                          source={{uri: imagesTableau[0]}}
                        />
                        <Image
                          style={styles.image}
                          source={{uri: imagesTableau[1]}}
                        />
                        <Image
                          style={styles.image}
                          source={{uri: imagesTableau[2]}}
                        />
                      </View>
                    ): <Text />}
                    {(imagesTableau && imagesTableau.length < 3) ? (
                      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                        <Text style={styles.addPhotoText}>Ajouter des photos</Text>
                        <Text style={styles.addPhotoText}>(jusqu'à 3)</Text>
                        <AntDesign name="pluscircleo" size={24} color="#DADADA" />
                      </TouchableOpacity>
                    ): <Text/>}

                    <Text style={{color: '#D51317'}}>{error}</Text>
                    <TouchableOpacity style={styles.mettreEnVente} onPress={props.handleSubmit}>
                      <Text style={styles.mettreEnVenteText}>Mettre en vente !</Text>
                    </TouchableOpacity>

                    <View style={{height: 150}}>

                    </View>
                  </View>
                )}
              </Formik>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F7F8',
    flex: 1,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center'
  },
  photoContainer: {
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#DADADA',
    borderWidth: 1,
    paddingTop: '10%',
    marginTop: '4%',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.6,
    elevation: 6,
    shadowRadius: 5,
    backgroundColor: 'white',
    height: windowHeight/6,
    width: windowWidth/1.1,
    shadowOffset : { width: 1, height: 13},
  },
  itemForm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    height: windowHeight/11,
    alignItems: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  itemForm2: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingTop: '1%',
    height: windowHeight/8,
  },
  itemForm3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    height: windowHeight/14,
    alignItems: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  input2: {
    height: '80%',
    width: '90%',
  },
  input: {
    width: '80%'
  },
  addPhotoText: {
    color: '#DADADA'
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: '5%',
    width: windowWidth/1.1,
    paddingVertical: '5%'
  },
  mettreEnVenteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  image : {
    height: windowHeight/8,
    width: windowWidth/4,
    marginRight: "3%",
  },
  imageList: {
    marginTop: '3%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default VendreArticleScreen;

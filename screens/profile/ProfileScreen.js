import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator, ScrollView} from 'react-native';
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from '@expo/vector-icons';
import {useDispatch, useSelector} from "react-redux";
import * as userActions from '../../store/actions/users';
import pick from "react-native-web/dist/modules/pick";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProfileScreen = (props) => {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(userActions.getUser())
  }, [dispatch, isLoading]);



  const userData = useSelector(state => state.user.userData);

  console.log(userData);

  const logout = () => {
    firebase.auth().signOut()
  }

  const [image, setImage] = useState(null);
  const [imagesTableau, setImagesTableau] = useState('');


  let imageTrue = ''
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
    imageTrue = result.uri
    if (!result.cancelled) {
      setImage(result.uri);
      await uploadImage()
    }
  };

  const uploadImage = async () => {
   // setIsLoading(true)

    const uri = imageTrue;
    console.log('uri', uri)
    const response = await fetch(uri);
    const blob = await response.blob();

    const task = await firebase
      .storage()
      .ref()
      .child(`users/${Math.random().toString(36)}`)
      .put(blob);

    console.log('task', task)
   /* const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = snapshot => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        saveImageData(snapshot)
        console.log(snapshot)
      })
    }

    const taskError = snapshot => {
      console.log(snapshot)
    }
    task.on("state_changed", taskProgress, taskError, taskCompleted)

    */
  }




  const saveImageData = async (downloadURL) => {
    await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        downloadURL,
      })
    setIsLoading(false)
  }
  if (isLoading) {
    return (
      <View>
        <Text>Votre photo se charge, veuillez patientez</Text>
        <ActivityIndicator size={40} color={'red'}/>
      </View>
    )
  } else {
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.imgContainer}>
            {(userData && userData.downloadURL) ? (
              <View>
                <Image
                  style={styles.image}
                  source={{uri: userData.downloadURL}}
                />
              </View>
            ) :  <TouchableOpacity style={styles.addPhoto} onPress={() => pickImage()}>
              <Text style={styles.addPhotoText}>Ajouter une photo</Text>
              <MaterialIcons name="add-a-photo" size={24} color="lightgrey" style={styles.iconPhoto}/>
            </TouchableOpacity> }

          </View>
          <View>
            <Text style={styles.nomText}>Thomas Goomba</Text>
          </View>
        </View>


        <View>
          <TouchableOpacity style={styles.boutonList}>
            <Text style={styles.text}>Mes commandes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList}>
            <Text style={styles.text}>Mes négociations en cours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList} onPress={() => props.navigation.navigate('ArticlesEnVenteScreen')}>
            <Text style={styles.text}>Mes articles en vente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList} onPress={() => props.navigation.navigate('InformationsScreen')}>
            <Text style={styles.text}>Mes informations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList} onPress={() => props.navigation.navigate('PortefeuilleScreen')}>
            <Text style={styles.text}>Mon portefeuille</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList}>
            <Text style={styles.text}>Vie privée</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList}>
            <Text style={styles.text}>Conditions générales d'utilisations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList} onPress={() => props.navigation.navigate('SignalerUnLitigeScreen')}>
            <Text style={styles.text}>Signaler un litige</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boutonList}>
            <Text style={styles.text}>Mentions Légales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mettreEnVente} onPress={() => logout()}>
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
    alignItems: 'center'
  },
  profileHeader: {
    display: 'flex',
    width: '100%',
    marginTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imgContainer: {
    borderRadius: 50,
    borderColor: 'grey',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    height: windowHeight/9,
    width: windowWidth/4,
  },
  iconPhoto: {
    textAlign: 'center'
  },
  boutonList: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: '3%',
    marginTop: '4%'
  },
  text: {
    fontSize: 18,
    textAlign: 'center'
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: '5%',
    width: windowWidth/1.1,
    paddingVertical: '3%'
  },
  mettreEnVenteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  addPhotoText: {
    color: 'lightgrey',
    textAlign: 'center',
    marginTop: '20%'
  },
  nomText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  image : {
    height: windowHeight/8,
    width: windowWidth/4,
    marginRight: "3%",
  },
})
export default ProfileScreen;

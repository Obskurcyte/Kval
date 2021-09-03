import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as userActions from "../../store/actions/users";
import {useDispatch, useSelector} from "react-redux";
import firebase from "firebase";

const InformationsScreen = (props) => {

  const dispatch = useDispatch();

  const userData = useSelector(state => state.user.userData);

  useEffect(() => {
  dispatch(userActions.getUser())
}, [dispatch, userData]);

  const logout = () => {
    firebase.auth().signOut();
  };
  console.log(userData)

  return (
    <View style={styles.container}>
      {userData ?
          <View>
            <View style={styles.infosContainer}>

              <View>

              </View>
              <View>
                <Text style={styles.title}>Nom d'utilisateur</Text>
                <Text style={styles.infosText}>{userData.pseudo}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => props.navigation.navigate('ModifierPseudoScreen')}>
                  <Text style={styles.modify}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infosContainer}>
              <View>
                <Text style={styles.title}>Email</Text>
                <Text style={styles.infosText}>{userData.email}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => props.navigation.navigate('ModifierEmailScreen')}>
                  <Text style={styles.modify}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infosContainer}>
              <View>
                <Text style={styles.title}>Adresse</Text>
                <Text style={styles.infosText}>{userData.adresse ? userData.adresse: 'Non renseigné'}</Text>
                <Text style={styles.infosText}>{userData.postalCode ? userData.postalCode: ''}</Text>
                <Text style={styles.infosText}>{userData.ville ? userData.ville: ''}</Text>
                <Text style={styles.infosText}>{userData.pays ? userData.pays: ''}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => props.navigation.navigate('ModifierAdresseScreen')}>
                  <Text style={styles.modify}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>: <View>
            <Text style={styles.noData}>Aucune donnée disponible</Text>
            <TouchableOpacity  style={styles.mettreEnVente} onPress={() => logout()}>
              <Text style={styles.mettreEnVenteText}>Veuillez vous reconnecter</Text>
            </TouchableOpacity>
          </View>}


    </View>
  );
};

const styles = StyleSheet.create({
  infosContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '10%'
  },
  container: {
    paddingHorizontal: '10%',
    paddingVertical: '3%'
  },
  infosText: {
    color: '#D51317',
    fontSize: 16
  },
  title: {
    fontSize: 18
  },
  modify: {
    color: '#A7A9BE',
    fontSize: 12
  }
});

export default InformationsScreen;

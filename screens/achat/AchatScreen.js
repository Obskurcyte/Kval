import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Fontisto } from '@expo/vector-icons';
import CardVente from "../../components/CardVente";
import { Feather } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AchatScreen = (props) => {

  const [search, setSearch] = useState('');


  const updateSearch = (search) => {
    setSearch(search)
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>

        <Text style={styles.attendent}>Catégories</Text>

          <TouchableOpacity style={styles.itemForm3} onPress={() => props.navigation.navigate('ChevalEtCuirAccueilScreen')}>
            <Text style={styles.text}>Cheval & Cuir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemForm3}>
            <Text style={styles.text}>Cheval & Textile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemForm3}>
            <Text style={styles.text}>Cavaliers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemForm3}>
            <Text style={styles.text}>Soins & Ecuries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemForm3}>
            <Text style={styles.text}>Transport</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemForm3}>
            <Text style={styles.text}>Marques</Text>
          </TouchableOpacity>
        </View>

    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '15%',
    paddingLeft: '5%'
  },
  searchBarContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  searchBar: {
    width: '80%',
    borderRadius: 80
  },
  icon: {
    width: '10%',
    marginLeft: '5%',
    marginTop: '5%'
  },
  searchBarInner: {
    borderRadius: 80
  },
  attendent: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '5%'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    color: '#B5B5BE',
    fontSize: 12
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA'
  },
  cardContainer: {
    backgroundColor: 'white',
    width: '40%',
    marginTop: '5%'
  },
  categoriesContainer: {
    backgroundColor: '#D51317'
  },
  itemForm3 : {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: "6%"
  },
  text: {
    fontSize: 16
  }
})
export default AchatScreen;


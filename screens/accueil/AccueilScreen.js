import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import {Feather, Fontisto} from '@expo/vector-icons';
import CardVente from "../../components/CardVente";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {useDispatch, useSelector} from "react-redux";
import * as productActions from '../../store/actions/products';
import firebase from "firebase";
import {GET_PRODUCTS_BOOSTED} from "../../store/actions/products";
import BoostedProductCard from "../../components/BoostedProductCard";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { FontAwesome5 } from '@expo/vector-icons';

const AccueilScreen = (props) => {

  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search)
  };

  const [productsBoosted, setProductsBoosted] = useState([])


  useEffect(() => {
    firebase.firestore().collection("BoostedVentes")
      .get()
      .then(snapshot => {
        let productsBoosted = snapshot.docs.map(doc => {
          const data = doc.data()
          const id = doc.id;
          return {id, ...data}
        })
        setProductsBoosted(productsBoosted)
      })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <View style={styles.container}>
      <Text style={styles.attendent}>Ils vous attendent</Text>

      <FlatList
        data={productsBoosted}
        horizontal={true}
        renderItem={itemData => {
          return (
            <BoostedProductCard
              title={itemData.item.title}
              prix={itemData.item.prix}
              image={itemData.item.image}
              pseudo={itemData.item.pseudoVendeur}
              onPress={() => props.navigation.navigate('Shop', {screen: 'ProductDetailScreen', params: {
                  productId: itemData.item.id,
                  product: productsBoosted[itemData.index]
                }
              })
              }
            />
          )
        }}

      />
      <Text style={styles.attendent}>Rechercher dans les catégories</Text>
        <View style={styles.categoriesSuperContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            style={styles.scrollView}
          >
            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer2} onPress={() => props.navigation.navigate('Shop', {screen: 'AchatScreen'})}>
                <Feather name="list" size={34} color="white" />
              </TouchableOpacity>
              <Text>Catégories</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Shop', {screen: 'ChevalEtCuirAccueilScreen'})}>
                <Image source={require('../../assets/cat1.png')}/>
              </TouchableOpacity>
              <Text>Cheval & Cuir</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Shop', {screen: 'ChevalEtTextileAccueilScreen'})}>
                <Image source={require('../../assets/textile.png')}/>
              </TouchableOpacity>
              <Text>Cheval & Textile</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Shop', {screen: 'CavalierAccueilScreen'})}>
                <Image source={require('../../assets/cavalier.png')}/>
              </TouchableOpacity>
              <Text>Cavalier</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Shop', {screen: 'SoinsEtEcuriesAccueilScreen'})}>
                <FontAwesome5 name="briefcase-medical" size={34} color="white" />
              </TouchableOpacity>
              <Text>Soins et écuries</Text>
            </View>


            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Shop', {screen: 'ChienAccueilScreen'})}>
                <MaterialCommunityIcons name="dog" size={34} color="white" />
              </TouchableOpacity>
              <Text>Chiens/Animaux</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Shop', {screen: 'TransportAccueilScreen'})}>
                <FontAwesome5 name="shuttle-van" size={34} color="white" />
              </TouchableOpacity>
              <Text>Transport</Text>
            </View>

          </ScrollView>
        </View>



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
  scrollView: {
    paddingBottom: 10
  },
  attendent: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '5%'
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA'
  },
  categoriesSuperContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '6%'
  },
  categoriesContainer: {
    backgroundColor: '#D51317',
    borderRadius: 70,
    paddingTop: '15%',
    width: 70,
    height: 70,
    alignItems: 'center'
  },
  categoriesContainer2: {
    backgroundColor: '#D51317',
    paddingTop: '15%',
    borderRadius: 70,
    width: 70,
    height: 70,
    alignItems: 'center'
  },
  categoriesInnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: windowWidth/3.5
  }

})
export default AccueilScreen;

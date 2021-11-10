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
  FlatList,
  RefreshControl
} from 'react-native';
import {Feather, Fontisto} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from "firebase";
import BoostedProductCard from "../../components/BoostedProductCard";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { FontAwesome5 } from '@expo/vector-icons';
import * as userActions from "../../store/actions/users";
import {useDispatch, useSelector} from "react-redux";
import * as messageAction from "../../store/actions/messages";


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const AccueilScreen = (props) => {

  const dispatch = useDispatch();


  const message = useSelector(state => state.messages.unreadMessages)

  console.log('message', message)
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const updateSearch = (search) => {
    setSearch(search)
  };

  const [productsBoosted, setProductsBoosted] = useState([])
  const [productsUne, setProductsUne] = useState([])
  const currentUser = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(messageAction.fetchUnreadMessage())
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
    });
    return unsubscribe
  }, [props.navigation, dispatch])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      firebase.firestore().collection("allProducts")
          .orderBy('date', "desc")
          .get()
          .then(snapshot => {
            let productsBoosted = snapshot.docs.map(doc => {
              const data = doc.data()
              const id = doc.id;
              return {id, ...data}
            })
            setProductsUne(productsBoosted)
          })
    });
   return unsubscribe
  }, [props.navigation])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
        }
        >

    <View style={styles.container}>
      <Text style={styles.attendent}>Annonces en avant première </Text>

      <FlatList
        data={productsBoosted}
        horizontal={true}
        style={styles.flatList}
        renderItem={itemData => {
          return (
            <BoostedProductCard
              title={itemData.item.title}
              prix={itemData.item.prix}
              image={itemData.item.image}
              pseudo={itemData.item.pseudoVendeur}
              onPress={() => props.navigation.navigate('Acheter', {screen: 'ProductDetailScreen', params: {
                  productId: itemData.item.id,
                  product: productsBoosted[itemData.index]
                }
              })
              }
            />
          )
        }}

      />

      <Text style={styles.attendent}>Annonces récentes</Text>

      <FlatList
          data={productsUne}
          horizontal={true}
          renderItem={itemData => {
            return (
                <BoostedProductCard
                    title={itemData.item.title}
                    prix={itemData.item.prix}
                    image={itemData.item.downloadURL}
                    pseudo={itemData.item.pseudoVendeur}
                    onPress={() => props.navigation.navigate('Acheter', {screen: 'ProductDetailScreen', params: {
                        productId: itemData.item.id,
                        product: productsUne[itemData.index]
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
              <TouchableOpacity style={styles.categoriesContainer2} onPress={() => props.navigation.navigate('Acheter', {screen: 'AchatScreen'})}>
                <Feather name="list" size={34} color="white" />
              </TouchableOpacity>
              <Text>Toutes les catégories</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Acheter', {screen: 'ChevalEtCuirAccueilScreen'})}>
                <Image source={require('../../assets/cat1.png')}/>
              </TouchableOpacity>
              <Text>Cheval & Cuir</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Acheter', {screen: 'ChevalEtTextileAccueilScreen'})}>
                <Image source={require('../../assets/textile.png')}/>
              </TouchableOpacity>
              <Text>Cheval & Textile</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Acheter', {screen: 'CavalierAccueilScreen'})}>
                <Image source={require('../../assets/cavalier.png')}/>
              </TouchableOpacity>
              <Text>Cavalier</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Acheter', {screen: 'SoinsEtEcuriesAccueilScreen'})}>
                <FontAwesome5 name="briefcase-medical" size={34} color="white" />
              </TouchableOpacity>
              <Text>Soins et écuries</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Acheter', {screen: 'ChienAccueilScreen'})}>
                <MaterialCommunityIcons name="dog" size={34} color="white" />
              </TouchableOpacity>
              <Text>Chiens/Animaux</Text>
            </View>

            <View style={styles.categoriesInnerContainer}>
              <TouchableOpacity style={styles.categoriesContainer} onPress={() => props.navigation.navigate('Acheter', {screen: 'TransportAccueilScreen'})}>
                <FontAwesome5 name="shuttle-van" size={34} color="white" />
              </TouchableOpacity>
              <Text>Transport</Text>
            </View>

          </ScrollView>
        </View>



 </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '1%',
    paddingLeft: '5%'
  },
  searchBarContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  flatList: {
    marginBottom: 10
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
    marginTop: '0%'
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA'
  },
  categoriesSuperContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '6%',
    marginBottom: '5%'
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

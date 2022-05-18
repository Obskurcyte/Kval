import React, {useContext, useEffect, useState} from 'react';
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
import BoostedProductCard from "../../components/BoostedProductCard";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { FontAwesome5 } from '@expo/vector-icons';
import {useDispatch, useSelector} from "react-redux";
import * as Notifications from "expo-notifications";
import {BASE_URL} from "../../constants/baseURL";
import axios from 'axios';
import CardVente from "../../components/CardVente";
import {Searchbar} from "react-native-paper";
import authContext from "../../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const AccueilScreen = (props) => {


  const { messageLength, setMessageLength } = useContext(authContext);

  const ctx = useContext(authContext);


  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setMessageLength(data.unreadMessages)
    }
    getUser()
  }, [messageLength]);

  const dispatch = useDispatch();

  let totalQuantity = 0;
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems;
  });

  for (let data in cartItems) {
    totalQuantity += parseFloat(cartItems[data].quantity);
  }

  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const updateSearch = (search) => {
    setSearch(search)
  };

  const [productsBoosted, setProductsBoosted] = useState([]);
  const [productsUne, setProductsUne] = useState([])
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      setFocus(false)
      const { data } = await axios.get(`${BASE_URL}/api/products`);
      setProductsUne(data);
      setProductsFiltered(data.sort(function(a,b){
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }));
      setProductsBoosted(data.filter(product => product.boosted === true).sort(function(a,b){
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }));
      await Notifications.setBadgeCountAsync(0)
    });
    return unsubscribe
  }, [props.navigation, dispatch]);

  const searchProduct = (text) => {
    setProductsFiltered(
        productsUne.filter((i) => i.title.toLowerCase().includes(text.toLowerCase()))
    )
  }

  const openList = () => {
    setFocus(true)
  }

  const onBlur = () => {
    setFocus(false)
  }



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>

      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => props.onPress} style={styles.searchBar}>
          <Searchbar
              placeholder="Rechercher"
              onFocus={openList}
              onBlur={onBlur}
              onChangeText={(text) => searchProduct(text)}
              style={styles.grey}
          />
        </TouchableOpacity>
        <View>
          <View
              style={{
                backgroundColor: "#D51317",
                borderRadius: 30,
                alignItems: "center",
                position: "absolute",
                width: 20,
                bottom: "65%",
                right: "55%",
              }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {totalQuantity}
            </Text>
          </View>
          <Fontisto
              name="shopping-basket"
              size={24}
              color="#D51317"
              onPress={() =>
                  props.navigation.navigate("Acheter", {
                    screen: "FirstCartScreen",
                  })
              }
          />
        </View>
      </View>

      {focus === true ? <>
            {productsFiltered.length > 0 ?
                <>
                  <TouchableOpacity
                      style={styles.mettreEnVente}
                      onPress={() => setFocus(false)}
                  >
                    <Text style={styles.mettreEnVenteText}>
                      Annuler la recherche
                    </Text>
                  </TouchableOpacity>
                  <FlatList
                      data={productsFiltered}
                      style={styles.searchFlatList}
                      keyExtractor={(item) => item.title}
                      renderItem={(itemData) => {
                        return (
                            <CardVente
                                pseudo={itemData.item.pseudoVendeur}
                                title={itemData.item.title}
                                price={itemData.item.prix}
                                imageURI={itemData.item.images[0]}
                                onPress={() => {
                                  props.navigation.navigate("ProductDetailScreen", {
                                    productId: itemData.item.id,
                                    product: productsFiltered[itemData.index],
                                  });
                                }}
                            />
                        );
                      }}
                  />
                </>
             : <Text>Aucun produit ne correspond a votre recherche</Text>}
          </> :

            <ScrollView

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
        }
        >

        <View style={styles.container}>
          <Text style={styles.attendent}>Annonces en avant première</Text>

              <FlatList
                  data={productsBoosted}
                  horizontal={true}
                  style={styles.flatList}
                  renderItem={itemData => {
                    return (
                        <BoostedProductCard
                            title={itemData.item.title}
                            prix={itemData.item.prix}
                            image={itemData.item.images[0]}
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
                            image={itemData.item.images[0]}
                            pseudo={itemData.item.pseudoVendeur}
                            onPress={() => props.navigation.navigate('Acheter', {screen: 'ProductDetailScreen', params: {
                                productId: itemData.item._id,
                                brand: itemData.item.brand,
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
      </ScrollView>}

      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '1%',
    paddingLeft: '5%'
  },
  flatList: {
    marginBottom: 10
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: "1%",
    width: windowWidth / 1.2,
    paddingVertical: "2%",
    marginBottom: 15,
    alignSelf: 'center'
  },
  mettreEnVenteText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
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
  },
  searchFlatList: {
    flex: 1,
    paddingBottom: 100,
    padding: 0,
  },
  searchBarContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: "4%",
    paddingLeft: '3%',
    backgroundColor: 'white',
    paddingTop: windowHeight/20,
    alignItems: "center",
  },
  searchBar: {
    width: "85%",
    height: 30,
    borderRadius: 80,
    shadowColor: "white",
    backgroundColor: "lightgrey",
  },
  grey: {
    backgroundColor: "lightgrey",
    borderRadius: 80,
    height: "99%"
  }
})
export default AccueilScreen;

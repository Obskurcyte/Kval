import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity, Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import firebase from "firebase";
import * as productsActions from "../../store/actions/products";
import CardVente from "../../components/CardVente";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { useIsFocused } from "@react-navigation/native";
import {BASE_URL} from "../../constants/baseURL";
import axios from 'axios';
import {Searchbar} from "react-native-paper";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ViewProductsScreen = (props) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false)

  const isFocused = useIsFocused();
  console.log("focused", isFocused);

  console.log("wola");
  const categorie = props.route.params ? props.route.params.categorie : "";
  const query = props.route.params ? props.route.params.query : "";

  const [productArray, setProductArray] = useState([]);

  useEffect(() => {
    setFocus(false)
    const getProducts = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/products/${categorie}`);
      setProductArray(data)
      setProductsFiltered(data)
    }
    getProducts()
    setIsLoading(false);
  }, [isFocused]);

  console.log("categorie", categorie);
  console.log(productArray);

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

  const searchProduct = (text) => {
    setProductsFiltered(
        productArray.filter((i) => i.title.toLowerCase().includes(text.toLowerCase()))
    )
  }

  const openList = () => {
    setFocus(true)
  }

  const onBlur = () => {
    setFocus(false)
  }

  return (
    <TouchableWithoutFeedback style={styles.container}>
      <>
        <View style={styles.searchBarContainer}>
          <AntDesign name="arrowleft" size={24} color="black" onPress={() => props.navigation.navigate('Accueil', {
            screen: 'AccueilScreen'
          })}/>
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
        <>
          {isLoading ? <ActivityIndicator  size="small" color="#0000ff"/> : <View style={styles.container}>
            <Text style={styles.attendent}>{categorie}</Text>

            <TouchableOpacity
                style={styles.backArrowContainer}
                onPress={() => setFilter(true)}
            >
              <Image source={require("../../assets/downArrow.png")} />
            </TouchableOpacity>

            <Text>Classer par</Text>

            {filter ? (
                <View style={styles.filterContainer}>
                  <TouchableOpacity
                      style={styles.filterButton}
                      onPress={() => {
                        productArray.sort((a, b) => {
                          return b.prix - a.prix;
                        });
                        setFilter(false);
                      }}
                  >
                    <Text style={styles.filterText}>Prix décroissant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.filterButton}
                      onPress={() => {
                        productArray.sort((a, b) => {
                          return a.prix - b.prix;
                        });
                        setFilter(false);
                      }}
                  >
                    <Text style={styles.filterText}>Prix croissant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.filterButton}
                      onPress={() => {
                        productArray.sort((a, b) => {
                          return b.date - a.date;
                        });
                        setFilter(false);
                      }}
                  >
                    <Text style={styles.filterText}>Le plus récent</Text>
                  </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={productArray}
                    numColumns={2}
                    style={styles.flatList}
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
                                  categorie,
                                  product: productArray[itemData.index],
                                });
                              }}
                          />
                      );
                    }}
                ></FlatList>
            )}
          </View>}
        </>

        }

      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  attendent: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: "5%",
  },
  container: {
    flex: 1,
    paddingTop: "5%",
    paddingLeft: "2%",
    backgroundColor: "#f5f5f5",
  },
  backArrowContainer: {
    backgroundColor: "#D51317",
    padding: "3%",
    width: "15%",
    alignItems: "center",
    borderRadius: 30,
    marginVertical: "2%",
  },
  filterContainer: {
    backgroundColor: "rgba(231, 233, 236, 0.26)",
    alignItems: "center",
    marginTop: "15%",
  },
  filterText: {
    color: "white",
    textAlign: "center",
  },
  icon: {
    width: "10%",
    marginLeft: "5%",
  },
  searchBarInner: {
    borderRadius: 80,
  },
  arrow: {
    marginRight: "2%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "#D51317",
    alignItems: "center",
    paddingHorizontal: "7%",
    paddingVertical: "2%",
    width: "50%",
    marginBottom: "5%",
  },
  flatList: {
    flex: 1,
    paddingBottom: 100,
    padding: 0,
  },
  searchFlatList: {
    flex: 1,
    paddingBottom: 100,
    padding: 0,
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
});

export default ViewProductsScreen;

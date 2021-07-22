import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";
import {SearchBar} from "react-native-elements";
import {AntDesign, Fontisto} from "@expo/vector-icons";
import firebase from "firebase";
import * as productsActions from '../../store/actions/products'
import CardVente from "../../components/CardVente";
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect, useNavigation} from "@react-navigation/core";
import { useIsFocused } from '@react-navigation/native';

const ViewProductsScreen = (props) => {

  const dispatch = useDispatch()
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);

  const [filter, setFilter] = useState(false);

  const isFocused = useIsFocused();
  console.log('focused', isFocused);

  useEffect(() => {
    dispatch(productsActions.fetchProducts(categorie))
  }, [isFocused]);


  const updateSearch = (search) => {
    setSearch(search)
  };

  console.log('wola')
  const categorie = props.route.params.categorie
  console.log('categorie', categorie)
  const productArray = useSelector(state => state.products.products)

  if(count < 1) {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }

  const productDetail = useSelector(state => state.products.productDetail)

  console.log(productDetail)



  return (
    <View>
      <View style={styles.container}>

        <Text style={styles.attendent}>{categorie}</Text>

        <TouchableOpacity style={styles.backArrowContainer} onPress={() => setFilter(true)}>
          <Image source={require('../../assets/downArrow.png')}/>
        </TouchableOpacity>

        <Text>Classer par</Text>

        {filter ?
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={() => {
              productArray.sort((a, b) => {
                return b.prix - a.prix;
              });
              setFilter(false)
            }}>
                <Text style={styles.filterText}>Prix décroissant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => {
              productArray.sort((a, b) => {
                return a.prix - b.prix;
              });
              setFilter(false)
            }}>
              <Text style={styles.filterText}>Prix croissant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Le plus récent</Text>
            </TouchableOpacity>
          </View>
          :
          <FlatList
            data={productArray}
            numColumns={2}
            keyExtractor={item => item.title}
            renderItem={itemData => {
              return (
                <CardVente
                  pseudo={itemData.item.pseudoVendeur}
                  title={itemData.item.title}
                  price={itemData.item.prix}
                  imageURI={itemData.item.downloadURL}
                  onpress={() => props.navigation.navigate('ProductDetailScreen', {
                  productId: itemData.item.id,
                  categorie,
                  product : productArray[itemData.index]
                })}/>
              )
            }
            }
          >

          </FlatList>
        }

    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  attendent: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '5%'
  },
  container: {
    paddingTop: '5%',
    paddingLeft: '2%',
    backgroundColor: 'white'
  },
  backArrowContainer: {
    backgroundColor: '#D51317',
    padding: '3%',
    width: '15%',
    alignItems: 'center',
    borderRadius: 30,
    marginVertical: '2%'
  },
  filterContainer: {
    backgroundColor: 'rgba(231, 233, 236, 0.26)',
    alignItems: 'center',
    marginTop: '15%'
  },
  filterText: {
    color: 'white',
    textAlign: 'center'
  },
  searchBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '2%',
    alignItems: 'center'
  },
  searchBar: {
    width: '80%',
    borderRadius: 80
  },
  icon: {
    width: '10%',
    marginLeft: '5%',
  },
  searchBarInner: {
    borderRadius: 80
  },
  arrow : {
    marginRight: '2%'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterButton: {
    backgroundColor: '#D51317',
    alignItems: 'center',
    paddingHorizontal: '7%',
    paddingVertical: '2%',
    width: '50%',
    marginBottom: '5%'
  }
});

export default ViewProductsScreen;

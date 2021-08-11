import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView} from "react-native";
import {AntDesign, Fontisto} from "@expo/vector-icons";
import {SearchBar} from "react-native-elements";
import {useIsFocused} from "@react-navigation/native";
import * as productsActions from "../../store/actions/products";
import {useDispatch, useSelector} from "react-redux";
import * as cartActions from '../../store/actions/cart';
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import UserAvatar from 'react-native-user-avatar';
import * as articlesActions from "../../store/actions/articlesCommandes";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProductDetailScreen = (props) => {

  const product = props.route.params.product;
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(articlesActions.getAvis(product.idVendeur))
  }, [dispatch]);

  let commentaires = useSelector(state => state.commandes.commentaires);
  console.log('wola', commentaires)
  console.log(product)

  let ratings = []
  for (let data in commentaires) {
    ratings.push(commentaires[data].rating)
  }

  console.log('ratings', ratings)

  let overallRating = 0;
  for (let data in ratings) {
    console.log(ratings[data])
    overallRating += parseInt(ratings[data])
  }

  console.log('overall', overallRating)

  const trueRating = Math.ceil(overallRating/commentaires.length);

  const [search, setSearch] = useState('');
  const [errorAdded, setErrorAdded] = useState('');

  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        image: state.cart.items[key].image,
        idVendeur: state.cart.items[key].idVendeur,
        pseudoVendeur: state.cart.items[key].pseudoVendeur,
        pushToken: state.cart.items[key].pushToken,
        categorie: state.cart.items[key].categorie,
        sum: state.cart.items[key].sum
      })
    }
    return transformedCartItems
  });




  console.log('cartitems', cartItems)


  const updateSearch = (search) => {
    setSearch(search)
  };

  /*if (productDetail === undefined) {
    dispatch(productsActions.fetchProductDetail(categorie, id))
  }
   */

  const onMessagePressed = () => {
    console.log(product.pseudoVendeur)
    firebase.firestore().collection('MESSAGE_THREADS')
        .doc(`${product.idVendeur}` + `${firebase.auth().currentUser.uid}`)
        .collection('MESSAGES').add({
        text: `Start chating`,
        createdAt: new Date().getTime(),
        system: true
      })
      props.navigation.navigate('Message', {
        screen: 'MessageScreen'
      })
  }

  const FourStar = () => {
    return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
        </View>
    )
  }
  const FiveStar = () => {
    return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
        </View>
    )
  }

  const ThreeStar = () => {
    return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
        </View>
    )
  }
  const TwoStar = () => {
    return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <AntDesign name="star" size={18} color="#FFC107" />
          <AntDesign name="star" size={18} color="#FFC107" />
        </View>
    )
  }

  const OneStar = () => {
    return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <AntDesign name="star" size={18} color="#FFC107" />
        </View>
    )
  }


  const initial = product.pseudoVendeur.charAt(0)
    return (
      <View>

        <View style={styles.container}>
          <ScrollView>

          <View style={styles.imgContainer}>
            <Image
              source={{uri: product.downloadURL}}
              style={styles.image}
            />
          </View>

          <View style={styles.titleAndPrixContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.prix}>{product.prix} €</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.itemForm3}>
            <Text>Etat</Text>
            <Text>{product.etat}</Text>
          </View>

          <View style={styles.itemForm3}>
            <Text>Catégorie</Text>
            <Text>{product.categorie}</Text>
          </View>

          <View style={styles.vendeurContainer}>
            {product.imageURL ? <Image source={require('../../assets/photoProfile.png')}/> :<UserAvatar
              size={50}
              name={initial}
            /> }

            <View>
              <Text style={styles.pseudoVendeur}>{product.pseudoVendeur}</Text>
              {trueRating === 1 && <OneStar />}
              {trueRating === 2 && <TwoStar />}
              {trueRating === 3 && <ThreeStar />}
              {trueRating === 4 && <FourStar />}
              {trueRating === 5 && <FiveStar />}
            </View>

            <TouchableOpacity onPress={() => props.navigation.navigate('AvisScreen', {
              product: product
            })}>
              <Text>Voir les avis</Text>
            </TouchableOpacity>
          </View>

            <TouchableOpacity style={styles.envoyerMessageContainer} onPress={() => onMessagePressed()}>
              <Text style={styles.envoyerMessageText}>Envoyer un message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mettreEnVente}
              onPress={() => {
                if (cartItems.length !== 0) {
                  for (const key in cartItems) {
                    console.log('wola')
                    console.log('id1', product.id)
                    console.log('id2', cartItems[key].productId)
                    if (product.id == cartItems[key].productId) {
                      setErrorAdded('Ce produit est déjà présent dans votre panier')
                    } else {
                      dispatch(cartActions.addToCart(product))
                    }
                  }
                } else {
                  dispatch(cartActions.addToCart(product))
                }

              }}>
              <Text style={styles.mettreEnVenteText}>Ajouter au panier</Text>
            </TouchableOpacity>

            {errorAdded ? <Text style={{marginBottom: 12, textAlign: 'center', color: '#D51317'}}>{errorAdded}</Text> : <Text />}
        </ScrollView>


        </View>

      </View>
    )
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '5%',
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
  imgContainer: {
    width: windowWidth,
    height: windowHeight/3,
    marginTop: '3%',
    alignItems: 'center'
  },
  image: {
    height: '100%',
    width: '50%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24
  },
  prix: {
    color: '#737379',
    fontWeight: 'bold',
    fontSize: 17
  },
  titleAndPrixContainer: {
    marginLeft: '5%'
  },
  descriptionContainer: {
    backgroundColor: '#E7E9EC',
    paddingVertical: '5%',
    paddingHorizontal: '2%',
    marginTop: '5%'
  },
  description: {
    textAlign: 'center'
  },
  itemForm3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    height: windowHeight/14,
    alignItems: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: '5%',
    marginLeft: '5%',
    width: windowWidth/1.1,
    paddingVertical: '5%',
  },
  mettreEnVenteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  vendeurContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E7E9EC',
    paddingVertical: '5%',
    paddingHorizontal: '2%',
    alignItems: 'center'
  },
  pseudoVendeur: {
    color: 'black',
    fontSize: 16
  },
  envoyerMessageContainer: {
    borderWidth: 1,
    borderColor: '#D9353A',
    width: '50%',
    marginLeft: '25%',
    marginTop: '5%',
    alignItems: 'center',
    borderRadius: 4
  },
  envoyerMessageText: {
    color: '#D9353A',
    fontSize: 18
  }
});

export default ProductDetailScreen;

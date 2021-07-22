import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import * as articlesActions from "../../store/actions/articlesEnVente";
import CardVente from "../../components/CardVente";
import BoosteVenteItem from "../../components/BoosteVenteItem";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const BoosteVenteScreen = (props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(articlesActions.getArticles())
  }, [dispatch]);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);

  const renderItem = ({item}) => {
   const backgroundColor = item.id === selectedId ? '#D6F5DB' : "white";

    return (
      <BoosteVenteItem
        item={item}
        onPress={() => {
          setSelectedId(item.id)
          setSelectedArticles((selectedArticles) => [...selectedArticles, item])
        }}
        backgroundColor={{ backgroundColor }}
      />
    );
  }


  let articles = useSelector(state => state.articles.mesVentes);




  console.log('selected', selectedArticles)
  return (
    <View style={styles.container}>

      <View style={styles.flatListContainer}>
      <FlatList
        data={articles}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={articles}
      />
      </View>


      <TouchableOpacity style={styles.mettreEnVente} onPress={() => props.navigation.navigate('BoosteVentePaiementScreen', {
        articles: selectedArticles
      })}>
        <Text style={styles.mettreEnVenteText}>Terminer</Text>
      </TouchableOpacity>




    </View>
  );
};

const styles = StyleSheet.create({
  mettreEnVente: {
    backgroundColor: "#D51317",
    marginTop: '5%',
    width: windowWidth/1.1,
    paddingVertical: '5%',
    marginLeft: '5%'
  },
  flatListContainer: {
    height: windowHeight/1.5
  },
  mettreEnVenteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  price: {
    color: '#B5B5BE',
    fontSize: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  vendeurContainer: {
    backgroundColor: '#F9F9FA',
    paddingVertical: '4%'
  },
  selected: {
    backgroundColor: '#D6F5DB',
    paddingVertical: '4%'
  },
  cardContainer: {
    backgroundColor: 'white',
    width: '40%',
    marginTop: '5%',
    marginHorizontal: '4%'
  },
  imgContainer: {
    height: '80%'
  },
  image: {
    height: 140,
    width: 140
  }
});

export default BoosteVenteScreen;

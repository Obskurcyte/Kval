import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as articlesActions from "../../store/actions/articlesEnVente";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import CardVente from "../../components/CardVente";
import * as messageAction from "../../store/actions/messages";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ArticlesEnVenteScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(articlesActions.getArticles());
  }, [dispatch]);

  const articles = useSelector((state) => state.articles.mesVentes);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispatch(messageAction.fetchUnreadMessage())
    });
    return unsubscribe
  }, [props.navigation, dispatch]);

  console.log(articles);
  return (
    <View style={styles.container}>
      {articles.length !== 0 ? (
        <View>
          <TouchableOpacity
            style={styles.avantArticlesContainer}
            onPress={() => props.navigation.navigate("BoosteVenteScreen")}
          >
            <MaterialCommunityIcons name="fire" size={34} color="#D51317"/>
            <View style={{display: 'flex', flexDirection: 'column'}}>
            <Text style={styles.avantArticlesText}>
              Met en avant tes articles
            </Text>
            <Text style={styles.avantArticlesText}>
              et booste tes ventes
            </Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={34}
              color="#D51317"
            />
          </TouchableOpacity>
          <FlatList
            data={articles}
            numColumns={2}
            keyExtractor={(item) => item.title}
            renderItem={(itemData) => {
              console.log(itemData);
              return (
                <CardVente
                  title={itemData.item.title}
                  price={itemData.item.prix}
                  imageURI={itemData.item.downloadURL}
                  onPress={() =>
                    props.navigation.navigate("Acheter", {
                      screen: "ProductDetailScreen",
                      params: { product: itemData.item },
                    })
                  }
                />
              );
            }}
          />
        </View>
      ) : (
        <Text style={styles.noCommandeText}>
          Vous n'avez aucun article en vente
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avantArticlesContainer: {
    backgroundColor: "#E7E9EC",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: "5%",
  },
  avantArticlesText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: "2%",
  },
  noCommandeText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: windowHeight / 2.5,
  },
});
export default ArticlesEnVenteScreen;

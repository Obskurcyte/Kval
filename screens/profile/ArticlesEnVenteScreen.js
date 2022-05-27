import React, {useState, useEffect, useContext} from "react";
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
import {BASE_URL} from "../../constants/baseURL";
import axios from 'axios';
import authContext from "../../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ArticlesEnVenteScreen = (props) => {
  const dispatch = useDispatch();

  const [articles, setArticles] = useState([]);

  const userData = props.route.params.user;


  const { messageLength, setMessageLength } = useContext(authContext);

  const ctx = useContext(authContext);
  console.log('ctx', ctx);

  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setMessageLength(data.unreadMessages)
    }
    getUser()
  }, [messageLength]);

  useEffect(() => {
    const getArticles = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/products/vendeur/${userData._id}`);
      setArticles(data)
    }
    getArticles()
  }, []);


  return (
    <View style={styles.container}>
      {articles.length !== 0 ? (
        <View>
          <TouchableOpacity
            style={styles.avantArticlesContainer}
            onPress={() => props.navigation.navigate("BoosteVenteScreen", {
              user: userData
            })}
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
            style={styles.flatlist}
            keyExtractor={(item) => item.title}
            renderItem={(itemData) => {
              return (
                <CardVente
                  title={itemData.item.title}
                  price={itemData.item.prix}
                  imageURI={itemData.item.images[0]}
                  onPress={() =>
                    props.navigation.navigate("Acheter", {
                      screen: "ProductDetailScreen",
                      params: {product: itemData.item},
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
  flatlist: {
    marginBottom: 200
  },
  noCommandeText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: windowHeight / 2.5,
  },
});
export default ArticlesEnVenteScreen;

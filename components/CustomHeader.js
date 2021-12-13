import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import * as productsActions from "../store/actions/products";
import { useDispatch, useSelector } from "react-redux";
import { set } from "react-native-reanimated";

const CustomHeader = (props) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const dispatch = useDispatch();

  const [typing, setTyping] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (typing) {
      clearTimeout(time);
      setTime(
        setTimeout(() => {
          props.navigation.navigate("ViewProductsScreen", {
            categorie: "Recherche Personnalisée",
            query: searchQuery,
          });
          setTyping(false);
        }, 1000)
      );
    }
  }, [searchQuery]);

  const onChangeSearch = (query) => {
    setTyping(true);
    setSearchQuery(query);
  };

  return (
    <View style={styles.searchBarContainer}>
      <Searchbar
        placeholder="Rechercher"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: "4%",
    alignItems: "center",
  },
  searchBar: {
    width: "100%",
    borderRadius: 80,
    height: "80%",
    shadowColor: "white",
    backgroundColor: "lightgrey",
  },
});

export default CustomHeader;

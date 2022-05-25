import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import * as productsActions from "../store/actions/products";
import { useDispatch, useSelector } from "react-redux";

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
        <TouchableOpacity onPress={() => props.onPress} style={styles.searchBar}>
          <Searchbar
              placeholder="Rechercher"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.grey}
          />
        </TouchableOpacity>

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
    width: "95%",
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

export default CustomHeader;

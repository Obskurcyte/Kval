import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from "react-native";
import {AntDesign, Fontisto} from "@expo/vector-icons";
import {SearchBar} from "react-native-elements";
import { Searchbar } from 'react-native-paper';

const CustomHeader = (props) => {

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);


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
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '4%',
    alignItems: 'center'
  },
  searchBar: {
    width: '100%',
    borderRadius: 80,
    height: '80%',
    shadowColor: 'white',
    backgroundColor: 'lightgrey'
  }
});

export default CustomHeader;

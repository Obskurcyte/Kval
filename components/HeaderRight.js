import React from 'react';
import {View, Text} from 'react-native';
import {Fontisto} from "@expo/vector-icons";
import {useSelector} from "react-redux";

const HeaderRight = (props) => {
  let totalQuantity = 0;
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      })
    }
    return transformedCartItems
  });

  for (let data in cartItems) {
    totalQuantity += parseFloat(cartItems[data].quantity)
  }
  console.log('totalQuantity', totalQuantity)
  console.log('cartItems', cartItems)
  return (
    <View>
      <View style={{backgroundColor: '#D51317', borderRadius: 30, alignItems: 'center', position: 'absolute', width: 20, bottom: '65%', right: '55%'}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>{totalQuantity}</Text>
      </View>
      <Fontisto name="shopping-basket" size={24} color="#D51317" onPress={() => props.navigation.navigate('CartScreen')}/>
    </View>
  );
};

export default HeaderRight;

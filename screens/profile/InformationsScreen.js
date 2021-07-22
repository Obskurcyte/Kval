import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as userActions from "../../store/actions/users";
import {useDispatch, useSelector} from "react-redux";

const InformationsScreen = () => {

  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(userActions.getUser())
}, [dispatch]);

  const userData = useSelector(state => state.user.userData);
  console.log(userData)

  return (
    <View>
      <View>
        <View>
          <Text>Nom d'utilisateur</Text>
          <Text></Text>
        </View>
        <View>
          <TouchableOpacity>
            <Text>Modifier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

});
export default InformationsScreen;

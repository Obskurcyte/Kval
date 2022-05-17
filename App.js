import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase/app";
import { TabNavigator, AuthNavigator } from "./navigation/AppNavigator";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, useSelector } from "react-redux";
import { LogBox } from "react-native";
import ReduxThunk from "redux-thunk";

import productReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import articleReducer from "./store/reducers/articlesEnVente";
import userReducer from "./store/reducers/users";
import * as Notifications from "expo-notifications";
import notifReducer from "./store/reducers/notifications";
import articleCommandeReducer from "./store/reducers/articlesCommandes";
import messageReducer from "./store/reducers/messages";
LogBox.ignoreLogs(["Setting a timer"]);
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from "./context/authContext";
import axios from "axios";
import {BASE_URL} from "./constants/baseURL";

const firebaseConfig = {
  apiKey: "AIzaSyCkee21-SCCNxfS6co9SjW-PNfLTFTkdec",
  authDomain: "kval-occaz.firebaseapp.com",
  projectId: "kval-occaz",
  storageBucket: "kval-occaz.appspot.com",
  messagingSenderId: "40095874290",
  appId: "1:40095874290:web:9ae177535c519f10ec646b",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  articles: articleReducer,
  user: userReducer,
  notifs: notifReducer,
  commandes: articleCommandeReducer,
  messages: messageReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {

  const [loggedIn, setIsLoggedIn] = useState(false);
  const [loggedInAsVisit, setLoggedInAsVisit] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  let userId;
  useEffect(() => {
    const getUser = async () => {
      userId = await AsyncStorage.getItem("userId");
      console.log('userID', userId)
      if (!userId) {
        setIsLoggedIn(false)
        setSignedIn(false)
      } else {
        setIsLoggedIn(true)
        setSignedIn(true)
      }
    }
    getUser()
  }, [userId, loggedIn, signedIn]);

  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      console.log('userId', userId);
      setTimeout(async () => {
        const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`);
        setMessageLength(data.unreadMessages)
      }, 1000)
    }
    getUser()
  }, [messageLength]);

  return (
      <AuthContext.Provider value={{
        signedIn: signedIn,
        messageLength: messageLength,
        setMessageLength: setMessageLength,
        setSignedIn: setSignedIn
      }}>
        <Provider store={store}>
          <NavigationContainer>
            {loggedIn && signedIn ? (
              <TabNavigator
                loggedInAsVisit={loggedInAsVisit}
                setLoggedInAsVisit={setLoggedInAsVisit}
              />
            ) : (
              <AuthNavigator
                firstLaunch={firstLaunch}
                setFirstLaunch={setFirstLaunch}
                loggedInAsVisit={loggedInAsVisit}
                setIsLoggedIn={setIsLoggedIn}
                setLoggedInAsVisit={setLoggedInAsVisit}
              />
            )}
          </NavigationContainer>
        </Provider>
      </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

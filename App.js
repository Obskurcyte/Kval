import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase/app";
import { TabNavigator, AuthNavigator } from "./navigation/AppNavigator";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import ReduxThunk from "redux-thunk";
import productReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import articleReducer from "./store/reducers/articlesEnVente";
import userReducer from "./store/reducers/users";
import * as Notifications from "expo-notifications";
import notifReducer from "./store/reducers/notifications";
import articleCommandeReducer from "./store/reducers/articlesCommandes";
LogBox.ignoreLogs(["Setting a timer"]);

const firebaseConfig = {
  apiKey: "AIzaSyDfRqLw_maATHpGVqO4nxcmHw_asxc0c60",
  authDomain: "kval-c264a.firebaseapp.com",
  projectId: "kval-c264a",
  storageBucket: "kval-c264a.appspot.com",
  messagingSenderId: "692297808431",
  appId: "1:692297808431:web:d17649aabc7a6700f024da",
  measurementId: "G-EDTT5RXHJ2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  articles: articleReducer,
  user: userReducer,
  notifs: notifReducer,
  commandes: articleCommandeReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [loaded, setIsLoaded] = useState(false);
  const [loggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setIsLoaded(true);
        setIsLoggedIn(false);
      } else {
        setIsLoaded(true);
        setIsLoggedIn(true);
      }
    });
  });

  if (!loaded) {
    return <ActivityIndicator />;
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        {loggedIn ? <TabNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </Provider>
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

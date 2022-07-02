import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import firebase from "firebase";
import {WebView} from "react-native-webview";


const ViePriveeScreen = (props) => {
  const [url, setUrl] = useState(null);

  const downloadFile = async () => {
    firebase
        .storage()
        .ref()
        .child("documents/Politique-de-confidentialité.pdf")
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          setUrl(url);
        })
        .catch((error) => {
          console.log(err);
        });
  };

  useEffect(() => {
    downloadFile();
  }, []);

    const androidURL = "https://drive.google.com/file/d/1JHEMUgUR7l2jUD1CrpvoEIJZw0skwvIg/view?usp=sharing"
    return (
        <View style={styles.container}>
            {Platform.OS === "android" ? <WebView
                bounces={false}
                source={{ uri: androidURL }} /> : <WebView
                bounces={false}
                source={{ uri: url }} /> }

        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViePriveeScreen;

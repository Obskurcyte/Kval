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

  return (
      <View style={styles.container}>
        <WebView
            bounces={false}
            source={{ uri: url }} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViePriveeScreen;

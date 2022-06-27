import React, { useEffect, useState } from "react";
import {View, StyleSheet, Platform} from "react-native";
import firebase from "firebase";
import {WebView} from "react-native-webview";
import PDFReader from 'rn-pdf-reader-js'

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
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    downloadFile();
  }, []);

  return (
      <View style={styles.container}>
          {Platform.OS === 'android' ? <PDFReader
              source={{
                  uri: url,
              }}
          /> :   <WebView
              bounces={false}
              source={{ uri: url }} />}

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViePriveeScreen;

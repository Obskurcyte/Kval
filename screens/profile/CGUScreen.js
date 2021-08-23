import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import firebase from "firebase";
import PdfReader from "rn-pdf-reader-js";

const CGUScreen = (props) => {
  const [url, setUrl] = useState(null);

  const downloadFile = async () => {
    firebase
      .storage()
      .ref()
      .child("documents/CGV.pdf")
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
      {url && (
        <PdfReader
          source={{
            uri: url,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CGUScreen;

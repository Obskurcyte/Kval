import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import firebase from "firebase";
import { WebView } from 'react-native-webview';

const MentionLegaleScreen = (props) => {
  const [url, setUrl] = useState(null);

  const downloadFile = async () => {
    firebase
        .storage()
        .ref()
        .child("documents/Mentions-légales.pdf")
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

    const androidURL = "https://drive.google.com/file/d/1TDmESY7QKONuQ_oD4I2lOHfkrDgLOeAS/view?usp=sharing"
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

export default MentionLegaleScreen;

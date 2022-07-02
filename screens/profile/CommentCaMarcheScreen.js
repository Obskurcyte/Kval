import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Platform} from "react-native";
import firebase from "firebase";
import {WebView} from "react-native-webview";

const CommentCaMarcheScreen = () => {
    const [url, setUrl] = useState(null);

    const downloadFile = async () => {
        firebase
            .storage()
            .ref()
            .child("documents/comment_ca_marche.pdf")
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

    const androidURL = "https://drive.google.com/file/d/1UZ8Q6PsPAqsuD7UtHYfr8qrGbHC3zDSD/view?usp=sharing"
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

export default CommentCaMarcheScreen;

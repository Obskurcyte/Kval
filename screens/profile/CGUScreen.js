import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Platform } from "react-native";
import firebase from "firebase";
import { HeaderBackButton } from "@react-navigation/stack";

import ProfileScreen from "./ProfileScreen";
import {WebView} from "react-native-webview";

const CGUScreen = (props) => {
    const [url, setUrl] = useState(null);

    React.useEffect(() => {
        if (props.route.params) {
            if (props.route.params.from === "CartScreen") {
                props.navigation.setOptions({
                    headerLeft: () => (
                        <HeaderBackButton
                            onPress={() => {
                                props.navigation.navigate("Acheter", {
                                    screen: "CGUScreen",
                                });
                                props.navigation.setParams({ from: "" });
                            }}
                        />
                    ),
                });
            }
        }
        else {
            props.navigation.setOptions({
                headerLeft: () => (
                    <HeaderBackButton
                        headerBackTitle = "Retour"
                        onPress={() =>
                            props.navigation.navigate("Profil", {
                                screen: "ProfileScreen",
                            })
                        }
                    />
                ),
            });
        }
    }, [props.route.params]);

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

    const androidURL = "https://drive.google.com/file/d/1tti9XhRPzNMuKYOIkJYbGuacXyq3FNVf/view?usp=sharing"
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

export default CGUScreen;

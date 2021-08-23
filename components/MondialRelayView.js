import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { WebView } from "react-native-webview";

const MondialRelayView = (props) => {
  const htmlContent = `
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr" dir="ltr">

<head>
  <title>Utilisation du Widget Mondial Relay</title>
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">


  <!--jQuery-->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
  <!-- Widget MR -->
  <script type="text/javascript"
    src="https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"></script>
  <script>!function () {
      // Parameterized the widget
      $(document).ready(function () {
        $("#Zone_Widget").MR_ParcelShopPicker({
          Brand: "BDTEST  ",
          Country: "FR",
          EnableGmap: true,
          Responsive: true,
          OnParcelShopSelected:
                function(data) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(data))
                }
              });
      });
      
    }();</script>

</head>

<body>
  <!-- Widget -->
  <center>
    <div id="Zone_Widget"></div>
  </center>
  <!-- Parcelshop code -->
  <input hidden id="ParcelShopCode" name="ParcelShopCode" />
</body>

</html>
    `;

  const injectedJavaScript = `(function() {
        window.postMessage = function(data){
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;

  const [relay, setRelay] = useState(null);

  const onMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log(data);
    setRelay(data);
  };

  const validationHandler = () => {
    props.handler && props.handler(relay);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        javaScriptEnabled={true}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
      />
      {relay && (
        <Text>
          {`Point Relais : n°${relay.ID}\n${relay.Nom}\n${relay.Adresse1}\n${relay.CP} \n ${relay.Ville}`}
        </Text>
      )}

      <Button onPress={validationHandler}>Valider</Button>
    </View>
  );
};

export { MondialRelayView };

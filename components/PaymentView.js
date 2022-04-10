import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

const STRIPE_PK =
  "pk_test_51IzdhtInmXQPTRFWN4LviIiI076QyI4DoMdE81jVRjoSvWqm014VuVToGJnBQqZqOPdrDFHY2ab4HdbdGQtedvQb00h4AMmu25";

const PaymentView = (props) => {
  const { amount, product } = props;

  const onCheckStatus = (response) => {
    props.onCheckStatus(response);
  };

  const htmlContent = `

                <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Page</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <script src="https://js.stripe.com/v3/"></script>
                <style>


                .card-holder{
                    display: flex;
                    flex-direction: column;
                    height: 200px;
                    justify-content: space-around;
                    background-color: #D51317;
                    border-radius: 20px;
                    padding: 10px;
                    padding-top: 20px;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    position: relative
                }
                .card-element{
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }
                .card-name{
                    padding: 20;
                    color: black;
                    font-weight: 500;
                    font-size: '25px';
                    background-color: transparent;
                    border: none;

                }
                input {
                    outline:none;
                    color: black;
                    font-size: '25px';
                    font-weight: 500;
                    background-color: transparent;
                    }

                    .row{
                        margin-top: '0px';
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                    .cardPhoto {
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  margin-bottom: 10%;
                  justify-content: space-between
                    }
                    .imgContainer {
                  width: 85%;
                  align-items: center;
                  height: 10%;
                  margin-left: 10%
                    }
                    .imgPaiement {
                  width: 100%;
                  height: 0%;
                  text-align: center
                    }
                    .products-info{

                        height: 80px;
                        width: 100%;
                        padding: 0px;
                        text-align: center;
                        color: black
                    }
                    .card-errors{
                        color: red;
                    }

                    .card-element label {
                  color: white
                    }
                    .pay-btn{
                        display: flex;
                        height: 50px;
                        justify-content: center;
                        align-items: center;
                        background-color: #D51317;
                        color: white;
                        margin-top: 50px                    }

                    .payer {
                  color: white;
                  font-size: 25px;
                  font-weight: bold;
                  border: none;
                    }

                    .container-fluid {
                  padding-top: 35%;
                    }

                </style>

            </head>
            <body>

                <!-- product info -->
                <div class="container-fluid">
                    <div class="row">

                    </div>
                    <div class="row">
                        <label class="card-errors" id="card-errors"></label>
                    </div>

                        <form>

                            <div class="card-holder">
                               <div class="cardPhoto">
                               <div>
                          <img class="img1" src='https://firebasestorage.googleapis.com/v0/b/roundpower-88ef9.appspot.com/o/Accueil%2Fcard1.jpg?alt=media&token=c3b0ab58-d14f-42d4-9546-21a8ecc8487b' alt="" height="50"/>
                         </div>
                         <div>
                          <img class="img2" src="https://firebasestorage.googleapis.com/v0/b/kval-c264a.appspot.com/o/Photos%2Fcheval2.png?alt=media&token=c624c4d6-b483-4b8d-93bc-5c6d2699f035" alt="" height="50"/>
                       </div>
                        </div>
                                    <input type="text" placeholder="Nom de l'utilisateur de la carte" id="card-name" class="card-name" />
                                    <div id="card-element" class="card-element">
                                        <div class="form-group">
                                            <label for="card_number">Numéro de la carte</label>
                                            <input type="text" class="form-control" id="card_number" data-stripe="number">
                                        </div>
                                        <div class="form-row">
                                            <label>
                                                <span>Numéro de la carte</span>
                                                <input type="text" size="20" data-stripe="number">
                                            </label>
                                        </div>

                                        <div class="form-row">
                                        <label>
                                            <span>Date d'expiration (MM/YY)</span>
                                            <input type="text" size="2" data-stripe="exp_month">
                                        </label>
                                        <span> / </span>
                                        <input type="text" size="2" data-stripe="exp_year">
                                        </div>

                                        <div class="form-row">
                                        <label>
                                            <span>CVC</span>
                                            <input type="text" size="4" data-stripe="cvc">
                                        </label>
                                        </div>

                                        <div class="form-row">
                                        <label>
                                            <span>Billing Zip</span>
                                            <input type="hidden" size="6" data-stripe="address_zip" value="400012">
                                        </label>
                                        </div>


                                    </div>
                                </div>

                                <div>
                                    <p style="text-align:center">Aucune données concernant votre moyen de paiement ne seront conservées</p>
                                </div>


                                <div class="pay-btn">
                                    <input type="submit" class="payer" value="Payer" />
                                </div>


                        </form>


                </div>

                <script>
                    var stripe = Stripe('${STRIPE_PK}');
                    var elements = stripe.elements();
                        var card = elements.create("card", {
                            hidePostalCode: true,
                            style: {
                                base: {
                                color: 'black',
                                fontWeight: 500,
                                fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
                                fontSize: '20px',
                                fontSmoothing: 'antialiased',
                                '::placeholder': {
                                    color: 'black',
                                },
                                ':-webkit-autofill': {
                                    color: 'black',
                                },
                            },
                            invalid: {
                                color: '#FC011F',
                                '::placeholder': {
                                    color: '#FFCCA5',
                                },
                            },
                            }
                        });
                        // Add an instance of the card Element into the 'card-element' <div>.
                        card.mount('#card-element');
                        /**
                         * Error Handling
                         */
                        //show card error if entered Invalid Card Number
                        function showCardError(error){
                            document.getElementById('card-errors').innerHTML = ""
                            if(error){
                                document.getElementById('card-errors').innerHTML = error
                            }
                        }

                        card.on('change', function(event) {
                            if (event.complete) {
                                showCardError()
                                // enable payment button
                            } else if (event.error) {
                                const { message} = event.error
                                console.log(message)
                                showCardError(message)
                            }
                        });

                        card.mount('#card-element');

                        /**
                         * Payment Request Element
                         */
                        var paymentRequest = stripe.paymentRequest({
                            country: "FR",
                            currency: "eur",
                            total: {
                                amount: ${amount * 100},
                                label: "Total"
                            }
                        });
                        var form =  document.querySelector('form');
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();

                            var additionalData = {
                                name: document.getElementById('card-name').value,
                                address_line1: undefined,
                                address_city:  undefined,
                                address_state: undefined,
                                address_zip: undefined,
                            };

                            stripe.createToken(card, additionalData).then(function(result) {

                            console.log(result);
                            if (result.token) {
                                window.postMessage(JSON.stringify(result));
                            } else {
                                window.postMessage(JSON.stringify(result));
                            }
                        });
                        })
                </script>
            </body>
            </html>
    `;

  const injectedJavaScript = `(function() {
        window.postMessage = function(data){
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;

  const onMessage = (event) => {
    const { data } = event.nativeEvent;
    console.log(data);
    onCheckStatus(data);
  };

  return (
    <WebView
      javaScriptEnabled={true}
      style={{ flex: 1, backgroundColor: "black" }}
      originWhitelist={["*"]}
      source={{ html: htmlContent, baseUrl: 'https://example.com',}}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
    />
  );
};

export { PaymentView };

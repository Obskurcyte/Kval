import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import CommandeItem from "../../components/CommandeItem";
import {Formik} from 'formik';
import EvalueItem from "../../components/EvalueItem";
import firebase from "firebase";
import axios from "axios";
import {useSelector} from "react-redux";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EvaluationScreen = (props) => {

    const [rating, setRating] = useState(null)
    const ratingCompleted = (rating) => {
        setRating(rating)
    }

    const currentUser = useSelector((state) => state.user.userData);

    console.log('user', currentUser)
    const product = props.route.params.product;
    console.log('product', product);
    let portefeuilleVendeur = 0;
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior="position"
                style={styles.container}
            >
               <View>
                   <Text style={styles.evaluationText}>Evalue {product.pseudoVendeur} !</Text>
                   <Text style={styles.achatText}>Tu as acheté...</Text>
                   <EvalueItem
                       item={product}
                   />

                   <Rating
                       showRating
                       type='custom'
                       ratingCount={5}
                       imageSize={30}
                       onFinishRating={ratingCompleted}
                       style={styles.rating}
                   />
                        <Formik
                            initialValues={{
                            commentaire: ''
                            }}
                            onSubmit={async values => {
                                await firebase.firestore()
                                    .collection('commentaires')
                                    .doc(`${product.vendeur}`)
                                    .collection("userCommentaires")
                                    .add({
                                        commentaire: values.commentaire,
                                        rating,
                                        rateur: currentUser.pseudo
                                    });
                                await firebase.firestore()
                                    .collection('commentaires')
                                    .doc(`${product.vendeur}`)
                                    .set({
                                        rating: rating
                                    });
                                await firebase
                                    .firestore()
                                    .collection("commandes")
                                    .doc(firebase.auth().currentUser.uid)
                                    .collection("userCommandes")
                                    .doc(`${product.id}`)
                                    .delete()
                                await firebase
                                    .firestore()
                                    .collection("users")
                                    .doc(product.vendeur)
                                    .get()
                                    .then((doc) => {
                                        portefeuilleVendeur = doc.data().portefeuille;
                                    })
                                    .then(() => {
                                        if (portefeuilleVendeur >= 0) {
                                            firebase
                                                .firestore()
                                                .collection("users")
                                                .doc(product.vendeur)
                                                .update({
                                                    portefeuille: portefeuilleVendeur + Number(product.prix),
                                                });
                                        }
                                    });
                                await axios.post("https://kval-backend.herokuapp.com/send", {
                                    mail: product.emailVendeur,
                                    subject: "Confirmation de réception",
                                    html_output: `<div><p>Bonjour ${product.pseudoVendeur}, <br></p> 
<p>Votre article vient d’être reçu par ${currentUser.pseudo} et conforme à sa description.</p>
<p>Résumé de votre article : </p>

<hr>

<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${product.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${product.productTitle}</p>
        <p style="margin: 0">Description : ${product.description}</p>
        <p style="margin: 0">Prix net vendeur: ${product.prix} €</p>
        <p style="margin: 0">Poids: ${product.poids} kgs</p>
        <p style="margin: 0">Catégorie: ${product.categorie}</p>
    </div>
</div>

<hr>

<p>Votre portefeuille sera crédité de la valeur de l’article d’ici quelques secondes.</p>
<p>Nous vous remercions pour votre confiance,</p>
<br>
<p style="color: red">L'équipe KVal Occaz</p>
<img src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                                });
                                await axios.post("https://kval-backend.herokuapp.com/send", {
                                    mail: currentUser.email,
                                    subject: "Confirmation de réception",
                                    html_output: `<div><p>${currentUser.pseudo}, <br></p> 
<p>Vous venez de déclarer votre article comme étant reçu et conforme à sa description.</p>
<p>Résumé de votre article : </p>
<hr>

<div style="display: flex">
    <div style="margin-right: 30px">
        <img src="${product.image}" alt="" style="width: 150px; height: 150px; margin-top: 20px"/>
    </div>
    <div style="margin-top: 20px">
        <p style="margin: 0">Titre : ${product.productTitle}</p>
        <p style="margin: 0">Description : ${product.description}</p>
        <p style="margin: 0">Prix de l'article: ${product.prix} €</p>
         <p style="margin: 0">Protection acheteur: ${product.prixProtectionAcheteur} €</p>
        <p style="margin: 0">Poids: ${product.poids} kgs</p>
        <p style="margin: 0">Livraison: ${product.livraison}</p>
        <p style="font-weight: bold; margin: 0">Total: ${product.total} € payé par ${product.moyenPaiement}</p>
    </div>
</div>

<hr>

<p>Le vendeur sera crédité de la valeur de l’article d’ici quelques secondes.</p>
<p>Nous vous remercions pour votre confiance,</p>
<p style="margin: 0">L'équipe KVal Occaz</p>
<img style="width: 150px" src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
</div>`,
                                });

                                props.navigation.navigate('ValidationEvaluationScreen')
                            }}
                        >
                            {props => (
                                <ScrollView>
                                    <View style={styles.commentairesContainer}>
                                        <Text style={styles.commentaireText}>Commentaire</Text>
                                        <TextInput
                                            placeholder="Dis nous ce que tu as pensé de ton achat"
                                            value={props.values.commentaire}
                                            onChangeText={props.handleChange('commentaire')}
                                        />
                                    </View>

                                    <TouchableOpacity style={styles.mettreEnVente} onPress={props.handleSubmit}>
                                        <Text style={styles.mettreEnVenteText}>Evaluer</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            )}
                        </Formik>
               </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: '3%'
    },
    mettreEnVente: {
        backgroundColor: "#D51317",
        marginTop: '5%',
        marginLeft: '2%',
        width: windowWidth/1.1,
        paddingVertical: '5%',
    },
    mettreEnVenteText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    },
    evaluationText: {
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: 28
    },
    achatText: {
        fontSize: 18,
        marginTop: 20
    },
    rating: {
        marginTop: 30,
        marginBottom: 30
    },
    commentairesContainer: {
        borderTopColor: '#E0ECF8',
        borderTopWidth: 2,
        borderBottomColor: '#E0ECF8',
        borderBottomWidth: 2,
        paddingVertical: '5%'
    },
    commentaireText: {
        marginBottom: '5%'
    }
})



export default EvaluationScreen;

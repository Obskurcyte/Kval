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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EvaluationScreen = (props) => {

    const [rating, setRating] = useState(null)
    const ratingCompleted = (rating) => {
        setRating(rating)
    }

    const product = props.route.params.product;
    console.log('product', product)
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
                                        rateur: product.pseudoVendeur
                                    });
                                await axios.post("https://kval-backend.herokuapp.com/send", {
                                    mail: product.emailVendeur,
                                    subject: "Confirmation de réception",
                                    html_output: `<div><p>Bonjour, ${product.pseudoVendeur}, <br></p> 
<p>Nous vous confirmons que l'article ${product.title} a bien été reçu et conforme.</p>
<p>Récapitulatif de la vente : </p>
<img src="${product.image}" alt="" style="width: 300px; height: 300px"/>
<p>Titre : ${product.productTitle}</p>
<p>Catégorie : ${product.categorie}</p>
<p>Prix protection acheteur : ${product.prixProtectionAcheteur} €</p>
<p>Prix : ${product.prix} €</p>
<p>Livraison: ${product.livraison}</p>
<p>Total: ${product.total} €</p>
</div>
<p>N'hésitez pas à revenir sur l'application pour effectuer de nouvelles ventes ! </p>
<br>
<p style="color: red">L'équipe KVal Occaz vous remercie de votre confiance</p>
<img src="https://firebasestorage.googleapis.com/v0/b/kval-occaz.appspot.com/o/documents%2Flogo_email.jpg?alt=media&token=6b82d695-231f-405f-84dc-d885312ee4da" alt="">
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

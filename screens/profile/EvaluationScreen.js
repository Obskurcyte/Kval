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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EvaluationScreen = (props) => {

    const [rating, setRating] = useState(null)
    const ratingCompleted = (rating) => {
        setRating(rating)
    }

    const product = props.route.params.product;
    console.log(product)
    console.log(rating)
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
                                    })
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
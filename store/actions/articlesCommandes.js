import firebase from "firebase";
export const GET_COMMANDES = 'GET_COMMANDES';

export const getCommandes = () => {
    return async dispatch => {
        await firebase.firestore()
            .collection('commandes')
            .doc(firebase.auth().currentUser.uid)
            .collection('userCommandes')
            .get()
            .then(snapshot => {
                let mesCommandes = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id;
                    return { id, ...data}
                })
                dispatch({type: GET_COMMANDES, mesCommandes})
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
};


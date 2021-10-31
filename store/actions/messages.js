import firebase from "firebase";
export const GET_UNREAD_MESSAGES = 'GET_UNREAD_MESSAGES';

export const fetchUnreadMessage = () => {
    return async dispatch => {
        await firebase.firestore().collection(`users`)
            .doc(firebase.auth().currentUser.uid)
            .collection('unreadMessage')
            .get()
            .then(snapshot => {
                let unreadMessages = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id;
                    return { id, ...data}
                })
                dispatch({type: GET_UNREAD_MESSAGES, unreadMessages})
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
}

import firebase from "firebase";

export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';

export const fetchNotifs = () => {
  return async dispatch => {
    firebase.firestore()
      .collection('notifications')
      .doc(firebase.auth().currentUser.uid)
      .collection('listeNotifs')
      .get()
      .then(snapshot => {
        let notifs = snapshot.docs.map(doc => {
          const data = doc.data()
          const id = doc.id;
          return { id, ...data}
        })
        dispatch({type: GET_NOTIFICATIONS, notifs})
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
}

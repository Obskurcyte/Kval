import firebase from "firebase";
export const GET_ARTICLES = 'GET_ARTICLES';

export const getArticles = () => {
  return async dispatch => {
    await firebase.firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .get()
      .then(snapshot => {
        let mesVentes = snapshot.docs.map(doc => {
          const data = doc.data()
          const id = doc.id;
          return { id, ...data}
        })
        dispatch({type: GET_ARTICLES, mesVentes})
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
};


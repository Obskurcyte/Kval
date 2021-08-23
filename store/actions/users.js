import firebase from "firebase";
export const GET_USER = "GET_USER";

export const getUser = () => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let userData = doc.data();
          dispatch({ type: GET_USER, userData });
          console.log(userData);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
};

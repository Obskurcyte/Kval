import firebase from "firebase";
import algoliasearch from "algoliasearch";

const search_client = algoliasearch(
  "HIEE2VVF0O",
  "1af2b0e8c5a3abf13b530ed8c5b5e098"
);
const search_index = search_client.initIndex("products");

export const GET_PRODUCTS = "GET_PRODUCTS";
export const GET_PRODUCTS_BY_CAT = "GET_PRODUCTS_BY_CAT";
export const GET_PRODUCT_DETAIL = "GET_PRODUCT_DETAIL";
export const GET_PRODUCTS_BOOSTED = "GET_PRODUCTS_BOOSTED";

export const fetchProducts = (categorie) => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection("products")
      .where("categorie", "==", `${categorie}`)
      .get()
      .then((querySnapshot) => {
        let products = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          products.push({ id, ...data });
        });
        dispatch({ type: GET_PRODUCTS, products });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
};

export const fetchProductsByName = (query) => {
  console.log(query);
  return async (dispatch) => {
    /*await firebase
      .firestore()
      .collection(`Rênes`)
      .get()
      .then((snapshot) => {
        let products = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: GET_PRODUCTS, products });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
        dispatch({ type: GET_PRODUCTS, products: [] });
      });*/
    search_index.search(query).then(({ hits }) => {
      console.log(hits);
      dispatch({ type: GET_PRODUCTS, products: hits });
    });
  };
};

export const fetchProductsBoosted = () => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection("BoostedVentes")
      .get()
      .then((snapshot) => {
        let productsBoosted = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: GET_PRODUCTS_BOOSTED, productsBoosted });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
};

export const fetchProductDetail = (categorie, id) => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection(`${categorie}`)
      .doc(`${id}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let productDetail = doc.data();
          dispatch({ type: GET_PRODUCT_DETAIL, productDetail });
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

export const fetchProductsByCat = (categorie) => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection("Produits")
      .get()
      .then((snapshot) => {
        let products = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        console.log("produits", products);
        let filteredProducts = products.filter(
          (prod) => prod.categorie === categorie
        );
        dispatch({ type: GET_PRODUCTS_BY_CAT, filteredProducts });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
};

import {ADD_TO_CART, DELETE_CART, REMOVE_FROM_CART} from "../actions/cart";
import CartItem from "../../models/cart-item";

const initialState = {
  items: {},
  totalAmount: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.prix;
      const prodTitle = addedProduct.title;
      const pushToken = addedProduct.pushToken;
      const prodImage = addedProduct.downloadURL;
      const idVendeur = addedProduct.idVendeur;
      const pseudoVendeur = addedProduct.pseudoVendeur;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // already have item in cart
        updatedOrNewCartItem = new CartItem (
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          prodImage,
          pushToken,
          idVendeur,
          pseudoVendeur,
          state.items[addedProduct.id].quantity * prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(
          1,
          prodPrice,
          prodTitle,
          prodImage,
          pushToken,
            idVendeur,
            pseudoVendeur,
          prodPrice,

        )
      }
      return {
        ...state,
        items: {...state.items, [addedProduct.id] : updatedOrNewCartItem},
        totalAmount: state.totalAmount + prodPrice
      }
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid]
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.image,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = {...state.items, [action.pid] : updatedCartItem}
      } else {
        updatedCartItems = { ...state.items};
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      }
    case DELETE_CART:
      return initialState;
  }
  return state;
}

export default cartReducer;

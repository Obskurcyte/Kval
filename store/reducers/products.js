import {GET_PRODUCTS, GET_PRODUCTS_BY_CAT, GET_PRODUCT_DETAIL, GET_PRODUCTS_BOOSTED} from "../actions/products";

const initialState = {
  products: [],
  productsBoosted: [],
  filteredProducts: [],
  productDetail: {}
};


const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_PRODUCTS :
        return {
          products : action.products
        }
      case GET_PRODUCTS_BY_CAT : {
        return {
          ...state,
          filteredProducts: action.filteredProducts
        }
      }
      case GET_PRODUCTS_BOOSTED: {
        return {
          ...state,
          productsBoosted: action.productsBoosted
        }
      }
      case GET_PRODUCT_DETAIL : {
        return {
          ...state,
          productDetail: action.productDetail
        }
      }
    }
    return state;
}

export default productReducer;

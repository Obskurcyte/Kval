export const  ADD_TO_CART = 'ADD_TO_CART';
export const  REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const DELETE_CART = 'DELETE_CART';

export const addToCart = product => {
  console.log('product', product);
  return {type: ADD_TO_CART, product: product}
};

export const removeFromCart = productId => {
  console.log('productId', productId)
  return {type: REMOVE_FROM_CART, pid: productId}
};

export const deleteCart = () => {
  return {type: DELETE_CART}
}



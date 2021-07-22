class CartItem {
  constructor(quantity, productPrice, productTitle, image, pushToken, sum) {
      this.quantity = quantity;
      this.productPrice = productPrice;
      this.productTitle = productTitle;
      this.image = image;
      this.pushToken = pushToken;
      this.sum = sum
  }
}

export default CartItem

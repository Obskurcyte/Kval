class CartItem {
  constructor(quantity, productPrice, productTitle, image, pushToken, idVendeur, pseudoVendeur, categorie, weight, sum) {
      this.quantity = quantity;
      this.productPrice = productPrice;
      this.productTitle = productTitle;
      this.image = image;
      this.pushToken = pushToken;
      this.idVendeur = idVendeur;
      this.pseudoVendeur = pseudoVendeur;
      this.categorie = categorie;
      this.weigth = weight;
      this.sum = sum
  }
}

export default CartItem

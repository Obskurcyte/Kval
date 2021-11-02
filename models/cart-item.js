class CartItem {
  constructor(quantity, productPrice, productTitle, image, pushToken, idVendeur, pseudoVendeur, categorie, poids, livraison, sum) {
      this.quantity = quantity;
      this.productPrice = productPrice;
      this.productTitle = productTitle;
      this.image = image;
      this.pushToken = pushToken;
      this.idVendeur = idVendeur;
      this.pseudoVendeur = pseudoVendeur;
      this.categorie = categorie;
      this.poids = poids;
      this.livraison = livraison;
      this.sum = sum
  }
}

export default CartItem

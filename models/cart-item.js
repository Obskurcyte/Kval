class CartItem {
  constructor(quantity, productPrice, productTitle, image, pushToken, idVendeur, pseudoVendeur, emailVendeur, categorie, poids, livraison, sum, description, adresse) {
      this.quantity = quantity;
      this.productPrice = productPrice;
      this.productTitle = productTitle;
      this.image = image;
      this.pushToken = pushToken;
      this.idVendeur = idVendeur;
      this.pseudoVendeur = pseudoVendeur;
      this.emailVendeur = emailVendeur;
      this.categorie = categorie;
      this.poids = poids;
      this.livraison = livraison;
      this.sum = sum;
      this.description = description;
      this.adresse = adresse
  }
}

export default CartItem

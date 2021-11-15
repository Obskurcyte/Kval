export function get_mondial_relay_price(poids) {
  const prices = [4.4, 4.9, 6.3, 6.5, 6.9, 9.9, 11.9, 13.5, 17.9, 19.9, 24.9];
  const ranges = [0.5, 1, 2, 3, 4, 5, 7, 10, 15, 20, 30];
  if (Number(poids) <= 0.5) {
    return prices[0];
  }
  for (let k = 0; k < prices.length - 1; k++) {
    if (Number(poids) > ranges[k] && Number(poids) <= ranges[k + 1]) {
      console.log("test");
      return prices[k + 1];
    }
  }
  return "Veuillez nous contacter";
}

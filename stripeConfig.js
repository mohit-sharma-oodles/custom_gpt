import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_test_51PlC4URwqb2YI3cE1hRGKpPaY3r3bjfEsA8sHudCAhpPn56rGSNBbXb6gnUBYespPGdL04Ryr7Yro4n1nh5CQ5FU00Wa2naa2V"
    );
  }
  return stripePromise;
};

export default getStripe;

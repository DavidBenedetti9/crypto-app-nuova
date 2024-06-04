import axios from "axios";
import { CRYPTO } from "../mocks/crypto-mock";
import { CRYPTOREALE } from "../mocks/mock-reale";

async function getCrypto() {
  const headers = {
    headers: {
      "X-CMC_PRO_API_KEY ": "67b8763c-021c-40aa-8ef7-e3e6b8a81b15",
    },
  };
  try {
    // const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', headers);
    const response = await CRYPTOREALE;
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getEuro() {
  try {
    const response = await axios.get(
      "https://api.frankfurter.app/latest?from=USD&to=EUR"
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const CryptoApi = {
  getCrypto: getCrypto,
  getEuro: getEuro,
};

export default CryptoApi;

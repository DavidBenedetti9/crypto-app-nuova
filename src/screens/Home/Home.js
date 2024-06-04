import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../GlobalStyle";
import CryptoApi from "../../api/CryptoApi";

import { useCrypto } from "../../Context/CryptoContext";

export default function Home() {
  const { cryptos, getCryptos, portfolio } = useCrypto();
  const [valorePortfolio, setValorePortfolio] = useState(0);
  const [cryptovalute, setCryptovalute] = useState([]);
  const [mostraTutto, setMostraTutto] = useState(false);

  const [euro, setEuro] = useState(0);
  const [valuta, setValuta] = useState("dollaro");

  const getEuros = async () => {
    try {
      const response = await CryptoApi.getEuro();
      if (response) {
        setEuro(response.rates.EUR);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const convertiValuta = (valuta) => {
    let saldo;
    if (valuta === "euro") {
      saldo = valorePortfolio * euro;
      setValuta("euro");
    } else {
      saldo = valorePortfolio / euro;
      setValuta("dollaro");
    }
    setValorePortfolio(saldo)
  };

  const accorciaListaCripto = () => {
    const lista = mostraTutto ? cryptos.slice(0, 5) : cryptos.slice(0, 100);
    mostraTutto ? setMostraTutto(false) : setMostraTutto(true);

    setCryptovalute(lista);
  };

  // async function getCryptos() {
  //   try {
  //     const response = await CryptoApi.getCrypto();
  //     if (response) {
  //       setCryptos(response);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  function calcolaValorePortfolio() {
    let totale = 0;

    portfolio.map((moneta) => {
      console.log("moneta", moneta);
      const crypto = cryptos.find((item) => item.symbol === moneta.crypto);
      console.log("crypto", crypto);
      totale += moneta.quantita * crypto.quote.USD.price;
      console.log("totale", totale);
    });
    setValorePortfolio(totale);
  }

  useEffect(() => {
    getCryptos();
    getEuros();
  }, [getCryptos]);

  useEffect(() => {
    calcolaValorePortfolio();
  }, [portfolio]);

  useEffect(() => {
    const setListaIniziale = () => {
      const listaCrypto = cryptos.slice(0, 5);
      setCryptovalute(listaCrypto);
    };

    setListaIniziale();
  }, [cryptos]);

  return (
    <View style={GlobalStyles.container}>
      <View style={[styled.contenitorePortfolio]}>
        <Text style={GlobalStyles.testoGrigio}>Il mio saldo</Text>
        <TouchableOpacity
          onPress={() =>
            valuta === "dollaro"
              ? convertiValuta("euro")
              : convertiValuta("dollaro")
          }
        >
          <Text style={[GlobalStyles.testoBianco, GlobalStyles.testoGrande]}>
            {valuta === "dollaro" ? "$ " : "€ "}
            {valorePortfolio.toFixed(2)}
          </Text>
        </TouchableOpacity>
        <Text style={[GlobalStyles.testoBianco, { marginTop: 5 }]}>
          Valore Euro {euro.toFixed(3)}
        </Text>
      </View>
      <View style={styled.contenitoreLista}>
        <View style={styled.contenitoreTitolo}>
          <View>
            <Text style={[GlobalStyles.testoBianco, GlobalStyles.testoMedio]}>
              Elenco crypto
            </Text>
            <Text style={GlobalStyles.testoBianco}>
              Top {mostraTutto ? "100" : "5"}
            </Text>
          </View>

          <TouchableOpacity
            style={styled.contenitoreBtn}
            onPress={accorciaListaCripto}
          >
            <Text style={[GlobalStyles.testoBianco, GlobalStyles.testoPiccolo]}>
              {mostraTutto ? "Mostra meno" : "Mostra tutto"}
            </Text>
            <Ionicons
              name={mostraTutto ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {cryptovalute.map((moneta, index) => (
            <View style={styled.contenitoreCrypto} key={index}>
              <View>
                <Text
                  style={[GlobalStyles.testoMedio, GlobalStyles.testoBianco]}
                >
                  {moneta.symbol}
                </Text>
                <Text style={GlobalStyles.testoGrigio}>{moneta.name}</Text>
              </View>
              <View style={styled.contenitoreCrypto.contenitoreValore}>
                <Text
                  style={[GlobalStyles.testoMedio, GlobalStyles.testoBianco]}
                >
                  $ {moneta.quote.USD.price.toFixed(2)}
                </Text>
                <View style={styled.contenitoreChange}>
                  <Text style={GlobalStyles.testoGrigio}>24h </Text>
                  <Text
                    style={
                      moneta.quote.USD.percent_change_24h > 0
                        ? GlobalStyles.testoVerde
                        : GlobalStyles.testoRosso
                    }
                  >
                    {moneta.quote.USD.percent_change_24h.toFixed(2)}%{" "}
                  </Text>
                  <Text style={GlobalStyles.testoGrigio}> || 7d </Text>
                  <Text
                    style={
                      moneta.quote.USD.percent_change_7d > 0
                        ? GlobalStyles.testoVerde
                        : GlobalStyles.testoRosso
                    }
                  >
                    {moneta.quote.USD.percent_change_7d.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styled = StyleSheet.create({
  contenitorePortfolio: {
    padding: 20,
    backgroundColor: "#1D2A3D",
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "flex-start",
    height: 100,
    marginBottom: 20,
  },
  contenitoreLista: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#1D2A3D",
    width: "100%",
  },
  contenitoreTitolo: {
    backgroundColor: "#1D2A3D",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  contenitoreBtn: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  contenitoreCrypto: {
    backgroundColor: "#1D2A3D",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    borderBottomColor: "#3F3F3F",
    borderBottomWidth: 0.5,

    contenitoreValore: {
      alignItems: "flex-end",
    },
  },
  contenitoreChange: {
    flexDirection: "row",
  },
  bordo: {
    borderColor: "red",
    borderWidth: 1,
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { GlobalStyles } from "../../GlobalStyle";
import { useCrypto } from "../../Context/CryptoContext";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";


export default function Portfolio() {
  const {
    cryptos,
    getCryptos,
    portfolio,
    setPortfolio,
    salvaPortfolio,
    rimuoviPortfolio,
    nuovoPortfolio,
  } = useCrypto();

  const [valoriSelect, seValoriSelect] = useState([]);

  const [quantita, setQuantita] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");

  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  function filtraCrypto() {
    //il map entra dentro l'oggetto cryptos e si prenderà tutti i valori interni e mi faccio restituire solo un valore, in questo caso moneta.symbol
    const cryptoFiltrate = cryptos.map((moneta) => moneta.symbol);
    seValoriSelect(cryptoFiltrate);
  }

  function aggiungiAlPortfolio() {
    const indiceEsistente = portfolio.findIndex(
      (moneta) => moneta.crypto === selectedCrypto
    );

    if (indiceEsistente >= 0) {
      //la crypto esiste già nel portfolio, dobbiamo aggiornare la quantità
      const nuovoPortfolio = portfolio.map((item, index) => {
        if (index === indiceEsistente) {
          return {
            ...item,
            quantita: (
              parseFloat(item.quantita.replace(",", ".")) +
              parseFloat(quantita.replace(",", "."))
            )
              .toString()
              .replace(".", ","),
          };
        }
        return item;
      });
      salvaPortfolio(nuovoPortfolio);
    } else {
      //la crypto non c'è nel portfolio
      salvaPortfolio([...portfolio, { crypto: selectedCrypto, quantita }]);
    }
    //resetto
    setSelectedCrypto("");
    setQuantita("");
  }

  useEffect(() => {
    getCryptos();
    if (cryptos.length) {
      filtraCrypto();
    }
  }, [cryptos, getCryptos]);

  useEffect(() => {
   setIsButtonEnabled(quantita.length > 0 && selectedCrypto !== "")
  }, [quantita, selectedCrypto]);

  return (
    <View style={styled.container}>
      <View style={styled.icona}>
        <Ionicons name={"wallet-outline"} size={42} color="white" />
        <Text style={styled.portfolio}>Portfolio</Text>
      </View>
      <View style={styled.portfolioContainer}>
        {portfolio.map((moneta, index) => (
          <View key={index} style={styled.quantitaCrypto}>
            <Text style={styled.cryptoText}>
              {moneta.quantita} {moneta.crypto}
            </Text>
          </View>
        ))}
      </View>

      <View style={styled.inputContainer}>
        <Text style={styled.label}>Quantità:</Text>
        <TextInput
          style={styled.input}
          keyboardType="numeric"
          placeholder="Quantità:"
          placeholderTextColor="#8e8e8e"
          value={quantita}
          onChangeText={(text) => {
            const filteredInput = text.replace(/[^0-9.]/g, "");
            setQuantita(filteredInput);
          }}
        />
        <Picker
          selectedValue={selectedCrypto}
          style={styled.picker}
          onValueChange={(itemValue) => setSelectedCrypto(itemValue)}
        >
          <Picker.Item label="Seleziona crypto" value="" />
          {valoriSelect.map((crypto, index) => (
            <Picker.Item key={index} label={crypto} value={crypto} />
          ))}
        </Picker>
        <View style={[styled.btn, {opacity: isButtonEnabled ? 1 : 0.3}]}>
          <Button title="Aggiungi Crypto" onPress={aggiungiAlPortfolio} color="#FF9900" disabled={!isButtonEnabled}/>
        </View>
      </View>
      <View style={styled.btn}>
        <Button title="Svuota portfolio" onPress={rimuoviPortfolio} color="#A05A2C" />
      </View>
    </View>
  );
}

const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D2A3D",
    alignItems: "center",
    padding: 20,
  },
  icona: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: 'center',
  },
  portfolio: {
    marginLeft: 10,
    fontSize: 30,
    color: 'white',
  },
  portfolioContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  quantitaCrypto: {
    marginBottom: 10,
  },
  cryptoText: {
    fontSize: 24,
    color: 'white',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  label: {
    alignSelf: 'flex-start',
    color: 'white',
    marginBottom: 5,
    marginLeft: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#8e8e8e',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'white',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
    backgroundColor: '#1c1c1c',
    borderRadius: 5,
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    marginVertical: 10,
  }
});
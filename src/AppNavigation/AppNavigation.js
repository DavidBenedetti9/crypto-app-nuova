import * as React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home/Home";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { useCrypto } from "../Context/CryptoContext";
import Portfolio from "../screens/Portfolio/Portfolio";

const Drawer = createDrawerNavigator();

export default function AppNavigation() {
  const { getCryptos } = useCrypto();

  function reload() {
    getCryptos;
    console.log("Reload!");
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerRight: () => (
            <TouchableOpacity onPress={reload} style={{ marginRight: 15 }}>
              <Ionicons name="reload" size={22} color="white" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: "#0F141E" },
          headerTintColor: "yellow",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
            letterSpacing: 7,
          },
          title: "CRYPTO APP",
          headerTitleAlign: "center",
        }}
      >
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerLabel: "Lista",
            drawerLabelStyle: { fontSize: 16, color: "white" },
            drawerIcon: () => (
              <Ionicons name={"list"} size={20} color={"white"} />
            ),
          }}
        />
        <Drawer.Screen
          name="Portfolio"
          component={Portfolio}
          options={{
            drawerLabel: "PortFolio",
            drawerLabelStyle: { fontSize: 16, color: "white" },
            drawerIcon: () => (
              <Ionicons name={"wallet-outline"} size={20} color={"white"} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

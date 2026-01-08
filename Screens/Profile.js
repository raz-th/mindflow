import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "../Context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Profile() {
  const [name, setName] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();

  const styles = isDarkMode ? stylesDarkMode : stylesWhiteMode;

  const STORAGE_KEY_NAME = "@taskmind_first_time";

  useEffect(() => {
    // load saved notes on mount
    (async () => {
      try {
        const jsonName = await AsyncStorage.getItem(STORAGE_KEY_NAME);
        if (jsonName) {
          setName(JSON.parse(jsonName).name);
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  return (
    <View style={styles.cont}>
      <View style={styles.hero}>
        <View
          style={{
            backgroundColor: isDarkMode ? "#111" : "#f9f9f9",
            borderRadius: 360,
            padding: 30,
          }}
        >
          <Feather name="user" size={50} color="#6b7280" />
        </View>
        <View>
          <Text style={[styles.text]}>{name}</Text>
        </View>
      </View>
      <Pressable onPress={toggleTheme} style={styles.card}>
        <Text style={[styles.text]}>Dark Mode</Text>
        <View
          style={[
            styles.switchCont,
            isDarkMode
              ? { backgroundColor: "#4d7ab7", alignItems: "flex-end" }
              : {},
          ]}
        >
          <View style={[styles.switchNob]} />
        </View>
      </Pressable>
    </View>
  );
}

const stylesWhiteMode = StyleSheet.create({
  cont: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    color: "#000",
  },
  hero: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    gap: 20,
  },
  card: {
    shadowColor: "#0000007a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchCont: {
    padding: 5,
    backgroundColor: "#cccccc",
    width: 55,
    borderRadius: 20,
  },
  switchNob: {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    borderRadius: 360,
  },
});

const stylesDarkMode = StyleSheet.create({
  cont: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1c1c1e",
  },
  text: {
    color: "#fff",
  },
  hero: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    gap: 20,
  },
  card: {
    shadowColor: "#cbcbcb7a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchCont: {
    padding: 5,
    backgroundColor: "#cccccc",
    width: 55,
    borderRadius: 20,
  },
  switchNob: {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    borderRadius: 360,
  },
});

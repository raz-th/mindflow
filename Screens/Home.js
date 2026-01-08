import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../Context/ThemeContext";



export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState("User");
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? stylesDarkMode : stylesWhiteMode;

  const nav = useNavigation();

  // const onToggle = (index, newValue) => {
  //   setTasks((prev) =>
  //     prev.map((t, i) => (i === index ? { ...t, value: newValue } : t))
  //   );
  // };

  const STORAGE_KEY_NOTES = "@taskmind_notes";
  const STORAGE_KEY_TASKS = "@taskmind_tasks";
  const STORAGE_KEY_NAME = "@taskmind_first_time";

  useEffect(() => {
    // load saved notes on mount
    (async () => {
      try {
        const jsonNotes = await AsyncStorage.getItem(STORAGE_KEY_NOTES);
        if (jsonNotes) {
          setNotes(JSON.parse(jsonNotes));
        }

        const jsonTasks = await AsyncStorage.getItem(STORAGE_KEY_TASKS);
        if (jsonTasks) {
          setTasks(JSON.parse(jsonTasks));
        }

        const jsonName = await AsyncStorage.getItem(STORAGE_KEY_NAME);
        if (jsonName) {
          setName(JSON.parse(jsonName).name);
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  const todayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const tomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <Pressable onPress={() => nav.navigate("Profile")}>
          <Feather name="user" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </Pressable>
      </View>
      <Text style={styles.helloText}>Hello, {name}</Text>

      <View style={styles.card}>
        <Text style={[{ fontSize: 20 }, styles.text]}>Today's tasks</Text>
        {tasks.filter((v) => v.day === todayString()).length > 0 ? (
          tasks
            .filter((v) => v.day === todayString())
            .map((task, index) => (
              <View key={index} style={styles.taskCont}>
                <Checkbox
                  color={task.value ? "#4d7ab7" : isDarkMode ? "#fff" : "#000"}
                  // onValueChange={(v) => onToggle(index, v)}
                  // value={t}
                  style={styles.checkbox}
                />
                <Text style={[styles.text]} numberOfLines={1} ellipsizeMode="tail">{task.title}</Text>
              </View>
            ))
        ) : (
          <Text style={[{ marginTop: 20 }, styles.text]}>
            No tasks for today :)
          </Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={[{ fontSize: 20 }, styles.text]}>Notes</Text>
        {notes.slice(0, 4).map((note, index) => (
          <View key={index} style={styles.taskCont}>
            <View style={styles.bullet} />
            <Text style={styles.noteText} numberOfLines={1} ellipsizeMode="tail">{note.title}</Text>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={[{ fontSize: 20 }, styles.text]}>Tomorrow's tasks</Text>
        {tasks.filter((v) => v.day === tomorrowString()).length > 0 ? (
          tasks
            .filter((v) => v.day === tomorrowString())
            .map((task, index) => (
              <View key={index} style={styles.taskCont}>
                <Checkbox
                  color={task.value ? "#4d7ab7" : isDarkMode ? "#fff" : "#000"}
                  // onValueChange={(v) => onToggle(index, v)}
                  // value={task.value}
                  style={styles.checkbox}
                />
                <Text style={[styles.text]} numberOfLines={1} ellipsizeMode="tail">{task.title}</Text>
              </View>
            ))
        ) : (
          <Text style={[{ marginTop: 20 }, styles.text]}>
            No tasks for today :)
          </Text>
        )}
      </View>
    </View>
  );
}

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  helloText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  taskCont: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  checkbox: {
    borderRadius: 90,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    maxWidth: '90%'
  },
  text:{
    maxWidth: "90%",
  }
});

const stylesWhiteMode = StyleSheet.create({
  ...commonStyles,
  container: { ...commonStyles.container, backgroundColor: "#fff" },
  helloText: { ...commonStyles.helloText, color: "#000" },
  card: {
    ...commonStyles.card,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
  },
  text: { ...commonStyles.text, color: "#000" },
  bullet: { ...commonStyles.bullet, backgroundColor: "#000" },
  noteText: { ...commonStyles.noteText, color: "#000" },
});

const stylesDarkMode = StyleSheet.create({
  ...commonStyles,
  container: { ...commonStyles.container, backgroundColor: "#1c1c1e" },
  helloText: { ...commonStyles.helloText, color: "#fff" },
  card: {
    ...commonStyles.card,
    backgroundColor: "#2c2c2e",
    shadowColor: "#000",
  },
  text: { ...commonStyles.text, color: "#fff" },
  bullet: { ...commonStyles.bullet, backgroundColor: "#fff" },
  noteText: { ...commonStyles.noteText, color: "#fff" },
});

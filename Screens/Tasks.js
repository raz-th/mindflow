import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../Context/ThemeContext";

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [day, setDay] = useState(null);

  const { isDarkMode } = useTheme();

  const styles = isDarkMode ? stylesDarkMode : stylesWhiteMode;

  const STORAGE_KEY = "@taskmind_tasks";

  const onToggle = (index, newValue) => {
    const next = tasks.map((t, i) =>
      i === index ? { ...t, value: newValue } : t
    );
    setTasks(next);
    persistTasks(next);
  };

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setTasks(JSON.parse(json));
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  const persistTasks = async (nextTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    } catch (e) {
      console.warn("Failed to save notes", e);
    }
  };

  const addTask = () => {
    if (!newTitle.trim() && !day) return;
    const next = [
      { title: newTitle || "Untitled", day: day, value: false },
      ...tasks,
    ];
    setTasks(next);
    persistTasks(next);
    setNewTitle("");
    setDay(null);
    setModalVisible(false);
  };

  const removeTask = (index) => {
    const next = tasks.filter((_, i) => i !== index);
    setTasks(next);
    persistTasks(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Tasks</Text>

      <Pressable
        style={[
          styles.card,
          { flexDirection: "row", alignItems: "center", gap: 10 },
        ]}
        onPress={() => {
          setModalVisible(true);
          setDay(null);
          setNewTitle("");
        }}
      >
        <Ionicons
          name="add-outline"
          size={24}
          color="#fff"
          style={{ padding: 5, backgroundColor: "#4d7ab7", borderRadius: 90 }}
        />
        <Text style={styles.text}>New Task</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={[{ fontSize: 20, marginBottom: 20 }, styles.text]}>Tasks List</Text>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <View key={index} style={styles.taskCont}>
              <View
                style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, position: 'relative' }}
              >
                <Checkbox
                  color={task.value ? "#4d7ab7" : isDarkMode ? "#fff" : "#000"}
                  onValueChange={(v) => onToggle(index, v)}
                  value={task.value}
                  style={styles.checkbox}
                />
                <Text style={styles.text}>{task.title}</Text>
              </View>
              <Pressable onPress={() => removeTask(index)}>
                <Text style={{ color: "#ff4444" }}>Delete</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={[{ textAlign: "center", marginTop: 20 }, styles.text]}>
            No tasks yet!
          </Text>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text
              style={[
                styles.text,
                { fontSize: 18, fontWeight: "600", marginBottom: 8 },
              ]}
            >
              New Task
            </Text>
            <TextInput
              placeholder="Title"
              placeholderTextColor={isDarkMode ? "#999" : "#ccc"}
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <Calendar
              theme={{
                calendarBackground: isDarkMode ? "#111" : "#fff",
                dayTextColor: isDarkMode ? "#fff" : "#000",
                monthTextColor: isDarkMode ? "#fff" : "#000",
                todayTextColor: "#4d7ab7",
              }}
              onDayPress={(d) => setDay(d.dateString)}
              markedDates={{
                [day]: { selected: true, selectedColor: "#4d7ab7" },
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 20,
                marginTop: 15,
              }}
            >
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{ color: isDarkMode ? "#aaa" : "#666" }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable onPress={addTask}>
                <Text style={{ color: "#4d7ab7", fontWeight: "600" }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const commonStyles = StyleSheet.create({
  checkbox: { borderRadius: 90 },
  taskCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 8 },
  text: {
    maxWidth: Dimensions.get("screen").width * 50/100,
  },
});

const stylesWhiteMode = StyleSheet.create({
  ...commonStyles,
  helloText: { fontSize: 35, fontWeight: "bold", color: "#000" },
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 30 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  text: { color: "#000", ...commonStyles.text},
  modalCard: { backgroundColor: "#fff", borderRadius: 10, padding: 16 },
  input: {
    ...commonStyles.input,
    borderColor: "#eee",
    backgroundColor: "#fff",
    color: "#000",
  },
});

const stylesDarkMode = StyleSheet.create({
  ...commonStyles,
  helloText: { fontSize: 35, fontWeight: "bold", color: "#fff" },
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: "#2c2c2e",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  text: { ...commonStyles.text, color: "#fff" },
  modalCard: { backgroundColor: "#1c1c1e", borderRadius: 10, padding: 16 },
  input: {
    ...commonStyles.input,
    borderColor: "#3a3a3c",
    backgroundColor: "#2c2c2e",
    color: "#fff",
  },
});

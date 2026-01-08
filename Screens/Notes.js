import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Import the hook
import { useTheme } from "../Context/ThemeContext";

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const { isDarkMode } = useTheme();

  const styles = isDarkMode ? stylesDarkMode : stylesWhiteMode;

  const STORAGE_KEY = "@taskmind_notes";

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setNotes(JSON.parse(json));
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  const persistNotes = async (nextNotes) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes));
    } catch (e) {
      console.warn("Failed to save notes", e);
    }
  };

  const addNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    const next = [
      { title: newTitle || "Untitled", content: newContent },
      ...notes,
    ];
    setNotes(next);
    persistNotes(next);
    setNewTitle("");
    setNewContent("");
    setModalVisible(false);
  };

  const removeNote = (index) => {
    const next = notes.filter((_, i) => i !== index);
    setNotes(next);
    persistNotes(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Notes</Text>

      <View style={styles.card}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        >
          <Ionicons
            name="add-outline"
            size={24}
            color="#fff"
            style={{ padding: 5, backgroundColor: "#4d7ab7", borderRadius: 90 }}
          />
          <Text style={styles.text}>New Note</Text>
        </Pressable>
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <View key={index} style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={[styles.text, { fontSize: 20, fontWeight: "bold" }]}
                >
                  {note.title}
                </Text>
                <Pressable onPress={() => removeNote(index)}>
                  <Text style={{ color: "#ff4444" }}>Delete</Text>
                </Pressable>
              </View>
              <Text style={styles.text}>{note.content}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.text, { textAlign: "center", marginTop: 40 }]}>
            You don’t have any notes yet—let’s add your first one!
          </Text>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text
              style={[
                styles.text,
                { fontSize: 18, fontWeight: "600", marginBottom: 8 },
              ]}
            >
              New Note
            </Text>
            <TextInput
              placeholder="Title"
              placeholderTextColor={isDarkMode ? "#999" : "#ccc"}
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Content"
              placeholderTextColor={isDarkMode ? "#999" : "#ccc"}
              value={newContent}
              onChangeText={setNewContent}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              multiline
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 20,
                marginTop: 10,
              }}
            >
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{ color: isDarkMode ? "#aaa" : "#666" }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable onPress={addNote}>
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

const commonStyles = {
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 8 },
};

const stylesWhiteMode = StyleSheet.create({
  ...commonStyles,
  helloText: { fontSize: 35, fontWeight: "bold", color: "#000" },
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 30 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: { color: "#000" },
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
    marginTop: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: { color: "#fff" },
  modalCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  input: {
    ...commonStyles.input,
    borderColor: "#3a3a3c",
    backgroundColor: "#2c2c2e",
    color: "#fff",
  },
});

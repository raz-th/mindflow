import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../Context/ThemeContext";

export default function CalendarScreen() {
  const [tasks, setTasks] = useState([]);
  const [toshow, setToShow] = useState(null);

  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? stylesDarkMode : stylesWhiteMode;

  const markedDates = () => {
    const marks = {};
    tasks.forEach((task) => {
      marks[task.date] = { ...(marks[task.date] || {}), marked: true, dotColor: "#4d7ab7" };
    });
    if (toshow) {
      marks[toshow] = { ...(marks[toshow] || {}), selected: true, selectedColor: "#4d7ab7" };
    }
    return marks;
  };

  const todayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const STORAGE_KEY = "@taskmind_tasks";

  useEffect(() => {
    const todayStr = todayString();
    setToShow(todayStr);
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const tasksBefore = JSON.parse(json);
          const newTasks = [];
          tasksBefore.forEach((newTask) => {
            const day = newTask.day;
            const title = newTask.title;
            if (!day) return;
            const existing = newTasks.find((t) => t.date === day);
            if (existing) {
              existing.list.push(title);
            } else {
              newTasks.push({ date: day, list: [title] });
            }
          });
          setTasks(newTasks);
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Calendar</Text>

      <Calendar
        style={styles.card}
        // 3. Update Calendar internal colors
        theme={{
          calendarBackground: isDarkMode ? "#2c2c2e" : "#f9f9f9",
          textSectionTitleColor: isDarkMode ? "#fff" : "#000",
          selectedDayBackgroundColor: "#4d7ab7",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#4d7ab7",
          dayTextColor: isDarkMode ? "#fff" : "#000",
          monthTextColor: isDarkMode ? "#fff" : "#000",
          arrowColor: "#4d7ab7",
        }}
        onDayPress={(date) => setToShow(date.dateString)}
        markedDates={markedDates()}
      />

      {toshow && (
        <View style={styles.card}>
          <Text style={[styles.text, { fontSize: 20, marginBottom: 10, fontWeight: '600' }]}>
            Tasks for {toshow === todayString() ? "today" : toshow}
          </Text>
          {tasks.filter((t) => t.date === toshow).length > 0 ? (
            tasks
              .filter((t) => t.date === toshow)[0]
              .list.map((task, index) => (
                <View key={index} style={styles.taskCont}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Checkbox
                      color={isDarkMode ? "#fff" : "#000"}
                      value={false}
                      style={styles.checkbox}
                    />
                    <Text style={styles.text}>{task}</Text>
                  </View>
                </View>
              ))
          ) : (
            <Text style={styles.text}>
              {todayString() === toshow
                ? "No tasks for today."
                : "No tasks for this day."}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

// --- COMMON STYLES PATTERN ---

const commonStyles = {
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
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
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  checkbox: {
    borderRadius: 90,
  },
  text:{
    maxWidth: Dimensions.get("screen").width * 70/100,
  }
};

const stylesWhiteMode = StyleSheet.create({
  ...commonStyles,
  container: { ...commonStyles.container, backgroundColor: "#fff" },
  helloText: { ...commonStyles.helloText, color: "#000" },
  card: { ...commonStyles.card, backgroundColor: "#f9f9f9", shadowColor: "#000" },
  text: { ...commonStyles.text, color: "#000" },
});

const stylesDarkMode = StyleSheet.create({
  ...commonStyles,
  container: { ...commonStyles.container, backgroundColor: "#1c1c1e" },
  helloText: { ...commonStyles.helloText, color: "#fff" },
  card: { ...commonStyles.card, backgroundColor: "#2c2c2e", shadowColor: "#000" },
  text: { ...commonStyles.text, color: "#fff" },
});
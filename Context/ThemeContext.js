import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_DARK_MODE = "@taskmind_dark_mode";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY_DARK_MODE);
      setIsDarkMode(saved === "true");
    })();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem(STORAGE_KEY_DARK_MODE, JSON.stringify(newValue));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
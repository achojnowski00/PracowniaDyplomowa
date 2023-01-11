import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const switchTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <ThemeContext.Provider value={[theme, switchTheme]}>
      {props.children}
    </ThemeContext.Provider>
  );
};

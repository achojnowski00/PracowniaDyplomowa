import React, { useContext, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { ThemeContext } from "./context/themeContext";
import { Header } from "./components/Header/Header";

// import { HomePage } from "./pages/Home";
// import { PageTwo } from "./pages/Page2";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { MainPage } from "./pages/MainPage/MainPage";

import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import { NotesContext } from "./context/notesContext";
import { BudgetContext } from "./context/budgetContext";
import { FilterContext } from "./context/filterContext";

import "./App.sass";
import "./Variables.scss";

const App = () => {
  const [token] = useContext(UserContext);
  const [theme, switchTheme] = useContext(ThemeContext);

  const [notesData, setNotesData, fetchNotes] = useContext(NotesContext);
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);
  const [
    month,
    setMonth,
    plusMonth,
    minusMonth,
    year,
    dateFrom,
    dateTo,
    transactionsData,
    balans,
    getTransactions,
    setYear,
  ] = useContext(FilterContext);

  // Chyba przenieść do budgetContext.jsx
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     reloadBudgets();
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <BrowserRouter>
      <div className={"page " + (theme === "dark" ? " page--dark" : "")}>
        {/* THEME SWITCH */}
        <div className="switchTheme" onClick={switchTheme}>
          <input
            type="checkbox"
            className={"switchTheme__track switchTheme__track--" + theme}
            checked={theme === "dark"}
            // This onChange is required to avoid console error
            // changing theme is handled by onClick on div
            onChange={() => {}}
            // DONT DELETE ^^^
          />
          <span className={"switchTheme__thumb switchTheme__thumb--" + theme}>
            {theme === "dark" ? (
              <DarkModeRoundedIcon />
            ) : (
              <LightModeRoundedIcon />
            )}
          </span>
        </div>
        {/* END OF THEME SWITCH */}

        {!token ? <AuthPage /> : <MainPage />}
      </div>
    </BrowserRouter>
  );
};

export default App;

// <Switch>
//  <Route path="/" exact component={HomePage} />
//  <Route path="/page2" exact component={PageTwo} />
//</Switch>

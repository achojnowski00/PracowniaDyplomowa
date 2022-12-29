import React, { useContext, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { BudgetContext } from "./context/budgetContext";
import { Header } from "./components/Header/Header";

// import { HomePage } from "./pages/Home";
// import { PageTwo } from "./pages/Page2";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { MainPage } from "./pages/MainPage/MainPage";

import "./App.sass";

const App = () => {
  const [token] = useContext(UserContext);
  const [budgetData, setBudgetData, currentBudget, setCurrentBudget] = useContext(BudgetContext);


  return (

    <BrowserRouter>
      <div className="page">
        {/* <Header title="Welcome to the app" /> */}

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

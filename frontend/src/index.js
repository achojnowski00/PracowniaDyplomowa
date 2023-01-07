import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import "bulma/css/bulma.min.css";
import "./index.scss";

import { UserProvider } from "./context/userContext";
import { BudgetProvider } from "./context/budgetContext";
import { FilterProvider } from "./context/filterContext";
import { ApiProvider } from "./context/apiContext";
import { ThemeProvider } from "./context/themeContext";

ReactDOM.render(
  <ThemeProvider>
    <ApiProvider>
      <UserProvider>
        <BudgetProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </BudgetProvider>
      </UserProvider>
    </ApiProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

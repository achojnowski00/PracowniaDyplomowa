import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import "bulma/css/bulma.min.css";
import "./index.scss";

import { UserProvider } from "./context/userContext";
import { BudgetProvider } from "./context/budgetContext";
import { FilterProvider } from "./context/filterContext";

ReactDOM.render(
  <UserProvider>
    <BudgetProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </BudgetProvider>
  </UserProvider>,
  document.getElementById("root")
);

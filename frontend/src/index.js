import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import "bulma/css/bulma.min.css";
import "./index.scss";

import { UserProvider } from "./context/userContext";
import { BudgetProvider } from "./context/budgetContext";
import { FilterProvider } from "./context/filterContext";
import { ApiProvider } from "./context/apiContext";

ReactDOM.render(
  <ApiProvider>
    <UserProvider>
      <BudgetProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </BudgetProvider>
    </UserProvider>
  </ApiProvider>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import "bulma/css/bulma.min.css";
import "./index.scss";

import { UserProvider } from "./context/userContext";
import { BudgetProvider } from "./context/budgetContext";

ReactDOM.render(
  <UserProvider>
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </UserProvider>,
  document.getElementById("root")
);

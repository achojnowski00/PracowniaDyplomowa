import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const BudgetContext = createContext("chuj");

export const BudgetProvider = (props) => {
  const [budgetData, setBudgetData] = useState("");
  const [currentBudget, setCurrentBudget] = useState("");

  useEffect(() => {
    console.table(budgetData, currentBudget);
  }, [currentBudget]);

  return (
    <BudgetContext.Provider
      value={[budgetData, setBudgetData, currentBudget, setCurrentBudget]}
    >
      {props.children}
    </BudgetContext.Provider>
  );
};

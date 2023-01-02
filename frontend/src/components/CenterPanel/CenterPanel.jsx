import React, { useContext } from "react";

import "./CenterPanel.sass";

import { CenterHeader } from "../CenterHeader/CenterHeader";
import { CenterFilter } from "../CenterFilter/CenterFilter";
import { CenterListOfTransactions } from "../CenterListOfTransactions/CenterListOfTransactions";
import { CenterAddNewTransaction } from "../CenterAddNewTransaction/CenterAddNewTransaction";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";

export const CenterPanel = () => {
  const [token, setToken, userdata, setUserdata] = useContext(UserContext);
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);

  return (
    <div className="centerPanel-wrapper">
      {/* Tutaj zmienić h1 na component z informacją zeby wybrać budzety */}
      {!currentBudget && <h1>Wybierz budżet</h1>}

      {currentBudget && (
        <div>
          <CenterHeader />
          <CenterFilter />
          <CenterAddNewTransaction />
          <CenterListOfTransactions />
        </div>
      )}
    </div>
  );
};

import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

import { UserContext } from "./userContext";
import swal from "sweetalert";

export const BudgetContext = createContext();

export const BudgetProvider = (props) => {
  const [budgetData, setBudgetData] = useState("");
  const [currentBudget, setCurrentBudget] = useState(
    localStorage.getItem("currentBudget") || ""
  );

  const [token, setToken, userdata, setUserdata] = useContext(UserContext);

  const reloadBudgets = async () => {
    axios
      .get("http://127.0.0.1:8000/api/budgets/get-all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserdata((prev) => {
          return {
            ...prev,
            budgets: res.data,
          };
        });
      })
      .catch((err) => {
        console.log("error reloadowania budżetu", err);
      });
  };

  useEffect(() => {
    localStorage.setItem("currentBudget", currentBudget);

    if (currentBudget === "") {
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/budgets/get-single/${currentBudget}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBudgetData(res.data);
        console.log(`Dane budżetu`, res.data);
      })
      .catch((err) => {
        console.log("error - fetch budgetData", err);
        swal("Coś poszło nie tak", "", "error", {
          button: "Zamknij",
          timer: 1000,
        });
      });
  }, [currentBudget]);

  return (
    <BudgetContext.Provider
      value={[
        budgetData,
        setBudgetData,
        currentBudget,
        setCurrentBudget,
        reloadBudgets,
      ]}
    >
      {props.children}
    </BudgetContext.Provider>
  );
};

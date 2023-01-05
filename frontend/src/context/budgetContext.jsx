import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { UserContext } from "./userContext";
import { ApiContext } from "./apiContext";

export const BudgetContext = createContext();

export const BudgetProvider = (props) => {
  const BACKEND_LINK = useContext(ApiContext);
  const [budgetData, setBudgetData] = useState("");
  const [currentBudget, setCurrentBudget] = useState(
    Number(localStorage.getItem("currentBudget")) || ""
  );

  const [token, setToken, userdata, setUserdata] = useContext(UserContext);

  const reloadBudgets = async () => {
    axios
      .get(`${BACKEND_LINK}/api/budgets/get-all`, {
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
      .get(`${BACKEND_LINK}/api/budgets/get-single/${currentBudget}`, {
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
        Swal.fire("Coś poszło nie tak", "", "error", {
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

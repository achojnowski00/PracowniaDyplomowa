import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

import { UserContext } from "./userContext";
import { BudgetContext } from "./budgetContext";

export const FilterContext = createContext();

export const FilterProvider = (props) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [balans, setBalans] = useState(0);

  const [transactionsData, setTransactionsData] = useState("");

  const [token, setToken, userdata, setUserdata] = useContext(UserContext);
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);

  const plusMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
      return;
    }
    setMonth(month + 1);
  };

  const minusMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
      return;
    }
    setMonth(month - 1);
  };

  const getTransactions = async () => {
    if (currentBudget === "") return;
    if (dateFrom === "") return;
    if (dateTo === "") return;

    await axios
      .get(
        `http://127.0.0.1:8000/api/transaction/get-all/${currentBudget}/${dateFrom}/${dateTo}`,
        {
          headers: {
            "Aplication-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("filterContext.jsx", res.data);
        setTransactionsData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // =====================================================================
  //
  //   UseEffect do zmiany daty od i do w zależności od miesiąca i roku
  //
  // =====================================================================
  useEffect(() => {
    if (month < 10) {
      setDateFrom(`${year}-0${month}-01T00:00:00`);
    } else {
      setDateFrom(`${year}-${month}-01T00:00:00`);
    }

    if (
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) &&
      month === 2
    ) {
      setDateTo(`${year}-0${month}-29T23:59:59`);
    } else if (month === 2) {
      setDateTo(`${year}-0${month}-28T23:59:59`);
    }

    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      if (month < 10) {
        setDateTo(`${year}-0${month}-31T23:59:59`);
      } else {
        setDateTo(`${year}-${month}-31T23:59:59`);
      }
    }

    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (month < 10) {
        setDateTo(`${year}-0${month}-30T23:59:59`);
      } else {
        setDateTo(`${year}-${month}-30T23:59:59`);
      }
    }
  }, [month]);

  // ===============================================================
  //
  //   UseEffect do pobierania transakcji po zmianie daty od i do
  //
  // ===============================================================
  useEffect(() => {
    setTransactionsData("");
    getTransactions();
  }, [dateFrom, dateTo, currentBudget]);

  useEffect(() => {
    if (transactionsData !== "") {
      let tmp = 0;
      transactionsData.forEach((transaction) => {
        if (transaction.isOutcome) {
          tmp -= transaction.amount;
        } else {
          tmp += transaction.amount;
        }
      });
      setBalans(tmp.toFixed(2).toString().replace(".", ","));
    }
  }, [transactionsData]);

  return (
    <FilterContext.Provider
      value={[
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
      ]}
    >
      {props.children}
    </FilterContext.Provider>
  );
};

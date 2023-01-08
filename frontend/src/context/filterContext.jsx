import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

import { UserContext } from "./userContext";
import { BudgetContext } from "./budgetContext";
import { ApiContext } from "./apiContext";

export const FilterContext = createContext();

export const FilterProvider = (props) => {
  const BACKEND_LINK = useContext(ApiContext);
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

  const returnDateFrom = (month, year) => {
    if (month < 10) {
      return `${year}-0${month}-01T00:00:00`;
    } else {
      return `${year}-${month}-01T00:00:00`;
    }
  };

  const returnDateTo = (mon, yea) => {
    if (((yea % 4 === 0 && yea % 100 !== 0) || yea % 400 === 0) && mon === 2) {
      return `${yea}-0${mon}-29T23:59:59`;
    } else if (mon === 2) {
      return `${yea}-0${mon}-28T23:59:59`;
    }

    if (
      mon === 1 ||
      mon === 3 ||
      mon === 5 ||
      mon === 7 ||
      mon === 8 ||
      mon === 10 ||
      mon === 12
    ) {
      if (mon < 10) {
        return `${yea}-0${mon}-31T23:59:59`;
      } else {
        return `${yea}-${mon}-31T23:59:59`;
      }
    }

    if (mon === 4 || mon === 6 || mon === 9 || mon === 11) {
      if (mon < 10) {
        return `${yea}-0${mon}-30T23:59:59`;
      } else {
        return `${yea}-${mon}-30T23:59:59`;
      }
    }
  };

  const setDateFromAndDateTo = () => {
    setDateFrom(returnDateFrom(month, year));
    setDateTo(returnDateTo(month, year));
  };

  const getTransactions = async () => {
    if (currentBudget === "") return;
    if (dateFrom === "") return;
    if (dateTo === "") return;

    await axios
      .get(
        `${BACKEND_LINK}/api/transaction/get-all/${currentBudget}/${dateFrom}/${dateTo}`,
        {
          headers: {
            "Aplication-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("lista transakcji", res.data);
        setTransactionsData(res.data);
      })
      .catch((err) => {
        console.log("error - fetch listy transakcji", err);
      });
  };

  // =====================================================================
  //
  //   UseEffect do zmiany daty od i do w zależności od miesiąca i roku
  //
  // =====================================================================
  useEffect(() => {
    setDateFromAndDateTo();
  }, [month]);

  // ===============================================================
  //
  //   UseEffect do pobierania transakcji po zmianie daty od i do
  //
  // ===============================================================
  useEffect(() => {
    setTransactionsData("");
    getTransactions();
    let interval = setInterval(() => {
      getTransactions();
    }, 10000);
    return () => clearInterval(interval);
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
        setYear,
      ]}
    >
      {props.children}
    </FilterContext.Provider>
  );
};

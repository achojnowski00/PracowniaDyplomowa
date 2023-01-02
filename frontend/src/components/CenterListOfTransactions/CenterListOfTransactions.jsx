import React, { useContext } from "react";

import "./CenterListOfTransactions.sass";

import CircularProgress from "@mui/material/CircularProgress";

import { SingleTransaction } from "../SingleTransaction/SingleTransaction";

import { FilterContext } from "../../context/filterContext";

export const CenterListOfTransactions = () => {
  const [
    month,
    setMonth,
    plusMonth,
    minusMonth,
    year,
    dateFrom,
    dateTo,
    transactionsData,
  ] = useContext(FilterContext);

  return (
    <ul className="transactions">
      {transactionsData === "" && (
        <div className="transactions__loading">
          <CircularProgress />
        </div>
      )}

      {transactionsData.length === 0 && transactionsData !== "" && (
        <div className="transactions__loading">
          <p>Brak transakcji w tym miesiącu</p>
        </div>
      )}
      {transactionsData !== "" &&
        transactionsData !== [] &&
        transactionsData.map((transaction) => {
          return (
            <li key={transaction.id}>
              <SingleTransaction
                amount={transaction.amount}
                category={transaction.category}
                date={transaction.date}
                description={transaction.description}
                id={transaction.id}
                isOutcome={transaction.isOutcome}
                title={transaction.title}
                who_created={transaction.who_created}
              />
            </li>
          );
        })}
    </ul>
  );
};

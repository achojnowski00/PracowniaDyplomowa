import React from "react";

export const SingleBudget = () => {
  return (
    <li
      key={budget.id}
      className={
        currentBudget === budget.id
          ? "leftPanel__list-item leftPanel__list-item--active"
          : "leftPanel__list-item"
      }
      onClick={() => {
        setCurrentBudget(budget.id);
      }}
    >
      {budget.name}
    </li>
  );
};

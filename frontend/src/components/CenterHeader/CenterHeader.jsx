import React, { useContext, useState } from "react";
import "./CenterHeader.sass";

import { ShowMorePopup } from "../ShowMorePopup/ShowMorePopup";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { BudgetContext } from "../../context/budgetContext";

export const CenterHeader = () => {
  const [budgetData, setBudgetData, currentBudget, setCurrentBudget] =
    useContext(BudgetContext);

  const [showMore, setShowMore] = useState(false);

  const handleSwitchShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <header className="centerHeader">
      <h1 className="centerHeader__title">{budgetData.name}</h1>
      <div className="centerHeader__controls">
        <div
          className="controls__icon controls__icon--more"
          onClick={handleSwitchShowMore}
        >
          <MoreVertIcon />
        </div>
        {showMore && (
          <div className="controls__popup">
            <ShowMorePopup turnOffShowMore={handleSwitchShowMore} />
          </div>
        )}
      </div>
    </header>
  );
};

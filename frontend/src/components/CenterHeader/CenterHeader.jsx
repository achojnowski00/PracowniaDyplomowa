import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./CenterHeader.sass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ShowMorePopup } from "../ShowMorePopup/ShowMorePopup";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";

import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";
import { FilterContext } from "../../context/filterContext";

export const CenterHeader = () => {
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);
  const [token, setToken, userdata, setUserdata] = useContext(UserContext);
  const [, , , , , , , , balans] = useContext(FilterContext);

  const [showMore, setShowMore] = useState(false);
  const [wantChangeBudgetName, setWantChangeBudgetName] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState(budgetData.name);

  const handleSwitchShowMore = () => {
    setShowMore(!showMore);
  };

  const handleSubmitChangeBudgetName = async () => {
    if (newBudgetName === "") {
      Swal.fire("wprowadzileś pustą nazwę", "", "error", {
        buttons: false,
        timer: 1000,
      });
      return;
    }

    if (newBudgetName === budgetData.name) {
      setWantChangeBudgetName(false);
      toast.info("Nie wprowadzono żadnych zmian", {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        position: "bottom-right",
      });
      return;
    }

    if (newBudgetName.length > 32) {
      setNewBudgetName(newBudgetName.slice(0, 32));
    }

    await axios
      .put(
        `http://127.0.0.1:8000/api/budgets/edit/${currentBudget}`,
        {
          name: newBudgetName,
        },
        {
          headers: {
            "Aplication-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setBudgetData({ ...budgetData, name: newBudgetName });
        reloadBudgets();
        setWantChangeBudgetName(false);
        toast.success("Nazwa budżetu została zmieniona", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
      })
      .catch((err) => {
        Swal.fire("Wystąpił błąd", "", "error", {
          buttons: false,
          timer: 1000,
        });
      });
  };

  return (
    <>
      <ToastContainer />
      <header className="centerHeader">
        {!wantChangeBudgetName && (
          <p
            onClick={() => {
              setWantChangeBudgetName(true);
              setNewBudgetName(budgetData.name);
            }}
            className="centerHeader__title"
          >
            {budgetData.name}
          </p>
        )}
        {wantChangeBudgetName && (
          <form>
            <input
              className="centerHeader__input"
              type="text"
              value={newBudgetName}
              onChange={(e) => setNewBudgetName(e.target.value)}
              autoFocus
              maxLength="32"
            />
            <div className="centerHeader__controls">
              <button
                className="centerHeader__button centerHeader__button--save"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmitChangeBudgetName();
                }}
              >
                <DoneIcon />
              </button>
              <button
                className="centerHeader__button centerHeader__button--clear"
                onClick={(e) => {
                  e.preventDefault();
                  setNewBudgetName(budgetData.name);
                  setWantChangeBudgetName(false);
                }}
              >
                <ClearIcon />
              </button>
            </div>
          </form>
        )}

        <p className="centerHeader__balans">{balans} zł</p>

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
    </>
  );
};

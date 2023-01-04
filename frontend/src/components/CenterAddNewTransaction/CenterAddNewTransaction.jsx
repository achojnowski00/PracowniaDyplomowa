import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";

import "./CenterAddNewTransaction.sass";

import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";
import { FilterContext } from "../../context/filterContext";

export const CenterAddNewTransaction = () => {
  const [token, setToken, userdata, setUserdata] = useContext(UserContext);
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);
  const [, , , , , , , , , getTransactions] = useContext(FilterContext);

  const [wantAdd, setWantAdd] = useState(false);
  const [categories, setCategories] = useState("");
  const [titleState, setTitleState] = useState("");
  const [descriptionState, setDescriptionState] = useState("");
  const [amountState, setAmountState] = useState("");
  const [categoryState, setCategoryState] = useState("");
  const [isOutcomeState, setIsOutcomeState] = useState(true);

  const handleSwitchWantAdd = () => {
    setWantAdd(!wantAdd);
  };

  const fetchCategories = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/categories/get-all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log("error pobierania kategorii (edycja posta)", err);
      });
  };

  useEffect(() => {
    if (!wantAdd) {
      return;
    }
    fetchCategories();
  }, [wantAdd]);

  const handleChangeInput = (e, what) => {
    if (what === "title") {
      setTitleState(e.target.value);
      return;
    }
    if (what === "description") {
      setDescriptionState(e.target.value);
      return;
    }
    if (what === "amount") {
      setAmountState(e.target.value);
      return;
    }
    if (what === "category") {
      setCategoryState(e.target.value);
      return;
    }
  };

  const handleSwitchIsOutcome = () => {
    setIsOutcomeState(!isOutcomeState);
    setCategoryState("");
  };

  const resetValues = () => {
    setTitleState("");
    setDescriptionState("");
    setAmountState("");
    setCategoryState("");
    setIsOutcomeState(true);
  };

  const submitNewTransaction = async () => {
    if (titleState === "") {
      swal("Wpisz tytuł", "", "error", {
        buttons: false,
        timer: 1500,
      });
      return;
    }

    if (amountState === "") {
      swal("Wpisz kwotę", "", "error", {
        buttons: false,
        timer: 1500,
      });
      return;
    }

    if (categoryState === "") {
      swal("Wybierz kategorię", "", "error", {
        buttons: false,
        timer: 1500,
      });
      return;
    }

    await axios
      .post(
        "http://127.0.0.1:8000/api/transaction/create",
        {
          isOutcome: isOutcomeState,
          title: titleState,
          description: descriptionState,
          amount: amountState,
          budget_id: currentBudget,
          category_id: categoryState,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Dodano nową transakcję", {
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getTransactions();
        resetValues();
        setTimeout(() => {
          setWantAdd(false);
        }, 500);
      })
      .catch((err) => {
        console.log("error dodawania posta", err);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="newPost">
        <AddCardRoundedIcon className="newPost__icon" />
        <button className="newPost__btn" onClick={handleSwitchWantAdd}>
          Dodaj nową transakcję
        </button>
      </div>

      {wantAdd && (
        <>
          <div
            onClick={handleSwitchWantAdd}
            className="newPost__popup-background"
          ></div>
          <div
            className={
              isOutcomeState
                ? "newPost__popup newPost__popup--out"
                : "newPost__popup newPost__popup--in"
            }
          >
            <h1 className="newPost__popup-title">Dodaj nową transakcję</h1>
            <form className="newPost__popup-form">
              <TextField
                className="newPost__popup-form-input"
                value={titleState}
                onChange={(e) => {
                  handleChangeInput(e, "title");
                }}
                type="text"
                label="Tytuł transakcji"
                variant="standard"
              />
              <TextField
                className="newPost__popup-form-input newPost__popup-form-input--textarea "
                value={descriptionState}
                onChange={(e) => {
                  handleChangeInput(e, "description");
                }}
                type="text"
                label="Opis transakcji"
                variant="standard"
                multiline
              />
              <TextField
                className="newPost__popup-form-input"
                value={amountState}
                onChange={(e) => {
                  handleChangeInput(e, "amount");
                }}
                type="number"
                label="Kwota"
                variant="standard"
              />
              <div className="newPost__popup-form-flex">
                <button
                  className={
                    isOutcomeState
                      ? "popup__form-switch popup__form-switch--active"
                      : "popup__form-switch"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchIsOutcome();
                  }}
                >
                  Wydatek
                </button>
                <button
                  className={
                    !isOutcomeState
                      ? "popup__form-switch popup__form-switch--active"
                      : "popup__form-switch"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchIsOutcome();
                  }}
                >
                  Przychód
                </button>
              </div>
              <Select
                value={categoryState}
                onChange={(e) => {
                  handleChangeInput(e, "category");
                }}
                // label="Kategoria"
              >
                {categories &&
                  categories.map((category) => {
                    if (category.isOutcome === isOutcomeState) {
                      return (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                          {/* {category.id} */}
                        </MenuItem>
                      );
                    }
                  })}
              </Select>
              <div className="newPost__popup-form-controls">
                <button
                  className="newPost__popup-form-btn newPost__popup-form-btn--cancel"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchWantAdd();
                  }}
                >
                  Anuluj
                </button>
                <button
                  className="newPost__popup-form-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    submitNewTransaction();
                  }}
                >
                  Dodaj transakcję
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

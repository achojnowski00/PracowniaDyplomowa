import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

import "./CenterAddNewTransaction.sass";

import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";
import { FilterContext } from "../../context/filterContext";
import { ApiContext } from "../../context/apiContext";

export const CenterAddNewTransaction = () => {
  const popupRef = useRef();

  const BACKEND_LINK = useContext(ApiContext);
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
      .get(`${BACKEND_LINK}/api/categories/get-all`, {
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

    let handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setWantAdd(false);
      }
    };

    if (wantAdd) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
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

  const setCategoryToOutcome = () => {
    setIsOutcomeState(true);
    setCategoryState("");
  };

  const setCategoryToIncome = () => {
    setIsOutcomeState(false);
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
      Swal.fire("Wpisz tytuł", "", "error", {
        buttons: false,
        timer: 1000,
      });
      return;
    }

    if (amountState === "") {
      Swal.fire("Wpisz kwotę", "", "error", {
        buttons: false,
        timer: 1000,
      });
      return;
    }

    if (categoryState === "") {
      Swal.fire("Wybierz kategorię", "", "error", {
        buttons: false,
        timer: 1000,
      });
      return;
    }

    await axios
      .post(
        `${BACKEND_LINK}/api/transaction/create`,
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
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
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

  useEffect(() => {
    if (!popupRef.current) return;

    let handleClick = (e) => {
      if (!popupRef.current.contains(e.target)) {
        setWantAdd(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setWantAdd(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [wantAdd]);

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
          <div className="newPost__popup-background"></div>
          <div
            ref={popupRef}
            className={
              isOutcomeState
                ? "newPost__popup newPost__popup--out"
                : "newPost__popup newPost__popup--in"
            }
          >
            <div
              className="newPost__popup-close"
              onClick={(e) => {
                e.preventDefault();
                handleSwitchWantAdd();
              }}
            >
              <CloseRoundedIcon />
            </div>
            <h1 className="newPost__popup-title">Dodaj nową transakcję</h1>
            <form className="newPost__popup-form">
              <label className="newPost__popup-form-input-label">
                Tytuł transakcji
              </label>
              <input
                className="newPost__popup-form-input"
                value={titleState}
                onChange={(e) => {
                  handleChangeInput(e, "title");
                }}
                type="text"
              />
              <label className="newPost__popup-form-input-label">
                Opis transakcji
              </label>
              <textarea
                className="newPost__popup-form-input newPost__popup-form-input--textarea "
                value={descriptionState}
                onChange={(e) => {
                  handleChangeInput(e, "description");
                }}
                type="text"
              />
              <label className="newPost__popup-form-input-label">Kwota</label>
              <input
                className="newPost__popup-form-input newPost__popup-form-input--amount"
                value={amountState}
                onChange={(e) => {
                  handleChangeInput(e, "amount");
                }}
                type="number"
                label="Kwota"
                variant="standard"
              />
              <label className="newPost__popup-form-input-label newPost__popup-form-input-label--cat">
                Kategoria
              </label>
              <div className="newPost__popup-form-flex">
                <div
                  className={
                    isOutcomeState
                      ? "popup__form-switch popup__form-switch--out popup__form-switch--out-active"
                      : "popup__form-switch popup__form-switch--out"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    // handleSwitchIsOutcome();
                    setCategoryToOutcome();
                  }}
                >
                  Wydatek
                </div>
                <div
                  className={
                    !isOutcomeState
                      ? "popup__form-switch popup__form-switch--in popup__form-switch--in-active"
                      : "popup__form-switch popup__form-switch--in"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    // handleSwitchIsOutcome();
                    setCategoryToIncome();
                  }}
                >
                  Przychód
                </div>
              </div>
              <select
                value={categoryState}
                onChange={(e) => {
                  handleChangeInput(e, "category");
                }}
                className="newPost__popup-form-input newPost__popup-form-input--select"
              >
                <option value="" disabled>
                  Wybierz kategorię
                </option>
                {categories &&
                  categories.map((category) => {
                    if (category.isOutcome === isOutcomeState) {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    }
                  })}
              </select>
              <div className="newPost__popup-form-controls">
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

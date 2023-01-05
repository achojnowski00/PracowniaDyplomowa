import React, { useContext, useEffect } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { pl } from "date-fns/locale";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

import "./SingleTransaction.sass";

import { UserContext } from "../../context/userContext";
import { FilterContext } from "../../context/filterContext";
import { ApiContext } from "../../context/apiContext";

import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";

export const SingleTransaction = ({
  amount,
  category,
  date,
  description,
  id,
  isOutcome,
  title,
  who_created,
}) => {
  const BACKEND_LINK = useContext(ApiContext);
  const [token, , userdata] = useContext(UserContext);
  const [, , , , , , , , , getTransactions] = useContext(FilterContext);

  const [wantDelete, setWantDelete] = useState(false);
  const [wantEdit, setWantEdit] = useState(false);

  const [categories, setCategories] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newIsOutcome, setNewIsOutcome] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDate, setNewDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const setFirstCategoryFromList = async () => {
    if (categories === "") return;
    let filteredCategoriesBasedOnNewIsOutcome = await categories.filter(
      (cat) => cat.isOutcome === newIsOutcome
    );

    if (filteredCategoriesBasedOnNewIsOutcome[0]) {
      setNewCategory(filteredCategoriesBasedOnNewIsOutcome[0].id);
    }
  };

  const setStartingEditValues = () => {
    setNewTitle(title);
    setNewDescription(description);
    setNewAmount(amount);
    setNewIsOutcome(isOutcome);
    setNewCategory(category.id);
    setNewDate(date);
  };

  const resetEditValues = () => {
    setNewTitle("");
    setNewDescription("");
    setNewAmount("");
    setNewIsOutcome("");
    setNewCategory("");
    setNewDate("");
  };

  useEffect(() => {
    setFirstCategoryFromList();
  }, [newIsOutcome]);

  const handleWantDelete = () => {
    setWantDelete(!wantDelete);
  };

  const handleWantEdit = () => {
    setWantEdit(!wantEdit);
    setStartingEditValues();
  };

  const resetErrorMessage = () => {
    setErrorMessage("");
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
        console.log("error - pobieranie kategorii", err);
      });
  };

  const handleSubmitDelete = async (transactionID) => {
    await axios
      .delete(`${BACKEND_LINK}/api/transaction/delete/${transactionID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Transakcja została usunięta", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
        getTransactions();
      })
      .catch((err) => {
        console.log("error - usuwanie posta", err);
      });
  };

  const handleSubmitEdit = async (transactionID) => {
    if (newTitle === "") return setErrorMessage("Tytuł nie może być pusty");
    if (newAmount === "") return setErrorMessage("Kwota nie może być pusta");
    if (newCategory === "")
      return setErrorMessage("Kategoria nie może być pusta");
    if (newDate === "") return setErrorMessage("Data nie może być pusta");

    if (
      newTitle === title &&
      newDescription === description &&
      newAmount === amount &&
      newIsOutcome === isOutcome &&
      newCategory === category.id &&
      newDate === date
    ) {
      setWantEdit(false);
      resetEditValues();
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

    await axios
      .put(
        `${BACKEND_LINK}/api/transaction/edit/${transactionID}`,
        {
          isOutcome: newIsOutcome,
          title: newTitle,
          description: newDescription,
          amount: newAmount,
          category_id: newCategory,
          date: newDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Transakcja została zaktualizowana", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
        getTransactions();
        setWantEdit(false);
        resetEditValues();
      })
      .catch((err) => {
        console.log("error - edycja posta", err);
      });
  };

  const submitDelete = (e, transactionID) => {
    e.preventDefault();
    Swal.fire({
      title: "Czy na pewno chcesz usunąć transakcję?",
      text: "Nie będziesz mógł tego cofnąć",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        handleSubmitDelete(transactionID);
      }
    });
  };

  useEffect(() => {
    if (!wantEdit) {
      return;
    }
    fetchCategories();
  }, [wantEdit]);

  return (
    <>
      <ToastContainer />
      <div
        key={id}
        className={
          isOutcome
            ? "singleTransaction singleTransaction--outcome"
            : "singleTransaction singleTransaction--income"
        }
      >
        <div className="singleTransaction__header">
          <div className="singleTransaction__header-left">
            {isOutcome ? (
              <TrendingDownRoundedIcon className="singleTransaction__header-graph-icon singleTransaction__header-graph-icon--down" />
            ) : (
              <TrendingUpRoundedIcon className="singleTransaction__header-graph-icon singleTransaction__header-graph-icon--up" />
            )}
            <p className="singleTransaction__header-title">{title}</p>
          </div>
          {userdata.id === who_created.id && (
            <div className="singleTransaction__header-right">
              <div
                onClick={handleWantEdit}
                className="singleTransaction__header-icon singleTransaction__header-icon--edit"
              >
                <EditRoundedIcon />
              </div>
              <div
                // onClick={handleWantDelete}
                onClick={(e) => {
                  submitDelete(e, id);
                }}
                className="singleTransaction__header-icon singleTransaction__header-icon--delete"
              >
                <DeleteRoundedIcon />
              </div>
            </div>
          )}
        </div>
        <div className="singleTransaction__info">
          <p className="singleTransaction__info-user">{who_created.name}</p>
          <p className="singleTransaction__info-date">
            {formatRelative(new Date(date), new Date(), { locale: pl })}
          </p>
          <p className="singleTransaction__info-category">{category.name}</p>
        </div>
        <div className="singleTransaction__description">{description}</div>
        <div
          className={
            isOutcome
              ? "singleTransaction__amount singleTransaction__amount--outcome"
              : "singleTransaction__amount singleTransaction__amount--income"
          }
        >
          {isOutcome ? "-" : "+"}
          {amount.toFixed(2).toString().replace(".", ",")} zł
        </div>
      </div>

      {/* ================ */}
      {/*      POPUPY      */}
      {/* ================ */}
      {wantEdit && (
        <>
          <div onClick={handleWantEdit} className="popup__background"></div>
          <div className="popup">
            <h2 className="popup__title">Edytuj transakcję</h2>

            <form className="popup__form">
              <label className="popup__form-label" htmlFor="title">
                Tytuł transakcji
              </label>
              <input
                id="title"
                className="popup__form-input"
                value={newTitle}
                required
                onChange={(e) => {
                  resetErrorMessage();
                  setNewTitle(e.target.value);
                }}
                type="text"
                label="Tytuł transakcji"
                variant="standard"
              />
              <label className="popup__form-label" htmlFor="description">
                Opis transakcji
              </label>
              <textarea
                id="description"
                className="popup__form-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                multiline
              />
              <label className="popup__form-label" htmlFor="amount">
                Kwota (zł)
              </label>
              <input
                id="amount"
                className="popup__form-input"
                value={newAmount}
                required
                onChange={(e) => {
                  resetErrorMessage();
                  setNewAmount(e.target.value);
                }}
                type="number"
                label="Kwota"
                variant="standard"
              />

              <label className="popup__form-label" htmlFor="date">
                Data transakcji
              </label>
              <input
                id="date"
                type="datetime-local"
                className="popup__form-input popup__form-input--date"
                value={newDate}
                onChange={(e) => {
                  resetErrorMessage();
                  setNewDate(e.target.value);
                }}
              />

              <label className="popup__form-label" htmlFor="category">
                Kategoria
              </label>
              <div className="popup__form-flex">
                <button
                  className={
                    newIsOutcome
                      ? "popup__form-switch popup__form-switch--active"
                      : "popup__form-switch"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setNewIsOutcome(true);
                    setNewCategory("");
                  }}
                >
                  Wydatek
                </button>
                <button
                  className={
                    !newIsOutcome
                      ? "popup__form-switch popup__form-switch--active"
                      : "popup__form-switch"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setNewIsOutcome(false);
                    setNewCategory("");
                  }}
                >
                  Przychód
                </button>
              </div>

              <div className="popup__form-select-wrapper">
                <select
                  id="category"
                  className="popup__form-input popup__form-input--select"
                  value={Number(newCategory)}
                  required
                  onChange={(e) => {
                    resetErrorMessage();
                    setNewCategory(Number(e.target.value));
                  }}
                >
                  {categories &&
                    categories.map((category) => {
                      if (category.isOutcome === newIsOutcome) {
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        );
                      }
                    })}
                </select>
              </div>

              {errorMessage && <p className="popup__error">{errorMessage}</p>}
              <div className="popup__buttons">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleWantEdit();
                  }}
                  className="popup__btn popup__btn--cancel"
                >
                  Anuluj
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitEdit(id);
                  }}
                  className="popup__btn popup__btn--confirm"
                >
                  Edytuj
                </button>
              </div>

              {console.table("Nowe wartości edycji posta 🎅", {
                newTitle,
                newDescription,
                newAmount,
                newIsOutcome,
                newCategory,
                newDate,
              })}
            </form>
          </div>
        </>
      )}
    </>
  );
};

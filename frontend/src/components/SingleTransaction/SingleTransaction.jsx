import React, { useContext } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { pl } from "date-fns/locale";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

import "./SingleTransaction.sass";

import { UserContext } from "../../context/userContext";
import { FilterContext } from "../../context/filterContext";

import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { useEffect } from "react";

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

  const setStartingEditValues = () => {
    setNewTitle(title);
    setNewDescription(description);
    setNewAmount(amount);
    setNewIsOutcome(isOutcome);
    setNewCategory(category.id);
    setNewDate(date);
  };

  const handleWantDelete = () => {
    setWantDelete(!wantDelete);
  };

  const handleWantEdit = () => {
    setWantEdit(!wantEdit);
    setStartingEditValues();
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
        // console.log(err);
      });
  };

  const handleSubmitDelete = async (transactionID) => {
    await axios
      .delete(`http://127.0.0.1:8000/api/transaction/delete/${transactionID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Transakcja została usunięta");
        getTransactions();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitEdit = async (transactionID) => {
    console.log("SingleTransaction.jsx", newIsOutcome);
    console.log("SingleTransaction.jsx", newCategory);
    await axios
      .put(
        `http://127.0.0.1:8000/api/transaction/edit/${transactionID}`,
        {
          isOutcome: newIsOutcome,
          title: newTitle,
          description: newDescription,
          amount: newAmount,
          category_id: newCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success("Transakcja została zaktualizowana");
        getTransactions();
      })
      .catch((err) => {
        console.log(err);
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
                onClick={handleWantDelete}
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
      {wantDelete && (
        <>
          <div onClick={handleWantDelete} className="popup__background"></div>
          <div className="popup">
            <h2 className="popup__title">
              Czy na pewno chcesz usunąć transakcję?
            </h2>
            <h3 className="popup__subtitle">Tego nie da się cofnąć</h3>
            <div className="popup__buttons">
              <button
                onClick={handleWantDelete}
                className="popup__btn popup__btn--cancel"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleSubmitDelete(id)}
                className="popup__btn popup__btn--delete"
              >
                Usuń
              </button>
            </div>
          </div>
        </>
      )}

      {wantEdit && (
        <>
          <div onClick={handleWantEdit} className="popup__background"></div>
          <div className="popup">
            <h2 className="popup__title">Edytuj transakcję</h2>

            <form className="popup__form">
              <TextField
                className="popup__form-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                type="text"
                label="Tytuł transakcji"
                variant="standard"
              />
              <TextField
                className="popup__form-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                type="text"
                label="Opis transakcji"
                variant="standard"
              />
              <TextField
                className="popup__form-input"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                type="number"
                label="Kwota"
                variant="standard"
              />
              <div className="popup__form-flex">
                {newIsOutcome ? "Wydatek" : "Przychód"}
                <Checkbox
                  checked={newIsOutcome}
                  onChange={() => {
                    setNewIsOutcome(!newIsOutcome);
                    setNewCategory("");
                  }}
                />
              </div>

              <select
                value={Number(newCategory)}
                onChange={(e) => {
                  setNewCategory(Number(e.target.value));
                }}
              >
                {categories &&
                  categories.map((category) => {
                    if (category.isOutcome === newIsOutcome) {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                          {category.id}
                        </option>
                      );
                    }
                  })}
              </select>

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

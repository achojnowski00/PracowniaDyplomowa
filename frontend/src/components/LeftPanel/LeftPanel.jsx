import React, { useState, useContext, useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./LeftPanel.sass";

import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import LogoutIcon from "@mui/icons-material/Logout";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";

export const LeftPanel = () => {
  const [token, setToken, userdata, setUserdata] = useContext(UserContext);

  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);

  const [wantChangeName, setWantChangeName] = useState(false);
  const [newName, setNewName] = useState(userdata.name);

  const [wantAddBudget, setWantAddBudget] = useState(false);
  const [budgetName, setBudgetName] = useState("");

  const handlelogout = () => {
    swal("Wylogowano", "", "success", {
      button: "Zamknij",
      timer: 500,
    });
    setTimeout(() => {
      setToken(null);
      setUserdata("");
      setBudgetData("");
      setCurrentBudget("");
    }, 750);
  };

  const handleNameClick = () => {
    setNewName(userdata.name);
    setWantChangeName(!wantChangeName);
  };

  const handleCancelChangeName = () => {
    setWantChangeName(false);
  };

  const handleChangeName = async () => {
    if (newName === "") {
      swal("wprowadzileś pustą nazwę", "", "error", {
        button: "Zamknij",
        timer: 1000,
      });
      return;
    }

    setWantChangeName(!wantChangeName);
    setUserdata({ ...userdata, name: newName });
    await axios
      .put(
        "http://localhost:8000/api/users/update",
        {
          id: userdata.id,
          name: newName,
        },
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        swal(response.data.message, "", "success", {
          button: "Zamknij",
          timer: 1000,
        });
      })
      .catch((error) => {
        swal(error.response.data.message, "", "error");
      });
  };

  const handleWantAddBudget = () => {
    setWantAddBudget(!wantAddBudget);
    setBudgetName("");
  };

  const handleCreateBudget = async () => {
    if (budgetName === "") {
      swal("wprowadzileś pustą nazwę", "", "error", {
        button: "Zamknij",
        timer: 1000,
      });
      return;
    }

    await axios
      .post(
        "http://localhost:8000/api/budgets/create",
        {
          name: budgetName,
        },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCurrentBudget(response.data.id);
        reloadBudgets();
        setWantAddBudget(false);
        toast.success(`${budgetName} został utworzony`, {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        swal("Coś poszło nie tak", "", "error");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="leftPanel">
        {!wantChangeName && (
          <>
            <h1 onClick={handleNameClick} className="leftPanel__title">
              Cześć {userdata.name}!
            </h1>
            <p
              className="leftPanel__sub-title"
              onClick={() => {
                navigator.clipboard.writeText(userdata.id);
                toast.success("Skopiowano ID do schowka", {
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }}
            >
              Twoje ID:{" "}
              <span className="leftPanel__sub-title--ID">{userdata.id}</span>
            </p>
          </>
        )}

        {wantChangeName && (
          <h1 className="leftPanel__title">
            Cześć
            <form className="leftPanel__username-form">
              <input
                className="leftPanel__username-input"
                placeholder={newName ? newName : "wprowadz nazwę"}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                autoFocus
              ></input>
              <div className="leftPanel__buttons">
                <button
                  onClick={handleChangeName}
                  className="leftPanel__addBudget-btn"
                >
                  <DoneIcon />
                </button>

                <button
                  onClick={handleCancelChangeName}
                  className="leftPanel__addBudget-btn leftPanel__addBudget-btn--cancel"
                >
                  <ClearIcon />
                </button>
              </div>
            </form>
          </h1>
        )}

        {userdata.name === "Twoja nazwa użytkownika" && !wantChangeName && (
          <h6 className="leftPanel__info">
            Kliknij nazę użytkownika aby ją zmienić
          </h6>
        )}

        {!userdata && (
          <div className="leftPanel__loading">
            <CircularProgress />
          </div>
        )}
        {userdata.budgets && (
          <ul className="leftPanel__list">
            {userdata.budgets.map((budget) => {
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
            })}

            {!wantAddBudget && (
              <button
                className="leftPanel__addBudget"
                onClick={handleWantAddBudget}
              >
                Dodaj nowy budżet
              </button>
            )}

            {wantAddBudget && (
              <form>
                <input
                  className="leftPanel__addBudget-input"
                  placeholder="Wprowadz nazwę budżetu"
                  onChange={(e) => {
                    setBudgetName(e.target.value);
                  }}
                  autoFocus
                ></input>
                <div className="leftPanel__buttons">
                  <button
                    className="leftPanel__addBudget-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateBudget();
                    }}
                  >
                    <AddIcon />
                  </button>

                  <button
                    className="leftPanel__addBudget-btn leftPanel__addBudget-btn--cancel"
                    onClick={handleWantAddBudget}
                  >
                    <ClearIcon />
                  </button>
                </div>
              </form>
            )}
          </ul>
        )}

        <button className="leftPanel__logoutBtn" onClick={handlelogout}>
          <LogoutIcon />
          Wyloguj
        </button>
      </div>
    </>
  );
};

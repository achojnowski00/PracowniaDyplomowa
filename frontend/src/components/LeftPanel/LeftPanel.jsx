import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./LeftPanel.sass";

import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import LogoutIcon from "@mui/icons-material/Logout";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";
import { ApiContext } from "../../context/apiContext";
import { ThemeContext } from "../../context/themeContext";

export const LeftPanel = () => {
  const BACKEND_LINK = useContext(ApiContext);
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
    Swal.fire("Wylogowano", "", "success", {
      button: "Zamknij",
      timer: 500,
    });
    setTimeout(() => {
      setToken(null);
      setUserdata("");
      setBudgetData("");
      setCurrentBudget("");
    }, 250);
  };

  const handleNameClick = () => {
    setNewName(userdata.name);
    setWantChangeName(!wantChangeName);
  };

  const handleCancelChangeName = () => {
    setWantChangeName(false);
  };

  const handleChangeName = async (e) => {
    e.preventDefault();
    if (newName === "") {
      Swal.fire("wprowadzileś pustą nazwę", "", "error", {
        button: "Zamknij",
        timer: 1000,
      });
      return;
    }

    if (newName === userdata.name) {
      toast.info("Nie wprowadzono żadnych zmian", {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        position: "bottom-right",
      });
      setWantChangeName(false);
      return;
    }

    setWantChangeName(!wantChangeName);
    setUserdata({ ...userdata, name: newName });
    await axios
      .put(
        `${BACKEND_LINK}/api/users/update`,
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
        toast.success("Pomyślnie zmieniono nazwę użytkownika", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
      })
      .catch((error) => {
        Swal.fire(error.response.data.message, "", "error", {
          buttons: false,
          timer: 1000,
        });
      });
  };

  const handleWantAddBudget = () => {
    setWantAddBudget(!wantAddBudget);
    setBudgetName("");
  };

  const handleCreateBudget = async () => {
    if (budgetName === "") {
      Swal.fire("wprowadzileś pustą nazwę", "", "error", {
        buttons: false,
        timer: 1000,
      });
      return;
    }

    await axios
      .post(
        `${BACKEND_LINK}/api/budgets/create`,
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
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
      })
      .catch((error) => {
        Swal.fire("Coś poszło nie tak", "", "error", {
          buttons: false,
          timer: 1000,
        });
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
                  pauseOnHover: false,
                  draggable: true,
                  position: "bottom-right",
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
                value={newName}
                autoFocus
              ></input>
              <div className="leftPanel__buttons">
                <button
                  onClick={(e) => {
                    handleChangeName(e);
                  }}
                  className="leftPanel__addBudget-btn"
                >
                  <DoneIcon />
                </button>

                <button
                  onClick={(e) => {
                    handleCancelChangeName(e);
                  }}
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
                <AddRoundedIcon />
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

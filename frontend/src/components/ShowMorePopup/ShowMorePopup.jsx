import React, { useState, useContext } from "react";
import swal from "sweetalert";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./ShowMorePopup.sass";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const ShowMorePopup = ({ turnOffShowMore }) => {
  const [token, setToken, userdata, setUserdata] = useContext(UserContext);
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);

  const [wantAddUser, setWantAddUser] = useState(false);
  const [wantShowUsers, setWantShowUsers] = useState(false);
  const [wantLeaveBudget, setWantLeaveBudget] = useState(false);
  const [wantDeleteBudget, setWantDeleteBudget] = useState(false);

  const [userId, setUserId] = useState("");

  const reloadUsersInBudget = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/budgets/get-users/${currentBudget}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBudgetData((prev) => {
          return {
            ...prev,
            users: res.data,
          };
        });
      })
      .catch((err) => {
        console.log("error przy reloadowaniu userów", err);
      });
  };

  const handleSwitchAddUserPopup = () => {
    setWantAddUser(!wantAddUser);
  };

  const handleShowUsers = () => {
    setWantShowUsers(!wantShowUsers);
  };

  const handleLeaveBudget = () => {
    // setWantLeaveBudget(!wantLeaveBudget);
    swal({
      title: "Czy na pewno chcesz opuścić budżet?",
      text: "Aby do niego wrócić musisz zostać zaproszony przez innych użytkowników",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete && budgetData.users.length === 1) {
        swal({
          title: "Czy na pewno chcesz usunąć budżet?",
          text: "Nie będziesz mógł go odzyskać",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            deleteUserFromBudget(userdata.id).then(() => {
              setCurrentBudget("");
              reloadBudgets();
            });
          }
        });
      }

      if (willDelete && budgetData.users.length > 1) {
        deleteUserFromBudget(userdata.id).then(() => {
          setCurrentBudget("");
          reloadBudgets();
        });
      }
    });
  };

  const handleSubmitAddUser = async (e) => {
    if (userId === "") {
      e.preventDefault();
      swal("Nie podano ID użytkownika", "", "error", {
        buttons: false,
        timer: 1000,
      });
      return;
    }

    e.preventDefault();
    await axios
      .post(
        `http://127.0.0.1:8000/api/budgets/add-to-budget?budget_id=${currentBudget}&user_id=${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(`${response.data.name} został dodany do budżetu`, {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          setWantAddUser(false);
          turnOffShowMore();
          setUserId(null);
        }, 500);
      })
      .then(() => {
        reloadUsersInBudget();
      })
      .catch((error) => {
        swal(error.response.data.detail, "", "error", {
          buttons: false,
          timer: 1000,
        });
      });
  };

  const deleteUserFromBudget = async (user_id) => {
    await axios
      .delete(
        `http://127.0.0.1:8000/api/budgets/remove-user/${currentBudget}?user_id=${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(`${response.data.name} został usunięty z budżetu`, {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          setWantShowUsers(false);
          turnOffShowMore();
        }, 1500);
      })
      .then(() => {
        reloadUsersInBudget();
      })
      .catch((error) => {
        swal("Coś poszło nie tak", "", "error", {
          buttons: false,
          timer: 1000,
        });
      });
  };

  const handleDeleteFromBudget = (userID) => {
    swal({
      title: "Czy na pewno chcesz usunąć użytkownika z budżetu?",
      text: "Będziesz mógł zaprosić go ponownie",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteUserFromBudget(userID);
      }
    });
  }

  const handleSubmitLeaveBudget = () => {
    if (budgetData.users.length === 1) {
      setWantDeleteBudget(true);
    }

    if (budgetData.users.length !== 1) {
      deleteUserFromBudget(userdata.id).then(() => {
        setCurrentBudget("");
        reloadBudgets();
      });
    }
  };

  const handleDeleteBudget = async () => {
    deleteUserFromBudget(userdata.id).then(() => {
      setCurrentBudget("");
      reloadBudgets();
    });
  };

  return (
    <>
      <div className="showMorePopup">
        <ul className="showMorePopup__list">
          <li
            className="showMorePopup__list-item"
            onClick={handleSwitchAddUserPopup}
          >
            <PersonAddAlt1Icon />
            <span>Dodaj użytkownika</span>
          </li>
          <li className="showMorePopup__list-item" onClick={handleShowUsers}>
            <GroupsIcon />
            <span>Wyświetl użytkowników</span>
          </li>
          <li className="showMorePopup__list-item" onClick={handleLeaveBudget}>
            <ExitToAppIcon />
            <span>Opuść budżet</span>
          </li>
        </ul>

        {/* ============== */}
        {/*     POPUPY     */}
        {/* ============== */}
        {wantAddUser && (
          <>
            <div
              onClick={handleSwitchAddUserPopup}
              className="showMorePopup__background"
            ></div>
            <div className="showMorePopup__form">
              <form>
                <p className="showMorePopup__form-title">
                  Dodaj użytkownika do budżetu
                </p>
                <p className="showMorePopup__form-instruction">
                  Aby dodać użytkownika poproś go o jego ID które znajdzie przy
                  swoim nicku w lewym górnym rogu
                </p>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  type="number"
                  placeholder="Wpisz id użytkownika"
                  className="showMorePopup__form-input"
                  autoFocus
                />
                <div className="showMorePopup__box-controls">
                  <button
                    onClick={handleSubmitAddUser}
                    className="showMorePopup__form-btn"
                  >
                    Dodaj
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {wantShowUsers && (
          <>
            <ToastContainer />
            <div
              onClick={handleShowUsers}
              className="showMorePopup__background"
            ></div>
            <div className="showMorePopup__box">
              <p className="showMorePopup__box-title">Użytkownicy w budżecie</p>
              <ul className="showMorePopup__list showMorePopup__list--margined">
                {budgetData.users.map((user) => (
                  <li key={user.id} className="showMorePopup__list-item">
                    {user.id !== userdata.id && (
                      <HighlightOffIcon
                        className="showMorePopup__list-item-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteFromBudget(user.id);
                        }}
                      />
                    )}
                    <p
                      className={`showMorePopup__list-item-name 
                    ${user.id === userdata.id
                          ? "showMorePopup__list-item-name--bold"
                          : ""
                        }
                      `}
                    >
                      {user.name}
                      {user.id === userdata.id && " (Ty)"}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="showMorePopup__box-controls">
                <button
                  onClick={handleShowUsers}
                  className="showMorePopup__form-btn"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

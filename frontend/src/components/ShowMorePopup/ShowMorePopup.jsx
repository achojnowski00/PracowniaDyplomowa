import React, { useState, useContext } from "react";
import swal from "sweetalert";
import axios from "axios";

import "./ShowMorePopup.sass";

import { UserContext } from "../../context/userContext";
import { BudgetContext } from "../../context/budgetContext";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";

export const ShowMorePopup = ({ turnOffShowMore }) => {
  const [token, setToken, userdata, setUserdata] = useContext(UserContext);
  const [budgetData, setBudgetData, currentBudget, setCurrentBudget] =
    useContext(BudgetContext);

  const [wantAddUser, setWantAddUser] = useState(false);
  const [wantShowUsers, setWantShowUsers] = useState(false);
  const [wantDeleteBudget, setWantDeleteBudget] = useState(false);

  const [userId, setUserId] = useState("");

  const handleSwitchAddUserPopup = () => {
    setWantAddUser(!wantAddUser);
  };

  const handleShowUsers = () => {
    console.log("Wyświetl użytkowników");
  };

  const handleDeleteBudget = () => {
    console.log("Usuń budżet");
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
        swal(`${response.data.name} został dodany do budżetu`, "", "success", {
          buttons: false,
          timer: 1000,
        });
        setTimeout(() => {
          setWantAddUser(false);
          turnOffShowMore();
          setUserId(null);
        }, 1500);
      })
      .catch((error) => {
        swal(error.response.data.detail, "", "error", {
          buttons: false,
          timer: 1000,
        });
      });
  };

  return (
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
        <li className="showMorePopup__list-item" onClick={handleDeleteBudget}>
          <DeleteIcon />
          <span>Usuń budżet</span>
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
              />
              <button
                onClick={handleSubmitAddUser}
                className="showMorePopup__form-btn"
              >
                Dodaj
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

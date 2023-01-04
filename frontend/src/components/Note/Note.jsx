import React, { useContext, useState, useEffect } from "react";
import "./Note.sass";
import axios from "axios";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";

// Mui stuff
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";

// Context
import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";

export const Note = ({
  turnOff,
  callback,
  title = "",
  content = "",
  action,
}) => {
  // Context
  const [currentBudget] = useContext(BudgetContext);
  const [token] = useContext(UserContext);

  // States
  const [titleState, setTitleState] = useState(title);
  const [contentState, setContentState] = useState(content);

  // Handlers
  const handleTitleChange = (e) => {
    setTitleState(e.target.value);
  };

  const handleContentChange = (e) => {
    setContentState(e.target.value);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    submitAddNote();
  };

  const handleTurnOff = (e) => {
    e.preventDefault();
    turnOff();
  };

  const handleEditNote = (e) => {
    e.preventDefault();
    console.log("Edytuję notatkę");
  };

  // Axios
  const submitAddNote = async () => {
    await axios
      .post(
        "http://127.0.0.1:8000/api/notes/create",
        {
          title: titleState,
          description: contentState,
          budget_id: currentBudget.id,
        },
        {
          headers: {
            content_type: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success("Notatka została dodana");
        callback();
        setTimeout(() => {
          turnOff();
        }, 500);
      })
      .catch((err) => {
        console.log("error przy dodawaniu notatki", err);
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        onClick={() => {
          turnOff();
          console.log("Kliknąłem w tło");
        }}
        className="addNote__background"
      ></div>
      <div className="addNote">
        {/* <div className="addNote__title">Dodaj Notatkę</div> */}
        <form className="addNote__form">
          <input
            onChange={handleTitleChange}
            value={titleState}
            className="addNote__form-input addNote__form-input--title"
            type="text"
            placeholder="Tytuł notatki..."
            maxLength="32"
          />
          <textarea
            onChange={handleContentChange}
            value={contentState}
            className="addNote__form-input addNote__form-input--content"
            type="text"
            placeholder="Treść notatki..."
            spellCheck="false"
            linebreak="br"
          />
          {action === "add" && (
            <>
              <button
                className="addNote__form-btn"
                onClick={(e) => {
                  handleAddNote(e);
                }}
              >
                <LibraryAddOutlinedIcon />
                Dodaj notatkę
              </button>
            </>
          )}
          {action === "edit" && (
            <>
              <button
                className="addNote__form-btn"
                onClick={(e) => {
                  handleEditNote(e);
                }}
              >
                <BookmarkAddedOutlinedIcon />
                Zapisz
              </button>
            </>
          )}
          <button
            className="addNote__form-close-btn"
            onClick={(e) => {
              handleTurnOff(e);
            }}
          >
            <CloseRoundedIcon />
          </button>
        </form>
      </div>
    </>
  );
};

import React, { useContext, useState, useEffect } from "react";
import "./NotePopup.sass";
import axios from "axios";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";

// Mui stuff
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

// Context
import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";

export const NotePopup = ({
  turnOff,
  callback,
  title = "",
  content = "",
  action,
  id,
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
    submitEditNote();
  };

  const handleDeleteNote = (e) => {
    e.preventDefault();
    swal({
      title: "Czy na pewno chcesz usunąć notatkę?",
      text: "Nie będziesz mógł tego cofnąć",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        submitDeleteNote();
      }
    });
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
        toast.success("Notatka została dodana", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          position: "bottom-right",
        });
        callback();
        setTimeout(() => {
          turnOff();
        }, 500);
      })
      .catch((err) => {
        console.log("error przy dodawaniu notatki", err);
      });
  };

  const submitEditNote = async () => {
    if (titleState === title && contentState === content) {
      turnOff();
      return;
    }

    await axios
      .put(
        `http://127.0.0.1:8000/api/notes/edit/${id}`,
        {
          title: titleState,
          description: contentState,
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
        toast.success("Notatka została zaktualizowana");
        callback();
        setTimeout(() => {
          turnOff();
        }, 500);
      })
      .catch((err) => {
        console.log("error przy edycji notatki", err);
      });
  };

  const submitDeleteNote = async () => {
    await axios
      .delete(`http://127.0.0.1:8000/api/notes/delete/${id}`, {
        headers: {
          content_type: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Notatka została usunięta", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        callback();
        setTimeout(() => {
          turnOff();
        }, 500);
      })
      .catch((err) => {
        console.log("error przy usuwaniu notatki", err);
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
        <form className="addNote__form">
          {action === "edit" && (
            <>
              <div
                className="addNote__form-btn addNote__form-btn--delete"
                onClick={handleDeleteNote}
              >
                <DeleteRoundedIcon />
                Usuń
              </div>
            </>
          )}
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
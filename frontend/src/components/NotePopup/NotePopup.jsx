import React, { useContext, useState, useEffect, useRef } from "react";
import "./NotePopup.sass";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

// Mui stuff
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

// Context
import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";
import { ApiContext } from "../../context/apiContext";
import { NotesContext } from "../../context/notesContext";

export const NotePopup = ({
  turnOff,
  callback,
  title = "",
  content = "",
  action,
  id,
}) => {
  const popup = useRef();

  const BACKEND_LINK = useContext(ApiContext);
  // Context
  const [
    budgetData,
    setBudgetData,
    currentBudget,
    setCurrentBudget,
    reloadBudgets,
  ] = useContext(BudgetContext);
  const [token] = useContext(UserContext);
  const [notesData, setNotesData, fetchNotes] = useContext(NotesContext);

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
    Swal.fire({
      title: "Czy na pewno chcesz usunąć notatkę?",
      text: "Nie będziesz mógł tego cofnąć",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        submitDeleteNote();
      }
    });
  };

  // Axios
  const submitAddNote = async () => {
    console.log("😭", currentBudget);
    await axios
      .post(
        `${BACKEND_LINK}/api/notes/create`,
        {
          title: titleState,
          description: contentState,
          budget_id: currentBudget,
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
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
        fetchNotes();
        turnOff();
      })
      .catch((err) => {
        console.log("error przy dodawaniu notatki", err);
      });
  };

  const submitEditNote = async () => {
    if (titleState === title && contentState === content) {
      turnOff();
      toast.info("Nie dokonano żadnych zmian", {
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
        `${BACKEND_LINK}/api/notes/edit/${id}`,
        {
          title: titleState,
          description: contentState,
          date: new Date(),
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
        toast.success("Notatka została zaktualizowana", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          position: "bottom-right",
        });
        fetchNotes();
        turnOff();
      })
      .catch((err) => {
        console.log("error przy edycji notatki", err);
      });
  };

  const submitDeleteNote = async () => {
    await axios
      .delete(`${BACKEND_LINK}/api/notes/delete/${id}`, {
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
          position: "bottom-right",
        });
        fetchNotes();
        turnOff();
      })
      .catch((err) => {
        console.log("error przy usuwaniu notatki", err);
      });
  };

  useEffect(() => {
    if (!popup.current) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        turnOff();
      }
    };

    const handleClick = (e) => {
      if (!popup.current.contains(e.target)) {
        turnOff();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="addNote__background"></div>
      <div ref={popup} className="addNote">
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
            autoFocus
            onFocus={(e) => (e.target.selectionStart = e.target.value.length)}
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

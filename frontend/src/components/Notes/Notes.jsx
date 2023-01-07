import React, { useContext, useState, useEffect } from "react";
import "./Notes.sass";

// Mui stuff
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// Components
import { NotePopup } from "../NotePopup/NotePopup";
import { NoteDisplay } from "../NoteDisplay/NoteDisplay";

// Context
import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";
import { ApiContext } from "../../context/apiContext";
import { NotesContext } from "../../context/notesContext";
import axios from "axios";

export const Notes = () => {
  // States
  const [wantAddNote, setWantAddNote] = useState(false);
  const [notesData, setNotesData, fetchNotes] = useContext(NotesContext);

  // Handlers
  const handleSwitchWantAddNote = () => {
    setWantAddNote(!wantAddNote);
  };

  return (
    <>
      <div className="notes">
        <button onClick={handleSwitchWantAddNote} className="notes__btn">
          <AddRoundedIcon />
          Dodaj notatkę
        </button>
        {notesData && (
          <NoteDisplay notesData={notesData} fetchNotes={fetchNotes} />
        )}
      </div>

      {/* ================ */}
      {/*      POPUPY      */}
      {/* ================ */}
      {wantAddNote && (
        <NotePopup
          callback={fetchNotes}
          turnOff={handleSwitchWantAddNote}
          action="add"
        />
      )}
      {/* <AddNote turnOff={handleSwitchWantAddNote} /> */}
    </>
  );
};

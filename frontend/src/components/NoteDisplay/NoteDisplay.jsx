import React, { useContext, useState, useEffect } from "react";
import "./NoteDisplay.sass";

// Mui stuff
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CircularProgress from "@mui/material/CircularProgress";

// Components
import { NotePopup } from "../NotePopup/NotePopup";

export const NoteDisplay = ({ notesData, fetchNotes }) => {
  // States
  const [noteToEdit, setNoteToEdit] = useState();

  // Handlers

  return (
    <>
      <div className="noteDisplay">
        <ul className="noteDisplay__list">
          {!notesData && (
            <div className="noteDisplay__list-item--loading">
              <CircularProgress />
            </div>
          )}

          {notesData.length === 0 && (
            <li className="noteDisplay__list-item--empty">
              Brak notatek w budżecie
            </li>
          )}
          {notesData.map((note) => (
            <li
              onClick={() => setNoteToEdit(note)}
              className="noteDisplay__list-item"
              key={note.id}
            >
              <div className="noteDisplay__list-item-title">
                {note.title.length > 0
                  ? note.title
                  : note.description.length > 31
                  ? note.description.slice(0, 32) + "..."
                  : note.description}

                {note.title.length === 0 && note.description.length === 0 && (
                  <span className="noteDisplay__list-item-title--empty">
                    Pusta notatka
                  </span>
                )}
              </div>
              <EditRoundedIcon className="noteDisplay__list-item-icon" />
            </li>
          ))}
        </ul>
      </div>

      {noteToEdit && (
        <NotePopup
          turnOff={() => setNoteToEdit()}
          callback={fetchNotes}
          title={noteToEdit.title}
          content={noteToEdit.description}
          id={noteToEdit.id}
          action="edit"
        />
      )}
    </>
  );
};

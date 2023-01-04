import React, { useContext, useState, useEffect } from "react";
import "./Notes.sass";

// Mui stuff
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// Components
import { NotePopup } from "../NotePopup/NotePopup";

// Context
import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export const Notes = () => {
  // States
  const [wantAddNote, setWantAddNote] = useState(false);
  const [notesData, setNotesData] = useState();

  // Context
  const [currentBudget] = useContext(BudgetContext);
  const [token] = useContext(UserContext);

  // Handlers
  const handleSwitchWantAddNote = () => {
    setWantAddNote(!wantAddNote);
  };

  // Axios
  const fetchNotes = async () => {
    await axios
      .get(
        `http://127.0.0.1:8000/api/notes/get-all?budget_id=${currentBudget.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setNotesData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffects
  useEffect(() => {
    fetchNotes();
  }, [currentBudget]);

  return (
    <>
      <div className="notes">
        <button onClick={handleSwitchWantAddNote} className="notes__btn">
          <AddRoundedIcon />
          Dodaj notatkę
        </button>
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

import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

import { BudgetContext } from "./budgetContext";
import { UserContext } from "./userContext";
import { ApiContext } from "./apiContext";

export const NotesContext = createContext();

export const NotesProvider = (props) => {
  const [notesData, setNotesData] = useState([]);

  const [, , currentBudget] = useContext(BudgetContext);
  const [token] = useContext(UserContext);
  const BACKEND_LINK = useContext(ApiContext);

  // Axios
  const fetchNotes = async () => {
    console.log(`currentBudget`, currentBudget);
    if (!currentBudget) return;
    if (currentBudget === "") return;

    await axios
      .get(`${BACKEND_LINK}/api/notes/get-all?budget_id=${currentBudget}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNotesData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffects
  useEffect(() => {
    setNotesData([]);
    fetchNotes();
    let interval = setInterval(() => {
      fetchNotes();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentBudget]);

  return (
    <NotesContext.Provider value={[notesData, setNotesData, fetchNotes]}>
      {props.children}
    </NotesContext.Provider>
  );
};

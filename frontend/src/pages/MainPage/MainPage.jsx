import React, { useContext } from "react";

import { UserContext } from "../../context/userContext";

export const MainPage = () => {
  const [, setToken] = useContext(UserContext);

  const handlelogout = () => {
    setToken(null);
  };

  return (
    <div className="">
      <p>Strona</p>
      <button className="button is-danger" onClick={handlelogout}>
        Wyloguj
      </button>
    </div>
  );
};

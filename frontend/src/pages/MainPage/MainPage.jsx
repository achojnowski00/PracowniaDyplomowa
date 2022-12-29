import React, { useContext } from "react";

import { LeftPanel } from "../../components/LeftPanel/LeftPanel";

import { UserContext } from "../../context/userContext";

export const MainPage = () => {
  const [, setToken] = useContext(UserContext);

  const handlelogout = () => {
    setToken(null);
  };

  return (
    <div className="">
      <LeftPanel />
      
    </div>
  );
};

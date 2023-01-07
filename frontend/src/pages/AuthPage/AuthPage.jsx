import React, { useState, useContext } from "react";

import "./AuthPage.sass";
import joinUs from "./joinUs.svg";
import joinUsDark from "./joinUsDark.svg";

import { Register } from "../../components/Register/Register";
import { Login } from "../../components/Login/Login";

import { ThemeContext } from "../../context/themeContext";

export const AuthPage = () => {
  const [wantLogin, setWantLogin] = useState(true);

  const [theme] = useContext(ThemeContext);

  const handleSwitchAuth = () => {
    setWantLogin(!wantLogin);
  };

  return (
    <div className="authPage">
      {wantLogin ? (
        <div className="authbox">
          <Login />
          <div className="line"></div>
          <button className="buttonSwitch" onClick={handleSwitchAuth}>
            Nie mam konta
          </button>
        </div>
      ) : (
        <div className="authbox">
          <Register />
          <div className="line"></div>
          <button className="buttonSwitch" onClick={handleSwitchAuth}>
            Chcę się zalogować
          </button>
        </div>
      )}
      <img
        className="joinUsImg"
        src={theme === "light" ? joinUs : joinUsDark}
        alt="join us"
      />
      <svg
        className="authPage__wave"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="var(--primaryAccent)"
          fillOpacity="1"
          d="M0,32L26.7,53.3C53.3,75,107,117,160,117.3C213.3,117,267,75,320,80C373.3,85,427,139,480,160C533.3,181,587,171,640,144C693.3,117,747,75,800,80C853.3,85,907,139,960,181.3C1013.3,224,1067,256,1120,266.7C1173.3,277,1227,267,1280,218.7C1333.3,171,1387,85,1413,42.7L1440,0L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

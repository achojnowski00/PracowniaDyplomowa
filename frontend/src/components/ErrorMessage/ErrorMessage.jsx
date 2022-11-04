import React from "react";

import "./ErrorMessage.sass";

export const ErrorMessage = ({ message }) => {
  return <p className="errorMessage">{message}</p>;
};

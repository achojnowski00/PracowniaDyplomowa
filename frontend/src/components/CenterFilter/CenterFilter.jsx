import React, { useContext } from "react";
import "./CenterFilter.sass";

import { FilterContext } from "../../context/filterContext";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export const CenterFilter = () => {
  const [month, setMonth, plusMonth, minusMonth, year, dateFrom, dateTo] =
    useContext(FilterContext);

  return (
    <div className="centerFilter-wrapper">
      <div className="monthControls">
        <ChevronLeftRoundedIcon
          className="monthControls__icon monthControls__icon--left"
          onClick={minusMonth}
        />
        <p className="monthControls__date monthControls__date--month">
          {month === 1 && "Styczeń"}
          {month === 2 && "Luty"}
          {month === 3 && "Marzec"}
          {month === 4 && "Kwiecień"}
          {month === 5 && "Maj"}
          {month === 6 && "Czerwiec"}
          {month === 7 && "Lipiec"}
          {month === 8 && "Sierpień"}
          {month === 9 && "Wrzesień"}
          {month === 10 && "Październik"}
          {month === 11 && "Listopad"}
          {month === 12 && "Grudzień"}
        </p>
        <p className="monthControls__date monthControls__date--year">{year}</p>
        <ChevronRightRoundedIcon
          className="monthControls__icon monthControls__icon--right"
          onClick={plusMonth}
        />
      </div>
    </div>
  );
};

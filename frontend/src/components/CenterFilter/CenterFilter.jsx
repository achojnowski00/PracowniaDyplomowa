import React, { useContext } from "react";
import "./CenterFilter.sass";

import { FilterContext } from "../../context/filterContext";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export const CenterFilter = () => {
  const [
    month,
    setMonth,
    plusMonth,
    minusMonth,
    year,
    dateFrom,
    dateTo,
    ,
    ,
    ,
    setYear,
  ] = useContext(FilterContext);

  const getBackToActualMonth = () => {
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
  };

  return (
    <div className="centerFilter-wrapper">
      <div className="monthControls">
        <ChevronLeftRoundedIcon
          className="monthControls__icon monthControls__icon--left"
          onClick={minusMonth}
        />
        <div onClick={getBackToActualMonth} className="monthControls__date">
          <p className="monthControls__date--month">
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
          <p className="monthControls__date--year">{year}</p>

          {new Date(dateFrom) <= new Date() &&
          new Date() <= new Date(dateTo) ? (
            <></>
          ) : (
            <span
              className={
                "monthControls__date-info " +
                (new Date(dateFrom) <= new Date() &&
                new Date() <= new Date(dateTo)
                  ? ""
                  : "nieaktualny")
              }
            >
              Kliknij aby wrócić do aktualnego miesiąca
            </span>
          )}
        </div>
        <ChevronRightRoundedIcon
          className="monthControls__icon monthControls__icon--right"
          onClick={plusMonth}
        />
      </div>
    </div>
  );
};

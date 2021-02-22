import { useState, useEffect } from "react";

// ? get ISO week number from date
// ? week start Sunday set by if (currentDay === 0)
const isoWeekFromDate = (date = new Date()) => {
  date = new Date(date);
  date.setHours(0, 0, 0, 0);
  const currentDay = date.getDay();
  if (currentDay === 0) {
    date.setDate(date.getDate() + 10 - ((date.getDay() + 6) % 7));
  } else {
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  }
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

// ? get the unix date for the week start date from a week number (1 - 53)
const weekFromNumber = (week = 1, year) => {
  let date = new Date();
  if (year) date.setYear(year);
  let week1 = new Date(date.getFullYear(), 0, 4);
  let sunday = new Date(week1.setDate(week1.getDate() - week1.getDay()));
  sunday.setDate(sunday.getDate() + (week - 1) * 7);
  return sunday.getTime();
};

// ? get object with unix and string stamps for the
// ? sun - sat range for provided number of weeks
// ? * date = a date in the most recent week to assign
// ? what week to calculate range back from
const getWeeksRange = (weeks = 1, date = new Date()) => {
  const d = new Date(date);
  const currentDay = d.getDay();
  const sundayUnix = d.setDate(d.getDate() - currentDay);
  const sunday = new Date(sundayUnix);

  sunday.setHours(0, 0, 0, 0);
  date = new Date(new Date(date).setHours(23, 59, 59, 999));

  const to = new Date(sunday).setDate(new Date(sunday).getDate() + 6);
  const setTo = new Date(to).setHours(23, 59, 59, 999);
  const from = sunday.setDate(sunday.getDate() - 7 * (weeks - 1));

  return {
    from: new Date(from).getTime(),
    fromString: new Date(from).toString(),
    to: new Date(setTo).getTime(),
    toString: new Date(setTo).toString()
  };
};

// ? get previous year value
const currentDate = new Date();
const currentYear = new Date().getFullYear();
// const previousYear = currentYear - 1;
const previousPeriod = (date = new Date(), daysAg0 = 7) => {
  let dt = new Date(date);
  dt.setDate(dt.getDate() - daysAg0);
  return dt;
};

// ************
// *** hook ***
// ************
export const useYearOnYearDateRanges = (
  weeks = 1,
  date = currentDate,
  year = currentYear
) => {
  // eslint-disable-next-line
  const [parameters, setParameters] = useState({});
  const [period, setPeriod] = useState({
    week: "",
    current: {},
    previous: {},
    lastYear: {}
  });

  /** set parameters state */
  useEffect(() => {
    setParameters({
      weeks,
      date: new Date(date),
      prevDate: previousPeriod(date),
      year
    });
  }, [date, weeks, year]);

  /** set period state */
  useEffect(() => {
    const week = isoWeekFromDate(parameters.date);
    setPeriod((period) => ({ ...period, week }));
    const currentPeriod = getWeeksRange(
      weeks,
      weekFromNumber(week, parameters.year)
    );
    setPeriod((period) => ({
      ...period,
      current: currentPeriod
    }));
    const previousPeriod = getWeeksRange(
      weeks,
      weekFromNumber(isoWeekFromDate(parameters.prevDate), parameters.year)
    );
    setPeriod((period) => ({
      ...period,
      previous: previousPeriod
    }));
    const lyPeriod = getWeeksRange(
      weeks,
      weekFromNumber(week, parameters.year - 1)
    );
    setPeriod((period) => ({
      ...period,
      lastYear: lyPeriod
    }));
  }, [weeks, parameters]);

  useEffect(() => {
    console.log(period);
  }, [period]);
  return period;
};

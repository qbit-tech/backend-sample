import moment = require('moment');

const DEFAULT_YEAR = 2022;
const DEFAULT_MONTH = 0;
const DEFAULT_DATE = 1;

export function convertDateToSameDateForScheduleTime(date: string | Date, sameData?: {
  year?: number;
  month?: number;
  date?: number;
  weekday?: number;
}) {
  date = new Date(date);

  date.setFullYear(sameData?.year || DEFAULT_YEAR);
  date.setMonth(sameData?.month || DEFAULT_MONTH);
  date.setDate(sameData?.date || DEFAULT_DATE);
  date.setSeconds(0);

  return date;
}

export function convertDateRangeToSameDateForScheduleTime(
  date: {
    startAt: string | Date,
    endAt: string | Date,
  },
  sameData?: {
    year?: number;
    month?: number;
    date?: number;
    weekday?: number;
  },
) {
  const startAt = new Date(date.startAt);
  const endAt = new Date(date.endAt);


  const diffDate = moment(endAt).diff(startAt, 'day')
  let isEndAtNextDay = false;
  if (diffDate === 0) {
    if (endAt.getTime() <= startAt.getTime()) {
      isEndAtNextDay = true;
    } else {
      isEndAtNextDay = false;
    }
  } else {
    isEndAtNextDay = true;
  }

  startAt.setFullYear(sameData?.year || DEFAULT_YEAR);
  startAt.setMonth(sameData?.month || DEFAULT_MONTH);
  startAt.setDate(sameData?.date || DEFAULT_DATE);
  startAt.setSeconds(0);

  endAt.setFullYear(sameData?.year || DEFAULT_YEAR);
  endAt.setMonth(sameData?.month || DEFAULT_MONTH);
  if (isEndAtNextDay) {
    if (sameData?.date) {
      endAt.setDate(sameData?.date + 1);
    } else {
      endAt.setDate(2);
    }
  } else {
    if (sameData?.date) {
      endAt.setDate(sameData?.date);
    } else {
      endAt.setDate(1);
    }
  }
  endAt.setSeconds(0);

  return {startAt, endAt};
}
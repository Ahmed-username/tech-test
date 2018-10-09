function convertFrom(amount, fromSelected, toSelected, currencies) {
    console.log("currency", currencies)
  const fullNumber =
    (amount / currencies[fromSelected.trim()]) * currencies[toSelected.trim()];
  return Math.round(fullNumber * 10000) / 10000;
}

function convertTo(amount, fromSelected, toSelected, currencies) {
  const fullNumber =
    (amount * currencies[fromSelected.trim()]) / currencies[toSelected.trim()];
  return Math.round(fullNumber * 10000) / 10000;
}

function getDates() {
  const date = new Date();
  let currentMonth = date.getMonth() + 1;
  let currentYear = date.getFullYear();
  let startMonth = currentMonth - 1;
  let startYear = currentYear;

  if (currentMonth == 1) {
    startMonth = 12;
    startYear = currentYear - 1;
  }

  if (currentMonth < 10) currentMonth = `0${currentMonth}`;
  if (startMonth < 10) startMonth = `0${startMonth}`;

  return { currentYear, currentMonth, startMonth, startYear };
}

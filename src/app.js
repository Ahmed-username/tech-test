const app = angular.module("currencyApp", []);

app.controller("conversion", [
  "$scope",
  "$http",
  "$log",
  function($scope, $http, $log) {
    //fetch todays list of currencies and rates
    $http
      .get(
        "https://openexchangerates.org/api/latest.json?app_id=546b17d695434f74953c47ec5d7f9f7d&base=GBP"
      )
      .then(result => ($scope.currencies = result.data.rates))
      .catch(err => {
        $log.warn(err);
        $scope.apiError = true;
      });

    //currency converter initial values
    $scope.fromSelected = "GBP";
    $scope.toSelected = "GBP";
    $scope.exchangeRate = 1;
    $scope.apiError = false;
    $scope.isGraph = false;

    // calculates todays exchange rate based on the currency in From compared to To
    function calcExchangeRate() {
      const { currencies, fromSelected, toSelected } = $scope;
      $scope.exchangeRate =
        (1 / currencies[fromSelected.trim()]) * currencies[toSelected.trim()];
    }

    // make an api call to get exchange rate over the last month
    function getMonthlyRate() {
      const dates = getDates();
      $scope.startDate = `01/${dates.startMonth}/${dates.startYear}`;
      $scope.endDate = `01/${dates.currentMonth}/${dates.currentYear}`;

      $http
        .get(
          `https://openexchangerates.org/api/time-series.json?app_id=546b17d695434f74953c47ec5d7f9f7d&start=${
            dates.startYear
          }-${dates.startMonth}-01&end=${dates.currentYear}-${
            dates.currentMonth
          }-01&symbols=${$scope.toSelected.trim()}&base=${$scope.fromSelected.trim()}`
        )
        .then(result => drawGraph(result.data))
        .catch(error => {
          $log.warn(error);
          $scope.apiError = true;
        });

      $scope.isGraph = true;
    }

    // handles selection from list event in the From side
    $scope.fromSelectionchange = function(amount) {
      $scope.convertFrom(amount);
      calcExchangeRate();
      getMonthlyRate();
    };

    // handles selection from list event in the To side
    $scope.toSelectionchange = function(amount) {
      $scope.convertTo(amount);
      calcExchangeRate();
      getMonthlyRate();
    };

    // converts the currency based on the inputs (amount&currency) in From side
    $scope.convertFrom = function(amount) {
      const { currencies, fromSelected, toSelected } = $scope;

      $scope.toBox = convertFrom(amount, fromSelected, toSelected, currencies);
    };

    // converts the currency based on the inputs (amount&currency) in To side
    $scope.convertTo = function(amount) {
      const { currencies, fromSelected, toSelected } = $scope;

      $scope.fromBox = convertTo(amount, fromSelected, toSelected, currencies);
    };
  }
]);

function convertFrom(amount, fromSelected, toSelected, currencies) {
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

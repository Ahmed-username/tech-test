const app = angular.module("currencyApp", []);

app.controller("conversion", [
  "$scope",
  "$http",
  "$log",
  function($scope, $http, $log) {
    //currency converter initial values
    getExchangeRates();
    $scope.fromSelected = "GBP";
    $scope.toSelected = "GBP";
    $scope.exchangeRate = 1;
    $scope.apiError = false;
    $scope.isGraph = false;

    // calculates todays exchange rate based on the currency in From compared to To
    function calcExchangeRate() {
      const { currencies, fromSelected, toSelected } = $scope;

      $scope.exchangeRate = convertFrom(
        1,
        fromSelected,
        toSelected,
        currencies
      );
    }

    // handles selection from list event in the From side
    $scope.fromSelectionchange = function(
      amount,
      fromSelected,
      toSelected,
      currencies
    ) {
      $scope.convertFrom(amount, fromSelected, toSelected, currencies);
      calcExchangeRate();
      getMonthlyRate();
    };

    // handles selection from list event in the To side
    $scope.toSelectionchange = function(
      amount,
      fromSelected,
      toSelected,
      currencies
    ) {
      $scope.convertTo(amount, fromSelected, toSelected, currencies);
      calcExchangeRate();
      getMonthlyRate();
    };

    // converts the currency based on the inputs (amount&currency) in From side
    $scope.convertFrom = function(
      amount,
      fromSelected,
      toSelected,
      currencies
    ) {
      $scope.toBox = convertFrom(amount, fromSelected, toSelected, currencies);
    };

    // converts the currency based on the inputs (amount&currency) in To side
    $scope.convertTo = function(amount, fromSelected, toSelected, currencies) {
      $scope.fromBox = convertTo(amount, fromSelected, toSelected, currencies);
    };

    //fetch todays list of currencies and rates
    function getExchangeRates() {
      $http
        .get(
          "https://openexchangerates.org/api/latest.json?app_id=546b17d695434f74953c47ec5d7f9f7d&base=GBP"
        )
        .then(result => ($scope.currencies = result.data.rates))
        .catch(err => {
          $log.warn(err);
          $scope.apiError = true;
        });
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
        .then(result => {
          drawGraph(result.data);
          $scope.isGraph = true;
        })
        .catch(error => {
          $log.warn(error);
          $scope.apiError = true;
        });
    }
  }
]);

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

      $scope.startDate = `01/${startMonth}/${startYear}`;
      $scope.endDate = `01/${currentMonth}/${currentYear}`;

      $http
        .get(
          `https://openexchangerates.org/api/time-series.json?app_id=546b17d695434f74953c47ec5d7f9f7d&start=${startYear}-${startMonth}-01&end=${currentYear}-${currentMonth}-01&symbols=${$scope.toSelected.trim()}&base=${$scope.fromSelected.trim()}`
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
      const result =
        ((amount * 1) / currencies[fromSelected.trim()]) *
        currencies[toSelected.trim()];
      $scope.toBox = result;
    };

    // converts the currency based on the inputs (amount&currency) in To side
    $scope.convertTo = function(amount) {
      const { currencies, fromSelected, toSelected } = $scope;
      const result =
        (amount * currencies[fromSelected.trim()] * 1) /
        currencies[toSelected.trim()];
      $scope.fromBox = result;
    };

    $scope.$watch(() => {});
  }
]);

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

      $http
        .get(
          `https://openexchangerates.org/api/time-series.json?app_id=546b17d695434f74953c47ec5d7f9f7d&start=${startYear}-${startMonth}-01&end=${currentYear}-${currentMonth}-01&symbols=${$scope.toSelected.trim()}&base=${$scope.fromSelected.trim()}`
        )
        .then(result => drawGraph(result.data))
        .catch(error => {
          $log.warn(error)
          $scope.apiError = true;
        });
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


// draw a graph for an exhange rate over a period of time
function drawGraph(data) {
  let cy = cytoscape({
    container: document.getElementById("cy"),
    zoom: 1,
    pan: {x:0, y:0},
    style: [
      // the stylesheet for the graph
      {
        selector: "node",
        style: {
          "background-color": "#779126",
          "label": "data(id)",
          "color": "black"
        }
      }
    ]
  });
  const minRate = getY(getMinRate(data));

  const nodes = Object.keys(data.rates).map((day, index) => {
    const dailyRate = data.rates[day][Object.keys(data.rates[day]).join("")];
    const positionX = index * 30;
    const positionY = (getY(dailyRate) - minRate) * 40;
    const label = `${index + 1}: ${Math.round(dailyRate * 100) / 100}`;
    const node = {
      group: "nodes",
      data: { id: label },
      position: { x: positionX, y: positionY }
    };
    return node;
  });

  let edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const egde = {
      group: "edges",
      data: {
        id: `e${i}`,
        source: nodes[i].data.id,
        target: nodes[i + 1].data.id
      }
    };
    edges.push(egde);
  }

  cy.add(nodes);
  cy.add(edges);

  cy.animate(
    {
    pan: { x: 100, y: 50 },
  zoom: 0.7,
  duration: 1000
    }
  )
  
}

// find the smallest exchange rate in a given list
function getMinRate(data) {
  let min = 9999999;
  Object.keys(data.rates).forEach(day => {
    let dailyRate = data.rates[day][Object.keys(data.rates[day]).join("")];
    min = Math.min(min, dailyRate);
  });
  return min;
}

// magnify the rate to an integer of 3 digits
function getY(rate) {
  let arrayFromRate = Array.from(rate.toString());
  let value = "";

  if (rate < 1) {
    for (let i = 2; i < arrayFromRate.length; i++) {
      if (arrayFromRate[i] == 0) continue;

      value = arrayFromRate[i] + arrayFromRate[i + 1] + arrayFromRate[i + 2];
      break;
    }
  } else if (rate > 1) {
    value = arrayFromRate[0] + arrayFromRate[2] + arrayFromRate[3];
  } else value = 1;

  return Number(value);
}

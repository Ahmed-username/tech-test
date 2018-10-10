describe('app.js', function() {
    
  
    describe('converter controller', function() {
        beforeEach(module('currencyApp'));
        let $controller, $rootScope, $scope, controller;
  
        beforeEach(inject(function(_$controller_, _$rootScope_){
          $controller = _$controller_;
          $rootScope = _$rootScope_;
          $scope = $rootScope.$new();
        controller = $controller('conversion', { $scope: $scope });
        }));

      it('checks initial values of $scope', function() {
        
        
        expect($scope.fromSelected).toBe('GBP');
        expect($scope.toSelected).toBe('GBP');
        expect($scope.exchangeRate).toBe(1);
        expect($scope.apiError).toBe(false);
        expect($scope.isGraph).toBe(false);
      });

      it("checks value of $scope.toSelected after From input ngChange",function(){
        currencies = {
            AED: 4.828081,
            AFN: 99.741889,
            ANG: 2.333461
          };
          const result = convertFrom(2, "AED", "AFN", currencies)
          $scope.convertTo(2)
          expect($scope.toBox).toBe(result)

      });

      it("checks value of $scope.fromSelected after To input ngChange",function(){
        currencies = {
            AED: 4.828081,
            AFN: 99.741889,
            ANG: 2.333461
          };
      })


    });
  });
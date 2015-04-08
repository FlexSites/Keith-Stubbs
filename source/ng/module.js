angular.module('app', ['ngRoute', 'FlexSite'])
  .controller('HomeCtrl', ['$scope', function($scope){
    $scope.keithHeroArr = [
      'keith1-b5f99f0d.gif',
      'keith2-a8c6f0a0.gif',
      'keith3-1a6ac6fb.gif'
    ];
    $scope.keithHero = 2;
    setInterval(setKeithHero, 2500);
    function setKeithHero(){
      if($scope.keithHero > 1){
        $scope.keithHero = -1;
      }
      $scope.keithHero++;
      $scope.$digest();
    }
  }]);

angular.module('app')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){


    // $locationProvider.hashPrefix('!');
    $routeProvider
      .when('/', {
        templateUrl: '/html/home.html'
      })
      .when('/bio', {
        templateUrl: '/html/bio.html',
        controller: ['$sce', '$scope', 'entertainer', function($sce, $scope, entertainer){
          // entertainer.description = $sce.parseAsHtml(entertainer.description);
          entertainer.blah = $sce.trustAsHtml(entertainer.description);
          $scope.entertainer = entertainer;
        }],
        resolve: {
          entertainer: ['Entertainer', function(Entertainer){
            return Entertainer.get({id: '55232c9258a27692c55b64b3'}).$promise;
          }]
        }
      })
      .when('/hire-keith', {
        templateUrl: '/html/contact.html'
      })
      .when('/videos', {
        templateUrl: '/html/videos.html'
      })
      .when('/contact', {
        templateUrl: '/html/contact.html'
      });
  }]);


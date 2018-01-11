'use strict';
angular.module('myApp', [
  'ngRoute',
  'myApp.patientInfo', 
  'myApp.version',
  'blockUI'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'validationCtrl'
      });
      $routeProvider.otherwise('/');
  $locationProvider.html5Mode(true);
}])
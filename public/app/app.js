//console.log('testy Amngular');
angular.module('userApp',[  'ngRoute','appRoutes','userController','userServices','ngAnimate','mainController','authServices', 'emailController','managementController' ])

.config(function($httpProvider) {
   $httpProvider.interceptors.push('AuthInterceptors');
});
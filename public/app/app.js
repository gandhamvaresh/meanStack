//console.log('testy Amngular');
angular.module('userApp',[  'ngRoute','appRoutes','userController','userServices','ngAnimate','mainController','authServices', 'emailController'])

.config(function($httpProvider) {
   $httpProvider.interceptors.push('AuthInterceptors');
});
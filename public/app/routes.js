angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider , $locationProvider){
	//console.log('Testing Routes');
	$routeProvider
	.when('/',{
		templateUrl: 'app/views/pages/home.html'
	})
	.when('/about',{
		templateUrl: 'app/views/pages/about.html'
     })
	.otherwise({redirectTo: '/'	});

$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
});




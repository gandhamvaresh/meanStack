angular.module('mainController', ['authServices'])
.controller('mainCtrl', function(Auth,$http,$location,$timeout) {
	
  	var app = this;
    if(Auth.isLoggedIn()) {
      console.log('logged in');
    } else { console.log('user is not logged  '); }

	this.dologin = function(loginData){
			console.log('test main ctrl');

        app.loading = true;
		app.errorMsg= false;
  // console.log(this.regData);
 Auth.login(app.loginData).then(function(data){;
    // console.log( data.data.success    + ' userController dddddloading ' + data.data.message);
              if(data.data.success){
             app.loading=false;
              app.successMsg = data.data.message;
              $timeout(function(){
              	$location.path('/about');
              },2000)
              
                 }else{
                 	app.loading=false;
                  	app.errorMsg = data.data.message;
                }
        });
};
this.logout= function(){
  Auth.logout();
  $location.path('/logout');{
     $timeout(function(){
                $location.path('/');
              },2000)
  }
};
});


	
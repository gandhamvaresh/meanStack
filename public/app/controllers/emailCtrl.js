angular.module('emailController', ['userServices'])
.controller('emailCtrl', function($routeParams,User, $location, $timeout){
   // console.log($routeParams.token)
     app = this;
    User.activateAccount($routeParams.token).then(function(data){
        app.successMsg = false;
        app.errorMsg = false;
 if(data.data.success){
     app.successMsg = data.data.message + '.....Redirecting';
     $timeout(function() {
        $location.path('/login');
    }, 2000);
 }else{
     app.errorMsg = data.data.message + '.....Redirecting';
     $timeout(function() {
        $location.path('/login');
    }, 2000);
 }
    });
})
.controller('resendCtrl',function(User){
app =this;
app.checkCredentials = function(loginData){
    app.errorMsg = false;
    app.successMsg  = false; 
    app.disabled = true;
 	User.checkCredentials(loginData).then(function(data){
      console.log(data);
      if(data.data.success){
     User.resendLink(app.loginData).then(function(data){
        if(data.data.success){
        app.successMsg = data.data.message;
    }
    })

      }else{
        app.disabled = false;
     app.errorMsg = data.data.message ;
      }
     });

};

});
angular.module('userController',['userServices'])

.controller('regCtrl',function($http,$location,$timeout,User){
	var app = this;
	
	//this.successMsg = false;
	this.regUser = function(regData){
        app.loading = true;
		app.errorMsg= false;
  // console.log(this.regData);
 User.create(app.regData).then(function(data){;
    // console.log( data.data.success    + ' userController dddddloading ' + data.data.message);
              if(data.data.success){
             app.loading=false;
              app.successMsg = data.data.message;
              $timeout(function(){
              	$location.path('/');
              },2000)
              
                 }else{
                 	app.loading=false;
                  	app.errorMsg = data.data.message;
                }
        //console.log( data + ' userController dddddloading ');
   
    
});
};
});


/*.config(function(){
	console.log('userController loading ');
	//regCtrl
})*/
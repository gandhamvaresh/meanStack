angular.module('userController', ['userServices'])

    .controller('regCtrl', function($http, $location, $timeout, User) {
        var app = this;
        this.regUser = function(regData, valid) {
            app.loading = true;
            app.errorMsg = false;
            if (valid) {
                User.create(app.regData).then(function(data) {
                    if (data.data.success) {
                        app.loading = false;
                        app.successMsg = data.data.message;
                        $timeout(function() {
                            $location.path('/');
                        }, 2000)

                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                app.errorMsg = "please ensure your data";
            }
        };
       this.checkUsername = function(regData){
          app.checkingusername = true ; 
           app.usernameMsg = false;
           app.usernameInvalid = false ; 
        User.checkusername(app.regData).then(function(data){
         if(data.data.success){
            app.checkingusername = false ; 
            app.usernameInvalid = false ; 
            app.usernameMsg = data.data.message;
         }else{
            app.checkingusername = true ; 
            app.usernameInvalid = true ; 
            app.usernameMsg = data.data.message;
  
         }
        });

       }
       this.checkEmail = function(regData){
        app.checkingEmail = true ; 
        app.emailMsg = false;
        app.emailInvalid = false ; 
        User.checkemail(app.regData).then(function(data){
            if(data.data.success){
                app.checkingemail = false ; 
                app.emailInvalid = false ; 
                app.emailMsg = data.data.message;
             }else{
                app.checkingemail = true ; 
                app.emailInvalid = true ; 
                app.emailMsg = data.data.message;
      
             }
        });

       }   
    })
    .directive('match', function() {
        return {
          restrict: 'A',
          controller:   function($scope){
          $scope.confirmed = false;
            $scope.doConfirm = function(values){
               values.forEach(function(ele){
                   if ($scope.confirm == ele) {
                       $scope.confirmed = true;
                   } else {
                    $scope.confirmed = false;
                    }
                                 });
           }
          },
          link: function(scope,element,attrs){
           
            attrs.$observe('match', function(){
                scope.matches = JSON.parse(attrs.match); 
                scope.doConfirm(scope.matches);
              });
             scope.$watch('confirm', function(){
                scope.matches = JSON.parse(attrs.match); 
                scope.doConfirm(scope.matches);
               }); 
          }     
         };
      })
    .controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
        var app = this;
        if ($window.location.pathname == '/facebookerror') {
            app.errorMsg = 'The FB user not exist ';

        } else {
            console.log($routeParams.token);
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    })

    .controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
        var app = this;
        if ($window.location.pathname == '/twittererror') {
            app.errorMsg = 'The twitter user not exist ';

        } else {
            console.log($routeParams.token);
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    })
    .controller('googleCtrl', function($routeParams, Auth, $location, $window) {
        var app = this;
        if ($window.location.pathname == '/googleerror') {
            app.errorMsg = 'The google user not exist ';

        } else {
            console.log($routeParams.token);
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
    })
angular.module('userController', ['userServices'])

    .controller('regCtrl', function($http, $location, $timeout, User) {
        var app = this;
        this.regUser = function(regData, valid) {
            app.disabled = true;
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
                        app.disabled=false;
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.disabled=false;
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
      // Controller: facebookCtrl is used finalize facebook login
.controller('facebookCtrl', function($routeParams, Auth, $location, $window, $scope) {

    var app = this;
    app.errorMsg = false; // Clear errorMsg on page load
    app.expired = false; // Clear expired on page load
     app.disabled = true; // On page load, remove disable lock from form

    // Check if callback was successful 
    if ($window.location.pathname == '/facebookerror') {
      //  $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Facebook e-mail not found in database.'; // If error, display custom message
    } else if ($window.location.pathname == '/facebook/inactive/error') {
        app.expired = true; // Variable to activate "Resend Link Button"
    //    $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
    } else {
        Auth.socialMedia($routeParams.token); // If no error, set the token
        $location.path('/'); // Redirect to home page
    }
})

// Controller: twitterCtrl is used finalize facebook login  
.controller('twitterCtrl', function($routeParams, Auth, $location, $window, $scope) {

    var app = this;
    app.errorMsg = false; // Clear errorMsg on page load
    app.expired = false; // Clear expired on page load
    app.disabled = true; // On page load, remove disable lock from form

    // Check if callback was successful         
    if ($window.location.pathname == '/twittererror') {
      //  $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Twitter e-mail not found in database.'; // If error, display custom message
    } else if ($window.location.pathname == '/twitter/inactive/error') {
        app.expired = true; // Variable to activate "Resend Link Button"
    //    $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
    } else if ($window.location.pathname == '/twitter/unconfirmed/error') {
      //  $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Your twitter account is either inactive or does not have an e-mail address attached to it.'; // If error, display custom message
    } else {
        Auth.socialMedia($routeParams.token); // If no error, set the token
        $location.path('/'); // Redirect to home page
    }
})

// Controller: googleCtrl is used finalize facebook login   
.controller('googleCtrl', function($routeParams, Auth, $location, $window, $scope) {

    var app = this;
    app.errorMsg = false; // Clear errorMsg on page load
    app.expired = false; // Clear expired on page load
    app.disabled = true; // On page load, remove disable lock from form

    // Check if callback was successful         
    if ($window.location.pathname == '/googleerror') {
  //      $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Google e-mail not found in database.'; // If error, display custom message
    } else if ($window.location.pathname == '/google/inactive/error') {
        app.expired = true; // Variable to activate "Resend Link Button"
      //  $scope.alert = 'alert alert-danger'; // Set class for message
        app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
    } else {
        Auth.socialMedia($routeParams.token); // If no error, set the token
        $location.path('/'); // Redirect to home page
    }
});
    // .controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
    //     var app = this;
    //     app.errorMsg = false; 
    //     if ($window.location.pathname == '/facebookerror') {
    //         app.errorMsg = 'The FB user not exist ';
    //     }else if($window.location.pathname == '/facebook/inactive/error'){
    //         app.errorMsg = 'Account is not activated please check your mailfor activate link';
    //     } else {
    //         console.log($routeParams.token);
    //         Auth.facebook($routeParams.token);
    //         $location.path('/');
    //     }
    // })

    // .controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
    //     var app = this;
    //     app.errorMsg = false; 
    //     if ($window.location.pathname == '/twittererror') {
    //         app.errorMsg = 'The twitter user not exist ';
    //     }else if($window.location.pathname == '/twitter/inactive/error'){
    //         app.errorMsg = 'Account is not activated please check your mailfor activate link';
    //     } else {
    //         console.log($routeParams.token);
    //         Auth.facebook($routeParams.token);
    //         $location.path('/');
    //     }
    // })
    // .controller('googleCtrl', function($routeParams, Auth, $location, $window) {
    //     var app = this;
    //     app.errorMsg = false; 
    //     if ($window.location.pathname == '/googleerror') {
    //         app.errorMsg = 'The google user not exist ';
    //     }else if($window.location.pathname == '/google/inactive/error'){
    //         app.errorMsg = 'Account is not activated please check your mailfor activate link';
    //     } else {
    //         console.log($routeParams.token);
    //         Auth.facebook($routeParams.token);
    //         $location.path('/');
    //     }
    // })
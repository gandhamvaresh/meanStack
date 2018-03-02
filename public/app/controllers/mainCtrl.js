angular.module('mainController', ['authServices','userServices'])
    .controller('mainCtrl', function (Auth, $http, $location, $timeout, $rootScope, $window, $interval,$route,User,AuthToken,User) {

        var app = this;
        app.loadme = false;   // untill load  this(everyting) dont show others
        app.checkSession = function () {
            if (Auth.isLoggedIn()) {
                app.checkingSession = true;
                var interval = $interval(function () {
                    var token = $window.localStorage.getItem('token');
                    // Ensure token is not null (will normally not occur if interval and token expiration is setup properly)
                    if (token === null) {
                        $interval.cancel(interval); // Cancel interval if token is null
                    } else {
                        // Parse JSON Web Token using AngularJS for timestamp conversion
                        self.parseJwt = function(token) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        };
                        var expireTime = self.parseJwt(token); // Save parsed token into variable
                        var timeStamp = Math.floor(Date.now() / 1000); // Get current datetime timestamp
                        console.log('token     :  '  + timeStamp +'    expired        '+expireTime.exp );
                        var timeCheck = expireTime.exp - timeStamp; // Subtract to get remaining time of token
                        console.log('test ' + timeCheck );
                        if (timeCheck <= 25) {
                          console.log('token expired ' );
                            showModal(1); // Open bootstrap modal and let user decide what to do
                            $interval.cancel(interval); // Stop interval
                        }else{
                            console.log('token not yet expired ' );
                        }
                    }
                }, 2000);
            }
        };

        app.checkSession();

        var showModal = function(option){
            app.choiceMade = false;
            app.modelHeader = undefined;
            app.modelBody = undefined;
            app.hideButtons = false;
          
              if(option === 1 ){
                app.modelHeader = 'Time out working'
                app.modelBody = 'your session will expires in 5 min would you like to change session?'
                $("#myModal").modal({backdrop: "static"});
         
              }else if(option  === 2 ){
              app.hideButtons = true;
              app.modelHeader= 'logging out'
              $("#myModal").modal({backdrop: "static"});
             $timeout(function(){
               Auth.logout();
               $location.path('/');
                 hideModal();
                 $route.reload();
            }, 2000)
              }
              $timeout(function(){
                if(!app.choiceMade)
                hideModal();
                console.log('Logging Out')
            }, 4000)
        };

        // Auth.logout();
        // $location.path('/logout'); {
        //     $timeout(function () {
        //         $location.path('/');
        //     }, 2000)
        // }

         app.renewSession = function(){
            app.choiceMade = true;
          User.renewSession(app.username).then(function(data){
              if(data.data.success){
           AuthToken.setToken(data.data.token);
           app.checkSession();
              }else{
                  app.modelBody = data.data.message;
              }
          });
           hideModal();            
         };

         app.endSession= function(){
            app.choiceMade = true;
            hideModal();
            $timeout(function(){
                showModal(2);
            },1000)             
          }

         var hideModal = function(){
            $("#myModal").modal('hide');
         }; 
        // tologin continuly every request 
        $rootScope.$on('$routeChangeStart', function () {
            // Is user logged in or not ? 
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.email = data.data.email;
                    // below line shold wait untill all data loads
                    app.loadme = true;
                });
            } else {
                // when user not found change username and email to '' 
                app.isLoggedIn = false;
                app.username = '';
                app.email = '';
                app.loadme = true;
            }
            if ($location.hash() == '_=_') $location.hash(null);
        });

        this.facebook = function () {
            app.disabled = true;
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook'
        };
        this.twitter = function () {
            app.disabled = true;
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter'
        };
        this.google = function () {
            app.disabled = true;
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google'
        };

        // mainCtrl as main  // main.dologin
        this.dologin = function (loginData) {
            app.loading = true;
            app.errorMsg = false;
            app.expired = false;
            app.disabled = true;
            Auth.login(app.loginData).then(function (data) {
                ;
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/about');
                        app.loginData = '';
                        app.successMsg = false;
                        app.disabled = false;
                        app.checkSession();
                    }, 2000)
                } else {
                    if (data.data.expired) {
                        app.expired = true;
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    } else {
                        app.loading = false;
                        app.disabled = true;
                        app.errorMsg = data.data.message;
                    }
                }
            });
        };
        // mainCtrl as main  // main.logout
        app.logout = function () {
           showModal(2);
        };
    });
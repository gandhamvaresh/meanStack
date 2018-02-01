angular.module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $http, $location, $timeout, $rootScope, $window) {

        var app = this;
        // untill load  this(everyting) dont show others
        app.loadme = false;
        // tologin continuly every request 
        $rootScope.$on('$routeChangeStart', function() {
            // Is user logged in or not ? 
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function(data) {
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

        this.facebook = function() {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook'
        };
        this.twitter = function() {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter'
        };
        this.google = function() {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google'
        };

        // mainCtrl as main  // main.dologin
        this.dologin = function(loginData) {
            app.loading = true;
            app.errorMsg = false;
            Auth.login(app.loginData).then(function(data) {;
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        $location.path('/about');
                        app.loginData = '';
                        app.successMsg = false;
                    }, 2000)

                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };
        // mainCtrl as main  // main.logout
        this.logout = function() {
            Auth.logout();
            $location.path('/logout'); {
                $timeout(function() {
                    $location.path('/');
                }, 2000)
            }
        };
    });
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
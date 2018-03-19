angular.module('emailController', ['userServices'])
    .controller('emailCtrl', function ($routeParams, User, $location, $timeout) {
        // console.log($routeParams.token)
        app = this;
        User.activateAccount($routeParams.token).then(function (data) {
            app.successMsg = false;
            app.errorMsg = false;
            if (data.data.success) {
                app.successMsg = data.data.message + '.....Redirecting';
                $timeout(function () {
                    $location.path('/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message + '.....Redirecting';
                $timeout(function () {
                    $location.path('/login');
                }, 2000);
            }
        });
    })
    .controller('resendCtrl', function (User) {
        app = this;
        app.checkCredentials = function (loginData) {
            app.errorMsg = false;
            app.successMsg = false;
            app.disabled = true;
            User.checkCredentials(loginData).then(function (data) {
                console.log(data);
                if (data.data.success) {
                    User.resendLink(app.loginData).then(function (data) {
                        if (data.data.success) {
                            app.successMsg = data.data.message;
                        }
                    })

                } else {
                    app.disabled = false;
                    app.errorMsg = data.data.message;
                }
            });

        };

    })
    .controller('usernameCtrl', function (User) {
        app = this;
        app.sendUsername = function (userData, valid) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;
            if (valid) {
                User.sendUsername(app.userData.email).then(function (data) {
                    console.log(data);
                    app.loading = false;
                    if (data.data.success) {
                         app.successMsg = data.data.message;
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                app.errorMsg = 'please enter valid Email';
            }
        };
    })
    .controller('passwordCtrl', function (User) {
        app = this;
        app.sendPassword = function (resetData, valid) {
            app.errorMsg = false;
            app.loading = true;
            app.disabled = true;
            if (valid) {
                User.sendPassword(app.resetData).then(function (data) {
                    console.log(data);
                    app.loading = false;
                    if (data.data.success) {
                         app.successMsg = data.data.message;
                    } else {
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                app.errorMsg = 'please enter valid Email';
            }
        };
    })
    .controller('resetCtrl', function(User, $routeParams, $scope,$location,$timeout){
        app = this;
        app.hide = true;
        User.resetUser($routeParams.token).then(function(data){
            if(data.data.success){
                app.hide = false;
                app.successMsg = "please enter new password"
                $scope.username = data.data.user.username;
                console.log($scope.username)
            }else{
                 app.errorMsg = data.data.message;
            }
            
        });

        app.savePassword = function(regData,valid,confirmed){
            app.errorMsg = false;
            app.disabled = true;
            app.loading = true;
            app.regData.username = $scope.username;
            if(valid && confirmed){
              User.savePassword(app.regData).then(function(data){
                app.loading = false;
                 if(data.data.success){ 
                app.successMsg = data.data.message +'.......Redirecting';
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
            }else{
                app.disabled = false;
                app.loading = false;
                app.errorMsg = data.data.message;
            }
              })
            }else{
                app.disabled = false;
                app.loading = false;
              app.errorMsg = "please ensure you filled out properly"  
            }
        } 
    });

    
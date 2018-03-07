angular.module('managementController', [])
    .controller('managementCtrl', function (User) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.editAccess = false;
        app.deleteAccess = false;
        app.limit = 4;

        function getUsers() {
            User.getUsers().then(function (data) {
                if (data.data.success) {
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                        app.users = data.data.users;
                        app.loading = false;
                        app.accessDenied = false;
                        if (data.data.permission === 'admin') {
                            app.editAccess = true;
                            app.deleteAccess = true;
                        } else if (data.data.permission === 'moderator') {
                            app.editAccess = true;
                        }

                    } else {
                        app.errorMsg = "ionsufficient permitions";
                        app.loading = false;
                    }

                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            });
        }

        getUsers();

        app.showMore = function (number) {
            app.showMoreError = false;
            if (number > 0) {
                app.limit = number;
            } else {
                app.showMoreError = "please provide a valid number";
            }
        };

        app.showAll = function () {
            app.limit = undefined;
            app.showMoreError = false;
        };

        app.deleteUser = function (username) {
            User.deleteUser(username).then(function (data) {
                if (data.data.success) {
                    getUsers();
                } else {
                    app.showMoreError = data.data.message;
                }
            })

        };
    })
    .controller('editCtrl', function ($scope, $routeParams, User) {
        var app = this;
        $scope.nameTab = 'active';
        app.phase1 = true;

        User.getUser($routeParams.id).then(function(data) {
            if (data.data.success) {
                $scope.newName = data.data.user.name;
            } else {
                app.errorMsg = data.data.message;
            }
        })


        app.namePhase = function () {
            $scope.nameTab = 'active';
            $scope.userNameTab = 'default';
            $scope.emailTab = 'default';
            $scope.permmisionTab = 'default';
            app.phase1 = true;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = false;

        };


        app.userNamePhase = function () {
            $scope.nameTab = 'default';
            $scope.userNameTab = 'active';
            $scope.emailTab = 'default';
            $scope.permmisionTab = 'default';
            app.phase1 = false;
            app.phase2 = true;
            app.phase3 = false;
            app.phase4 = false;


        };


        app.emailPhase = function () {
            $scope.nameTab = 'default';
            $scope.userNameTab = 'default';
            $scope.emailTab = 'active';
            $scope.permmisionTab = 'default';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = true;
            app.phase4 = false;


        };


        app.permiossionPhase = function () {
            $scope.nameTab = 'default';
            $scope.userNameTab = 'default';
            $scope.emailTab = 'default';
            $scope.permmisionTab = 'active';
            app.phase1 = false;
            app.phase2 = false;
            app.phase3 = false;
            app.phase4 = true;

        };
        app.updateName = function (newName, valid) {
            app.errorMsg = false;
            app.disabled = true;
            if (valid) {

            } else {
                app.errorMsg = "please ensure that form filled out properly";
                app.disabled = false;
            }
        }

    });
angular.module('managementController', [])
    .controller('managementCtrl', function (User, $scope) {
        var app = this;

        app.loading = true;
        app.accessDenied = true;
        app.editAccess = false;
        app.deleteAccess = false;
        app.limit = 4;
        app.searchLimit = 0;

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

        app.search = function (searchKeyword, number) {
            if (searchKeyword) {
                if (searchKeyword.length > 0) {
                   app.limit = 0;
                   $scope.searchFilter = searchKeyword;
                   app.limit = number;
                } else {
                    $scope.searchFilter = undefined;
                    app.limit = 0;
                }
            } else {
                $scope.searchFilter = undefined;
                app.limit = 0;
                $scope.searchKeyword = undefined;
                $scope.searchFilter = undefined;
                app.showMoreError = false;
            }
        };

        app.clear = function() {
         $scope.number = 'Clear';
         app.limit = 0;
         $scope.searchKeyword = undefined; // Clear the search word
         $scope.searchFilter = undefined; // Clear the search filter
         app.showMoreError = false; // Clear any errors

        } 

        app.advancedSeach = function(searchByUsername,searchByEmail,searchByName){
          if(searchByUsername || searchByEmail || searchByName){

          }
        };
        app.sortOrder = function(order){
            app.sort = order;
        }
    })
    .controller('editCtrl', function ($scope, $routeParams, User, $timeout) {
        var app = this;
        $scope.nameTab = 'active';
        app.phase1 = true;

        User.getUser($routeParams.id).then(function (data) {
            if (data.data.success) {
                $scope.newName = data.data.user.name;
                $scope.newEmail = data.data.user.email;
                $scope.newUsername = data.data.user.username;
                $scope.newPermmision = data.data.user.permission;
                $scope.currentUser = data.data.user._id;
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
            app.errorMsg = false;

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
            app.errorMsg = false;


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
            app.errorMsg = false;


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


            app.disableUser = false;
            app.disableModerator = false;
            app.disableAdmin = false;
            app.errorMsg = false;

            if ($scope.newPermmision === 'user') {
                app.disableUser = true;
            } else if ($scope.newPermmision === 'moderator') {
                app.disableModerator = true;
            } else if ($scope.newPermmision === 'admin') {
                app.disableAdmin = true;
            }

        };




        app.updateName = function (newName, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var userObject = {};
            if (valid) {
                userObject._id = $scope.currentUser;
                userObject.name = $scope.newName;

                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.nameForm.name.$setPristine();
                            app.nameForm.name.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000)
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = "please ensure that form filled out properly";
                app.disabled = false;
            }
        };
        app.updateEmail = function (newEmail, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var userObject = {};
            if (valid) {
                userObject._id = $scope.currentUser;
                userObject.email = $scope.newEmail;

                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.emailForm.email.$setPristine();
                            app.emailForm.email.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000)
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = "please ensure that form filled out properly";
                app.disabled = false;
            }
        };
        app.updateUsername = function (newUsername, valid) {
            app.errorMsg = false;
            app.disabled = true;
            var userObject = {};
            if (valid) {
                userObject._id = $scope.currentUser;
                userObject.username = $scope.newUsername;

                User.editUser(userObject).then(function (data) {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            app.usernameForm.username.$setPristine();
                            app.usernameForm.username.$setUntouched();
                            app.successMsg = false;
                            app.disabled = false;
                        }, 2000)
                    } else {
                        app.errorMsg = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsg = "please ensure that form filled out properly";
                app.disabled = false;
            }
        };


        app.updatePermmisions = function (newPermmision) {
            app.errorMsg = false;

            app.disableUser = true;
            app.disableModerator = true;
            app.disableAdmin = true;

            var userObject = {};

            userObject._id = $scope.currentUser;
            userObject.permission = $scope.newPermmision;

            User.editUser(userObject).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {

                        app.successMsg = false;

                        if (newPermmision === 'user') {
                            $scope.newPermmision = 'user';
                            app.disableUser = true;
                            app.disableModerator = false;
                            app.disableAdmin = false;
                        } else if (newPermmision === 'moderator') {
                            $scope.newPermmision = 'moderator';
                            app.disableModerator = true;
                            app.disableUser = false;
                            app.disableAdmin = false;
                        } else if (newPermmision === 'admin') {
                            $scope.newPermmision = 'admin';
                            app.disableAdmin = true;
                            app.disableUser = false;
                            app.disableModerator = false;
                        }


                    }, 2000)
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        };

       

    });
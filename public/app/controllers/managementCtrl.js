angular.module('managementController', [] )
.controller('managementCtrl', function(User) {
    var app = this;
    
    app.loading  = true;
    app.accessDenied = true;
    app.editAccess = false;
    app.deleteaccess = false;

    User.getUsers().then(function(data){
    if(data.data.success){
   if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
     app.users = data.data.users;
     app.loading  = false;
     app.accessDenied = false;
     if(data.data.permission === 'admin'){
        app.editAccess = true;
        app.deleteaccess = true;
     }else if( data.data.permission === 'moderator'){
        app.editAccess = true;
     }
     
   }else{
    app.errorMsg = "ionsufficient permitions";
    app.loading  = false;
   }

    }else{
        app.errorMsg = data.data.message;
        app.loading  = false;
    }
    });

});
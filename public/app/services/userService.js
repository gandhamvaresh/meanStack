angular.module('userServices',  [])
.factory('User',function($http){
	userFactory = {};
	//User.create(regData)
	userFactory.create = function(regData){
		return $http.post('/api/users', regData)
	}
   // User.checkusername(regData)
	userFactory.checkusername = function(regData){
		return $http.post('/api/checkusername', regData)
	}
	//User.checkemail(regData)
	userFactory.checkemail = function(regData){
		return $http.post('/api/checkemail', regData)
	}
	//User.activateAccount(token)
	userFactory.activateAccount = function(token){
		return  $http.put('/api/activate/'+ token);
	}
   // Check credentials before re-sending activation link //User.checkCredentials(loginData)
		userFactory.checkCredentials = function(loginData) {
			return $http.post('/api/resend', loginData);
		};
//User.resendLink(username)
		userFactory.resendLink = function(username) {
			return $http.put('/api/resend', username);
		};	
//User.sendUsername(userData)
   // Send user's username to e-mail
   userFactory.sendUsername = function(userData) {
	return $http.get('/api/resetusername/' + userData);
};

//User.sendPassword(resetData)
   // put reset token user's sendPassword to e-mail
   userFactory.sendPassword = function(resetData) {
	return $http.put('/api/resetpassword/', resetData);
};
//User.resetUser(token)
userFactory.resetUser = function(token) {
	return $http.get('/api/resetpassword/'+ token);
};
//User.savePassword(regData)
userFactory.savePassword = function(regData) {
	console.log('service now');
	return $http.put('/api/savePassword',regData);
};
//User.renewSession(username)
	userFactory.renewSession = function(username){
   return $http.get('/api/renewToken/' + username);
	};
// User.getPermission
	userFactory.getPermission = function(){
   return $http.get('/api/permission');
	};	
// User.getUsers()   All users 
userFactory.getUsers = function(){
	return $http.get('/api/management');
	 };
// User.getUser(id)  particular user with ID
  // Get user to then edit
  userFactory.getUser = function(id) {
	return $http.get('/api/edit/' + id);
};

	// User.deleteUser(username) 
userFactory.deleteUser = function(username){
	return $http.delete('/api/management/'+ username)
};
	// User.editUser(username) 
	userFactory.editUser = function(id){
		return $http.put('/api/edit/', id)
	};



	return userFactory;
});
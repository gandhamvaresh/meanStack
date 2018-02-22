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
	return userFactory;
});
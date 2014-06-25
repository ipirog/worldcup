angular.module('auth', [])

    .run(["$rootScope", "serviceUser", "$state", "$cookies", function($rootScope, User, $state, $cookies) {

        if($cookies.token != null){
            $rootScope.isConnected = true;
        }else{
            $rootScope.isConnected = false;
        }


        //Evennement lors du changement de page
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            $("#content").html("");

            if($rootScope.isConnected){
                User.getUser($cookies.user_id, $cookies.token)
                    .success(function(data) {
                        $rootScope.user = data;
                    })
            }

            if (!User.authorize(toState.access)) {
                if(!$rootScope.isConnected)event.preventDefault();

                if(!$rootScope.isConnected)	$state.transitionTo('login');
                else $rootScope.redirectAlterLoad = {"state" : toState, "params": toParams};
            }

            $rootScope.success = "";
            $rootScope.error = "";
        });

        $rootScope.$watch('isConnected', function() {

            if($rootScope.isConnected != null){
                if($rootScope.isConnected){
                    $('body').css("background-color", "#fff");
                }else{
                    $('body').css("background-color", "#333");
                    $state.transitionTo('login');
                }
            }
        })
    }])

    .controller('authController', ["$rootScope", "$scope", "serviceUser", "$cookies", "$cookieStore", function($rootScope, $scope, User, $cookies, $cookieStore) {

        $scope.logout = function(){
            User.logout($cookies.token)
                .success(function(){
                    $rootScope.user = null;
                    $rootScope.isConnected = false;
                    $cookieStore.remove('token');
                    $cookieStore.remove('user_id');
                });
        }

    }]);

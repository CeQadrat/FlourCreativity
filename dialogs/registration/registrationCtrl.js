(function(angular){
    'use strict';

    angular
        .module('IndexApp')
        .controller('registrationCtrl', registrationCtrl);

    function registrationCtrl($mdDialog, userService, notifyService) {
        let self = this;

        self.hide = function() {
            $mdDialog.hide();
        };
        self.cancel = function() {
            $mdDialog.cancel();
        };
        self.done = function(){
            userService.createUser(self.user.email, self.user.name, self.user.password).then((user) => {
                console.log('reg compl');
                userService.logout().then(() => {
                    self.hide();
                    notifyService.notify('User create! Check your email to confirm your registration');
                }).catch(console.error);
            }).catch(console.error);
        }
    }
})(window.angular);
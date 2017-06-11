(function(angular){
    'use strict';

    angular
        .module('IndexApp')
        .controller('editProfileCtrl', editProfileCtrl);

    function editProfileCtrl($mdDialog, user) {
        let self = this;
        self.user = user;
        self.user.birthdayDate = new Date(self.user.birthdayDate);
        self.maxDate = new Date();
        self.genders = [
            "None selected",
            "Male",
            "Female"
        ];
        self.hide = function() {
            $mdDialog.hide();
        };
        self.cancel = function() {
            $mdDialog.cancel();
        };
        self.done = function(){
            $mdDialog.hide(self.user);
        }
    }
})(window.angular);
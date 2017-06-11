(function(angular){
    'use strict';

    angular
        .module('IndexApp')
        .controller('chooseImgCtrl', chooseImgCtrl);

    function chooseImgCtrl($mdDialog, userService) {
        let self = this;
        userService.getCurrentUser().then((user) => {
            self.user = user;
        }).catch((err) => console.error(err));
        self.hide = function() {
            $mdDialog.hide();
        };
        self.cancel = function() {
            $mdDialog.cancel();
        };
        self.done = function(link){
            $mdDialog.hide(link);
        }
    }
})(window.angular);
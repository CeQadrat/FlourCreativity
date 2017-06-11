(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .controller('loginCtrl', loginCtrl);

    function loginCtrl($mdDialog, userService, notifyService) {
        const self = this;
        self.forgot = function () {
            firebase.auth().sendPasswordResetEmail(self.user.email).then(() => {
                notifyService.notify('Instruction send to your email');
                self.hide();
            }).catch(console.error);
        };
        self.signInPopup = function (provider) {
            userService.signInPopup(provider).then((user) => {
                self.hide();
                notifyService.notify("Logged in as: " + user.name);
            }).catch((error) => {
                notifyService.notify("Authentication failed: " + error);
            });
        };
        self.hide = function () {
            $mdDialog.hide();
        };
        self.cancel = function () {
            $mdDialog.cancel();
        };
        self.done = function () {
            userService.signInWithEmailAndPassword(self.user.email, self.user.password).then((user) => {
                if(user.emailVerified) {
                    self.hide();
                    notifyService.notify("Logged in as: " + user.email);
                }else {
                    user.sendEmailVerification();
                    userService.logout().then(() => {
                        self.hide();
                        notifyService.notify("Please verify your email: " + user.email);
                    });
                }
            }).catch((error) => {
                notifyService.notify("Authentication failed: " + error);
            });
        }
    }
})(window.angular);
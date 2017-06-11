(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('appToolbar', {
            controller: toolbarCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/toolbar/toolbar-template.html',
            bindings: {
                user: '<'
            }
        });

    function toolbarCtrl(dialogService, $mdSidenav, userService, $firebaseObject, notifyService, $state) {
        const self = this;

        self.showLoginDialog = dialogService.showLoginDialog;
        self.showRegistrationDialog = dialogService.showRegistrationDialog;
        self.logout = function () {
            userService.logout().then(() => {
                notifyService.notify('You successful logout');
                $state.go('index');
            });
        };
        self.showEditProfileDialog = function (ev) {
            dialogService.showEditProfileDialog(ev, self.user).then((user) => {
                let dbUser = $firebaseObject(firebase.database().ref('users/'+self.user.id));
                dbUser.user = user;
                dbUser.$save().then((ref) => {
                    self.user = user;
                    notifyService.notify('Changes saves');
                });
            }).catch(() => {
                notifyService.notify('Changes don\'t save');
            });
        };
        self.toggleSidenav = function (id) {
            $mdSidenav(id).toggle();
        };
        self.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };
    }
})(window.angular);
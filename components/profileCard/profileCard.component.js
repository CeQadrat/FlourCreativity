(function(angular){
    'use strict';

    angular
        .module('IndexApp')
        .component('profileCard',{
            controller: profileCardCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/profileCard/profileCard-template.html',
            bindings:{
                user: '<'
            }
        });

    function profileCardCtrl(dialogService, notifyService, $firebaseArray, $firebaseObject, userService){
        const self = this;
        self.showEditAvatarDialog = dialogService.showEditAvatarDialog;
        self.showEditProfileDialog = function (ev) {
            dialogService.showEditProfileDialog(ev, self.user).then((user) => {
                return userService.updateUser(user);
                // let dbUser = $firebaseArray(firebase.database().ref('users/'));
                // dbUser.$loaded().then(() => {
                //     dbUser[dbUser.$indexFor(self.user.id)].user = user;
                //     dbUser.$save(dbUser.$indexFor(self.user.id)).then((ref) => {
                //         self.user = user;
                //         notifyService.notify('Changes saves');
                //     }).catch(console.error);
                // });
            }).then(() => {
                notifyService.notify('Changes saves');
            }).catch(() => {
                notifyService.notify('Changes don\'t save');
            });
        };
        userService.getCurrentUser().then((user) => {
            self.authUser = user;
        });
    }
})(window.angular);
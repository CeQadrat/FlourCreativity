(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .factory('dialogService', ['$mdDialog', '$q', function (dialog, $q) {
            let factory = {};
            factory.showLoginDialog = function (ev) {
                dialog.show({
                    controller: 'loginCtrl',
                    controllerAs: 'ctrl',
                    templateUrl: 'dialogs/login/login.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false
                });
                //.then(function(lUser){
                //    $scope.user = lUser;
                //    $scope.user.email = lUser.name;
                //    $scope.user.avatar = user.avatar;
                //}, function() {
                //    console.log('You cancelled the dialog.');
                //});
            };
            factory.showRegistrationDialog = function (ev) {
                dialog.show({
                    controller: 'registrationCtrl',
                    controllerAs: 'ctrl',
                    templateUrl: 'dialogs/registration/registration.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false
                });
            };
            factory.showCreateBlockDialog = function (ev, block) {
                return $q(function (resolve, reject) {
                    dialog.show({
                        controller: 'createBlockCtrl',
                        controllerAs: 'ctrl',
                        templateUrl: 'dialogs/createBlock/createBlock.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: false,
                        disableParentScroll: false,
                        locals: {
                            block: block
                        }
                    }).then(function (block) {
                        resolve(block);
                    }).catch(function () {
                        reject();
                    });
                });
            };
            factory.showEditAvatarDialog = function (ev, user) {
                dialog.show({
                    controller: 'editAvatarCtrl',
                    controllerAs: 'ctrl',
                    templateUrl: 'dialogs/editAvatar/editAvatar.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    locals: {
                        user: user
                    }
                });
            };
            factory.showEditProfileDialog = function (ev, user) {
                return $q(function (resolve, reject) {
                    dialog.show({
                        controller: 'editProfileCtrl',
                        controllerAs: 'ctrl',
                        templateUrl: 'dialogs/editProfile/editProfile.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: false,
                        locals: {
                            user: user
                        }
                    })
                        .then(function (editUser) {
                            if(editUser.birthdayDate) editUser.birthdayDate = (new Date(editUser.birthdayDate)).getTime();
                            resolve(editUser);
                        }).catch(function () {
                        console.log('reject edit dialog');
                        reject();
                    });
                });
            };
            factory.showChooseImgDialog = function (ev) {
                return $q(function (resolve, reject) {
                    dialog.show({
                        controller: 'chooseImgCtrl',
                        controllerAs: 'ctrl',
                        templateUrl: 'dialogs/chooseImg/chooseImg.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: false
                    })
                        .then(function (link) {
                            resolve(link);
                        }).catch(function () {
                        reject();
                    });
                });
            };
            return factory;
        }]);
})(window.angular);
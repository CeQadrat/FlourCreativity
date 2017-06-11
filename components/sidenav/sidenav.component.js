(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('appSidenav', {
            controller: sidenavCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/sidenav/sidenav-template.html',
            bindings: {
                user: '<'
            }
        });

    function sidenavCtrl($mdSidenav, userService, $state, notifyService) {
        const self = this;
        self.close = function () {
            $mdSidenav('left').close();
        };
        self.goTo = function (link) {
            $mdSidenav('left').close();
            $state.go(link[0], link[1]);
        };
        self.logout = function () {
            userService.logout().then(() => {
                $mdSidenav('left').close();
                $state.go('index');
                notifyService.notify('You successful logout');
            });
        };
        self.menu = [
            {
                icon: 'home',
                text: 'Home page',
                fun: function () {
                    self.goTo(['index']);
                }
            },
            {
                icon: 'account_box',
                text: 'My profile',
                fun: function () {
                    self.goTo(['profile', {userId: self.user.id}]);
                }
            },
            {
                icon: 'note_add',
                text: 'Create post',
                fun: function () {
                    self.goTo(['createPost']);
                }
            },
            {
                icon: 'folder',
                text: 'My posts',
                fun: function () {
                    self.goTo(['userPosts', {userId: self.user.id}]);
                }
            },
            {
                icon: 'collections',
                text: 'Media library',
                fun: function () {
                    self.goTo(['library']);
                }
            },
            {
                icon: 'grade',
                text: 'Favorite posts',
                fun: function () {
                    self.goTo(['favoritePosts', {userId: self.user.id}]);
                }
            },
            {
                icon: 'logout',
                text: 'Logout',
                fun: function () {
                    self.logout()
                }
            }];
    }
})(window.angular);
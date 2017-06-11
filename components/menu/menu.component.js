(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('appMenu', {
            controller: menuCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/menu/menu-template.html',
            bindings:{
                user: '<'
            }
        });

    function menuCtrl(dialogService) {
        const self = this;
        self.showDialog = function (type, ev) {
            if (type == 'login') dialogService.showLoginDialog(ev);
            if (type == 'register') dialogService.showRegistrationDialog(ev);
        };
        self.setMenu = function () {
            console.log('set menu');
            self.menu = [
                {
                    icon: 'home',
                    text: 'Home page',
                    link: 'index'
                },
                {
                    icon: 'account_box',
                    text: 'My profile',
                    link: 'profile({userId: \''+self.user.id+'\'})'
                },
                {
                    icon: 'note_add',
                    text: 'Create post',
                    link: 'createPost'
                },
                {
                    icon: 'folder',
                    text: 'My posts',
                    link: 'userPosts({userId: \''+self.user.id+'\'})'
                },
                {
                    icon: 'collections',
                    text: 'Media library',
                    link: 'library'
                },
                {
                    icon: 'grade',
                    text: 'Favorite posts',
                    link: 'favoritePosts({userId: \''+self.user.id+'\'})'
                }];
        };
        self.goTo = function (link) {
            $state.go(link[0], link[1]);
        }
    }
})(window.angular);
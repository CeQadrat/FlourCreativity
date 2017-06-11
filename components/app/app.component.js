(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('app', {
            controller: AppCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/app/app-template.html',
            // $routeConfig: [
            //     {
            //         path: '/', name: 'IndexPosts', component: 'indexPosts', useAsDefault: true
            //     },
            //     {
            //         path: '/profile/:id', name: 'Profile', component: 'profilePage'
            //     },
            //     {
            //         path: '/createPost', name: 'CreatePost', component: 'createPost'
            //     },
            //     {
            //         path: '/post/:id', name: 'Post', component: 'postPage'
            //     },
            //     {
            //         path: '/mediaLibrary', name: 'MediaLibrary', component: 'mediaLibraryPage'
            //     },
            //     {
            //         path: '/userPosts', name: 'UserPosts', component: 'userPosts'
            //     }
            // ],
        });

    function AppCtrl($firebaseAuth, $firebaseObject, $mdSidenav) {
        const self = this;
        self.openSidenav = function () {
            if(self.user) $mdSidenav('left').open();
        };
        const auth = $firebaseAuth();
        auth.$onAuthStateChanged((user) => {
            if (user) {
                let dbUser = $firebaseObject(firebase.database().ref('users/' + user.uid + '/user'));
                (function load(i) {
                    dbUser.$loaded().then((data) => {
                        self.user = dbUser;
                        if(i>20) {self.user = null; return}
                        if (!self.user) load(++i);
                    }).catch((err) => {
                        console.error(err);
                    });
                })(1);
            } else {
                self.user = null;
            }
        });
    }
})(window.angular);
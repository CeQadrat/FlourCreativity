(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('postPage', {
            controller: postPageCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/postPage/postPage-template.html',
            bindings: {
                user: '<',
                post: '<',
                comments: '<'
            }
        });

    function postPageCtrl($firebaseObject, $firebaseAuth) {
        const self = this;
        self.postEdit = false;
        const auth = $firebaseAuth();
        auth.$onAuthStateChanged((user) => {
            if (user) {
                let dbUser = $firebaseObject(firebase.database().ref('users/' + user.uid));
                (function load() {
                    dbUser.$loaded().then((data) => {
                        self.user = data.user;
                        if (!self.user) load();
                    }).catch(console.error);
                })();
            } else {
                self.user = null;
            }
        });
        self.modeChange = function () {
            let dbPosts = $firebaseArray(firebase.database().ref('posts/'));
            dbPosts.$save(self.post);
        }
    }
})(window.angular);
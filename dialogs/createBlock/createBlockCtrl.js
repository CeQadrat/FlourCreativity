(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .controller('createBlockCtrl', createBlockCtrl);

    function createBlockCtrl($mdDialog, $firebaseAuth, $firebaseArray, $firebaseObject, block) {
        const self = this;
        self.blocks = [
            {
                name: 'Text',
                type: 'text'
            },
            {
                name: 'Image',
                type: 'img'
            },
            {
                name: 'Video',
                type: 'video'
            }
        ];
        self.block = block;
        self.addLink = function (link) {
            self.block.imgUrl = link;
        };
        self.loadData = function () {
            if (self.chooseImg && !self.files) {
                let auth = $firebaseAuth();
                let authData = auth.$getAuth();
                if (authData) {
                    let dbUser = $firebaseObject(firebase.database().ref('users/' + authData.uid));
                    dbUser.$loaded().then(function (data) {
                        self.user = data.user;
                        let library = $firebaseArray(firebase.database().ref('mediaLibrary/' + self.user.id));
                        library.$loaded().then(() => {
                            self.files = library;
                        });
                    }).catch(function (err) {
                        console.error(err);
                    });
                } else self.user = null;
            }
        };
        self.hide = function () {
            $mdDialog.hide();
        };
        self.cancel = function () {
            $mdDialog.cancel();
        };
        self.done = function () {
            $mdDialog.hide(self.block);
        }
    }
})(window.angular);
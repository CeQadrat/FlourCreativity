(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('mediaLibrary', {
            controller: mediaLibraryCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/mediaLibrary/mediaLibrary-template.html',
            bindings: {
                user: '=',
                clickFun: '='
            }
        });

    function mediaLibraryCtrl($firebaseArray) {
        const self = this;
        self.imageClick = function (link) {
            if(self.clickFun) self.clickFun(link);
            else alert(link);
        };
        let library = $firebaseArray(firebase.database().ref('mediaLibrary/'+self.user.id));
        library.$loaded().then(() => {
            self.files = library;
        });
        document.getElementById('file').onchange = function () {
            let f = document.getElementById('file').files[0];
            if(f){
                let refFile = firebase.storage().ref().child('mediaLibrary/'+self.user.id+'/'+f.name);
                let putProc = refFile.put(f);
                putProc.on('state_changed', (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                });
                putProc.then((file) => {
                    self.files.$add(file.downloadURL).then(() => {
                        document.getElementById('file').value = '';
                    });
                }).catch(console.error);
            }
        };
        self.add = function () {
            document.getElementById('file').click();
        };
    }
})(window.angular);
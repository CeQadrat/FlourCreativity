(function(angular){
    'use strict';

    angular
        .module('IndexApp')
        .controller('editAvatarCtrl', editAvatarCtrl);

    function editAvatarCtrl($mdDialog, $mdColorPalette, user, userService, $scope, notifyService) {
        let self = this;
        console.log($mdColorPalette);
        self.colors = [];
        for (let key in $mdColorPalette){
            self.colors.push({name: key, hex: $mdColorPalette[key][500].hex});
        }
        self.prewUrl = '';
        self.genMode = false;
        self.genAvatar = function (color) {
            self.prewUrl = userService.createAvatar(user.name[0].toUpperCase(), false, color);
        };
        self.prewInit = function () {
            document.getElementById('avatar').onchange = function () {
                let reader = new FileReader();

                reader.onload = function (e) {
                    self.prewUrl = e.target.result;
                    $scope.$digest();
                };

                reader.readAsDataURL(this.files[0]);
            };
        };
        self.hide = function() {
            $mdDialog.hide();
        };
        self.cancel = function() {
            $mdDialog.cancel();
        };
        self.add = function () {
            document.getElementById('avatar').click();
        };
        self.done = function(){
            let file;
            if(self.genMode) file = userService.createAvatar(user.name[0].toUpperCase(), true, self.color);
            else file = document.getElementById('avatar').files[0];
            userService.changeAvatar(user, file).then(() => {
                notifyService.notify('Avatar edit!');
                $mdDialog.hide();
            });
        }
    }
})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('profilePage', {
            controller: ProfileCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/profilePage/profilePage-template.html',
            bindings:{
                user: '<'
            }
        });

    function ProfileCtrl() {
        const self = this;
    }
})(window.angular);
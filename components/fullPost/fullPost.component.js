(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('fullPost', {
            controller: fullPostCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/fullPost/fullPost-template.html',
            bindings: {
                post: '='
            }
        });

    function fullPostCtrl() {
        const self = this;

    }
})(window.angular);
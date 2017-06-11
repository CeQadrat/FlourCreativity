(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .factory('notifyService', function ($mdToast) {
            var self = this;
            var factory = {};
            factory.notify = function (message) {
                var toast = $mdToast.simple().textContent(message).position('bottom').hideDelay(3000);
                $mdToast.show(toast);
            };
            factory.staticNotify = function () {

            };
            return factory;
        });
})(window.angular);
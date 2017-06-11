(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('minPost', {
            controller: minPostCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/minPost/minPost-template.html',
            bindings: {
                post: '<'
            }
        });

    function minPostCtrl(postService, $element) {
        const self = this;
        let card = angular.element($element[0].children[0].children[3])
        card.ready(() => {
            console.log(card[0].scrollHeight);
            if(card[0].scrollHeight>500) self.smClass = 'show-more';
            else self.smClass = '';
        });
        self.showMore = function () {
            self.smClass = '';
        };
        postService.getComments(self.post.id).then((comments) => {
            self.post.commentLength = comments.length;
        }).catch(console.error);
    }
})(window.angular);
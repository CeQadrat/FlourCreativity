(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('likeButtons', {
            controller: likeButtonsCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/likeButtons/likeButtons-template.html',
            bindings: {
                name: '=',
                item: '<'
            }
        });

    function likeButtonsCtrl(notifyService, likeService, userService, dialogService) {
        const self = this;
        self.like = false;
        self.dislike = false;
        userService.getCurrentUser().then((user) => {
            if (!user) return Promise.reject();
            self.user = user;
            return likeService.isLiked(self.name, self.item.id, self.user.id);
        }).then((like) => {
            if(like == null) return;
            if(like.type == 'like') {
                self.like = true;
            }
            if(like.type == 'dislike') {
                self.dislike = true;
            }
        }).catch(() => {
            self.setRating = dialogService.showLoginDialog;
        });
        self.setRating = function (type) {
            if (type == 'like') {
                likeService.switchLike(self.name, self.item.id, self.user.id).then((likeNum) => {
                    self.item.likes = likeNum;
                    self.like = !self.like;
                    self.dislike = false;
                }).catch((err) => notifyService.notify(err));
            }
            if (type == 'dislike') {
                likeService.switchDislike(self.name, self.item.id, self.user.id).then((likeNum) => {
                    self.item.likes = likeNum;
                    self.dislike = !self.dislike;
                    self.like = false;
                }).catch((err) => notifyService.notify(err));
            }
        }
    }
})(window.angular);
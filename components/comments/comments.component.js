(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('appComments', {
            controller: commentCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/comments/comments-template.html',
            bindings: {
                postId: '=',
                comments: '=',
                user: '<'
            }
        });

    function commentCtrl(dialogService, notifyService, $firebaseArray) {
        const self = this;
        self.showDialog = function (type, ev) {
            if (type == 'login') dialogService.showLoginDialog(ev);
            if (type == 'register') dialogService.showRegistrationDialog(ev);
        };
        self.writeComment = false;
        self.answerId = null;
        self.writingComment = function (log) {
            self.writeComment = log;
            self.answerId = null;
            self.newComment = '';
        };
        self.inputFocus = function () {
            document.getElementById('commentInput').focus();
            document.getElementById('commentInputContainer').className += ' md-input-focused';
        };
        self.answerComment = function (writer) {
            if (self.user) {
                self.writeComment = true;
                self.answerId = writer.id;
                self.newComment = '@' + writer.name + ', ';
            }
            if (!self.user) {
                self.showDialog('login', null);
            }
        };
        self.sendComment = function () {
            if (self.newComment[0] == '@')
                self.newComment = '<a href="/profile/'+self.answerId+'">'+self.newComment.slice(0, self.newComment.indexOf(','))
                    +'</a>'+self.newComment.slice(self.newComment.indexOf(','));
            let comment = {
                text: self.newComment,
                postId: self.postId,
                writerId: self.user.id,
                date: Date.now(),
                likes: 0
            };

            let dbComments = $firebaseArray(firebase.database().ref('comments/'));
            dbComments.$add(comment).then((ref) => {
                comment.id = ref.key;
                dbComments.$getRecord(ref.key).id = ref.key;
                return dbComments.$save(dbComments.$indexFor(ref.key));
            }).then(() => {
                self.comments.push(comment);
                notifyService.notify('Comment add');
                self.writingComment(false);
            }).catch(console.error);
        };
    }
})(window.angular);
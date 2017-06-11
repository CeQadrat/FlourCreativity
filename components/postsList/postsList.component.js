(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('postsList', {
            controller: PostsCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/postsList/postsList-template.html',
            bindings: {
                posts: '<'
            }
        });

    function PostsCtrl() {
        const self = this;

        // $scope.$watch(function () {
        //         return self.rowNum;
        //     },
        //     function () {
        //         self.latestPosts = transformationPost(self.latestPosts, self.rowNum);
        //         self.popularPosts = transformationPost(self.popularPosts, self.rowNum);
        //         self.postFlex = 90 / self.rowNum;
        //     }
        // );
        // function transformationPost(posts, num) {
        //     var transformPosts = [];
        //     for (var i = 0; i < num; i++) {
        //         transformPosts[i] = [];
        //         for (var j = 0, k = 0; j < posts.length; j++) {
        //             if (j % num == i % num) {
        //                 transformPosts[i][k] = posts[j];
        //                 k++;
        //             }
        //         }
        //     }
        //     return transformPosts;
        // }
    }
})(window.angular);
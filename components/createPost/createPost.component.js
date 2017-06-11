(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .component('createPost', {
            controller: createPostCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/createPost/createPost-template.html',
            bindings: {
                post: '='
            }
        });

    function createPostCtrl($firebaseArray, notifyService, $state, $showdown) {
        const self = this;
        self.save = function () {
            //Some "kosyl" for textAngular
            {
                let post = self.post.content;
                while (~post.indexOf('<img class=\"ta-insert-video\"')) {
                    let spos = 0, epos = 0;
                    spos = post.indexOf('<img class=\"ta-insert-video\"');
                    epos = post.indexOf('/>', spos);
                    let styles = post.slice(post.indexOf('style', spos) + 7, post.indexOf('\"', post.indexOf('style', spos) + 7));
                    console.log(post);
                    console.log(spos, epos);
                    console.log(styles);
                    let videoUrl = 'https://www.youtube.com/watch?v=' + post.slice(post.indexOf('/embed/', spos) + 7, post.indexOf('"', post.indexOf('/embed/', spos)));
                    post = post.slice(0, spos) + '<youtube-video video-url="\'' + videoUrl + '\'" player-width="\'100%\'" player-height="\'100%\'" style="' + styles + '"></youtube-video>' + post.slice(epos + 2);
                }
                while (~post.indexOf('class=\"md-divider\"')) {
                    let spos = 0, epos = 0;
                    spos = post.indexOf('<div class="md-divider"');
                    epos = post.indexOf('</div>', spos) + 6;
                    post = post.slice(0, spos) + '<md-divider></md-divider>' + post.slice(epos);
                }
                self.post.content = post;
            }

            //Convert blocks
            if (self.blockStyle) {
                let content = '';
                self.post.blocks.forEach((block) => {
                    content += '<div layout="row" layout-align="center center" class="card-blocks">';
                    if (block.type == 'text') {
                        if (block.markdown) block.text = $showdown.makeHtml(block.text);
                        content += '<div layout-fill>' +
                            '<div class="card-text">' +
                            block.text +
                            '</div>' +
                            '</div>';
                    }
                    if (block.type == 'img') {
                        content += '<div layout="column" layout-align="center center">' +
                            '<div class="image-block">' +
                            '<img src="' + block.imgUrl + '" class="card-image">' +
                            '</div>' +
                            '<div class="card-text"><i>' + block.description + '</i></div>' +
                            '</div>';
                    }
                    if (block.type == 'video') {
                        content += '<div class="video-block">' +
                            '<div class="card-video">' +
                            '<youtube-video video-url="' + block.videoUrl + '" player-width="\'100%\'" ' +
                            'player-height="\'100%\'"></youtube-video>' +
                            '</div>' +
                            '</div>';
                    }
                    content += '</div>';
                });
                self.post.content = content;
            }
            delete self.post.blocks;
            self.post.writerId = self.post.writer.id;
            delete self.post.writer;

            let dbPosts = $firebaseArray(firebase.database().ref('posts/'));
            self.post.date = Date.now();
            if (self.post.markdown) {
                self.post.content = $showdown.makeHtml(self.post.content);
            }
            delete self.post.markdown;
            dbPosts.$add(self.post).then((ref) => {
                dbPosts.$getRecord(ref.key).id = ref.key;
                self.post.id = ref.key;
                return dbPosts.$save(dbPosts.$indexFor(ref.key));
            }).then(() => {
                let promises = [];
                self.post.tags.forEach((tag) => {
                    promises.push($firebaseArray(firebase.database().ref('tags/' + tag)).$add(self.post.id));
                });
                return Promise.all(promises);
            }).then(() => {
                notifyService.notify('Post save');
                $state.go('post', {postId: self.post.id});
            }).catch(console.error);
        }
    }
})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .factory('postService', ($firebaseArray, $firebaseObject, $q, userService) => {
            const self = this;
            let factory = {};
            factory.getPost = function (id) {
                let deffered = $q.defer();
                let dbPost = $firebaseObject(firebase.database().ref('posts/'+id));
                dbPost.$loaded().then((data) => {
                    return factory.addWriter(dbPost)
                }).then((post) => {
                    deffered.resolve(post);
                }).catch((err) => {
                    console.error(err);
                    deffered.reject(null);
                });
                return deffered.promise;
            };
            factory.getComments = function (postId) {
                let deffered = $q.defer();
                let comments = [];
                firebase.database().ref().child('comments')
                    .orderByChild('postId')
                    .equalTo(postId)
                    .on("value", (snapshot) => {
                        let promises = [];
                        if (snapshot.val()) comments = Object.values(snapshot.val());
                        for(let i=0; i<comments.length; i++){
                            promises.push(factory.addWriter(comments[i]));
                        }
                        Promise.all(promises).then((comments) => {
                            deffered.resolve(comments);
                        }).catch(console.error);
                    });
                return deffered.promise;
            };
            factory.getUserPosts = function (userId) {
                let deffered = $q.defer();
                let posts = [];
                firebase.database().ref().child('posts')
                    .orderByChild('writerId')
                    .equalTo(userId)
                    .on("child_added", (snapshot) => {
                        let post = snapshot.val();
                        factory.addWriter(post).then((post) => {
                            posts.push(post);
                            deffered.resolve(posts);
                        });
                    });
                return deffered.promise;
            };
            factory.getAllPosts = function () {
                let deffered = $q.defer();
                let dbPosts = $firebaseArray(firebase.database().ref('posts'));
                dbPosts.$loaded().then((posts) => {
                    let promises = [];
                    for(let i=0; i<posts.length; i++){
                        promises.push(factory.addWriter(posts[i]));
                    }
                    return Promise.all(promises);
                }).then((posts) => {
                    deffered.resolve(posts);
                }).catch((err) => {
                    console.error(err);
                    deffered.reject(null);
                });
                return deffered.promise;
            };
            factory.getFavoritePosts = function (userId) {
                let deffered = $q.defer();
                let posts = [];
                firebase.database().ref('likes').child('post')
                    .orderByChild('userId')
                    .equalTo(userId)
                    .on("value", (snapshot) => {
                        let likes = [];
                        if (snapshot.val()) {
                            likes = snapshot.val();
                            let promises = [];
                            for (let key in likes) {
                                promises.push(
                                    $firebaseObject(firebase.database().ref('/posts/' + likes[key].itemId)).$loaded().then((post) => {
                                        return factory.addWriter(post);
                                    })
                                );
                            }
                            Promise.all(promises).then((posts) => {
                                deffered.resolve(posts);
                            }).catch((err) => {
                                console.error(err);
                                deffered.reject(null);
                            });

                        }
                        else deffered.resolve(posts);
                    });
                return deffered.promise;
            };
            factory.getPostsByTag = function (tag) {
                let deffered = $q.defer();
                let posts = [];
                firebase.database().ref().child('tags/'+tag)
                    .on("value", (snapshot) => {
                        let promises = [];
                        for (let key in snapshot.val()) {
                            promises.push($firebaseObject(firebase.database().ref('/posts/' + snapshot.val()[key])).$loaded().then((post) => {
                                return factory.addWriter(post);
                            }));
                        }
                        deffered.resolve(posts);
                    });
                return deffered.promise;
            };
            factory.getTags = function (st) {
                let deffered = $q.defer();
                let tags = [];
                firebase.database().ref().child('tags')
                    .orderByKey()
                    .startAt(st)
                    .on("child_added", (snapshot) => {
                        if (~snapshot.key.indexOf(st)) tags.push(snapshot.key);
                        deffered.resolve(tags);
                    });
                return deffered.promise;
            };
            factory.addWriter = function (post) {
                return $q((resolve, reject) => {
                    userService.getUser(post.writerId).then((user) => {
                        post.writer = user;
                        resolve(post);
                    }).catch(reject);
                });
            };
            return factory;
        });
})(window.angular);
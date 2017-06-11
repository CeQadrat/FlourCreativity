(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .factory('likeService', function ($firebaseObject, $firebaseArray, $q) {
            const self = this;
            let factory = {};
            factory.switchLike = function (item, itemId, userId) {
                self.item = item;
                self.itemId = itemId;
                self.userId = userId;
                return $q((resolve, reject) => {
                    self._removeLike().then((prevLikeType) => {
                        if (prevLikeType == 'like') {
                            return self._changeLikeNum(-1);
                        }
                        if (prevLikeType == 'dislike') {
                            let dbLikes = $firebaseArray(firebase.database().ref('likes/' + item + '/'));
                            return dbLikes.$add({itemId: itemId, userId: userId, type: 'like'}).then(() => {
                                return self._changeLikeNum(2);
                            });
                        }
                        if (prevLikeType == null) {
                            let dbLikes = $firebaseArray(firebase.database().ref('likes/' + item + '/'));
                            return dbLikes.$add({itemId: itemId, userId: userId, type: 'like'}).then(() => {
                                return self._changeLikeNum(1);
                            });
                        }
                    }).then((likeNum) => {
                        resolve(likeNum);
                    }).catch((err) => reject(err));
                });
            };
            factory.switchDislike = function (item, itemId, userId) {
                self.item = item;
                self.itemId = itemId;
                self.userId = userId;
                return $q((resolve, reject) => {
                    self._removeLike().then((prevLikeType) => {
                        if (prevLikeType == 'dislike') {
                            return self._changeLikeNum(1);
                        }
                        if (prevLikeType == 'like') {
                            let dbLikes = $firebaseArray(firebase.database().ref('likes/' + item + '/'));
                            return dbLikes.$add({itemId: itemId, userId: userId, type: 'dislike'}).then(() => {
                                return self._changeLikeNum(-2);
                            });
                        }
                        if (prevLikeType == null) {
                            let dbLikes = $firebaseArray(firebase.database().ref('likes/' + item + '/'));
                            return dbLikes.$add({itemId: itemId, userId: userId, type: 'dislike'}).then(() => {
                                return self._changeLikeNum(-1);
                            });
                        }
                    }).then((likeNum) => {
                        resolve(likeNum);
                    }).catch((err) => reject(err));
                });
            };
            factory.isLiked = function (item, itemId, userId) {
                self.item = item;
                self.itemId = itemId;
                self.userId = userId;
                return self._getLike();
            };
            self._changeLikeNum = function (num) {
                return $q((resolve, reject) => {
                    let likesCount = $firebaseObject(firebase.database().ref('/' + self.item + 's/' + self.itemId + '/likes'));
                    likesCount.$loaded().then(() => {
                        likesCount.$value = likesCount.$value + num;
                        return likesCount.$save();
                    }).then(() => {
                        resolve(likesCount.$value);
                    }).catch((err) => reject(err));
                });
            };
            self._getLike = function () {
                return $q((resolve, reject) => {
                    let ev = firebase.database().ref('likes').child(self.item)
                        .orderByChild('itemId')
                        .equalTo(self.itemId);
                    ev.on('value', (snapshot) => {
                        let likes = snapshot.val();
                        let likesCount = 0;
                        for (let key in likes) {
                            if (likes[key].userId == self.userId) {
                                resolve({
                                    id: key,
                                    type: likes[key].type
                                });
                            }
                            likesCount++;
                        }
                        ev.off('value');
                        resolve(null);
                    });
                });
            };
            self._removeLike = function () {
                return $q((resolve, reject) => {
                    self._getLike().then((like) => {
                        if (like) {
                            firebase.database().ref('likes/' + self.item + '/' + like.id).remove();
                            resolve(like.type);
                        } else resolve(null);
                    });
                });
            };
            return factory;
        });
})(window.angular);
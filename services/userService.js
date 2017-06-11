(function (angular) {
    'use strict';

    angular
        .module('IndexApp')
        .factory('userService', function ($firebaseAuth, $firebaseObject, $firebaseArray, $q) {
            let user = null;
            const auth = $firebaseAuth();
            let factory = {};
            factory.signInWithEmailAndPassword = function (email, password) {
                return $q((resolve, reject) => {
                    auth.$signInWithEmailAndPassword(email, password).then(resolve).catch(reject);
                })
            };
            factory.createAvatar = function (letter, blob, bgColor) {
                let canvas = document.createElement('canvas');
                canvas.id = "avatar-" + Date.now();
                canvas.width = 200;
                canvas.height = 200;

                let ctx = canvas.getContext('2d');
                ctx.fillStyle = bgColor ? bgColor : 'indigo';
                console.log(ctx.fillStyle);
                ctx.fillRect(0, 0, 200, 200);

                ctx.font = 100 + " " + 100 + "px sans-serif";

                ctx.shadowColor = 'black';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;

                ctx.textAlign = "center";
                ctx.fillStyle = 'white';
                //ctx.fillText(_str, WIDTH / 2, HEIGHT - (HEIGHT / 2) + ( _font_size / 3) + 5 );
                ctx.fillText(letter, 100, 200 - 100 + ( 100 / 3));
                let dataURI = canvas.toDataURL();
                if (!blob) {
                    return dataURI;
                } else {
                    let byteString;
                    byteString = atob(dataURI.split(',')[1]);

                    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                    let ia = new Uint8Array(byteString.length);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    return new Blob([ia], {type: mimeString});
                }
            };
            factory.changeAvatar = function (user, file) {
                return $q((resolve, reject) => {
                    let refFile = firebase.storage().ref().child('avatars/' + user.email + '.png');
                    refFile.put(file).then((f) => {
                        user.avatar = f.downloadURL;
                        return factory.updateUser(user);
                    }).then(() => {
                        resolve();
                    }).catch(console.error);
                });
            };
            factory.createUser = function (email, name, password) {
                return $q((resolve, reject) => {
                    let pic = factory.createAvatar(name[0].toUpperCase(), true);

                    let refFile = firebase.storage().ref().child('avatars/' + email + '.png');
                    refFile.put(pic).then((file) => {
                        auth.$createUserWithEmailAndPassword(email, password).then((userData) => {
                            user = {
                                id: userData.uid,
                                email: userData.email,
                                name: name,
                                avatar: file.downloadURL,
                                createDate: Date.now(),
                                birthdayDate: null,
                                gender: null,
                                city: null
                            };
                            let dbUser = $firebaseObject(firebase.database().ref('users/' + user.id));
                            dbUser.$loaded().then((base) => {
                                userData.sendEmailVerification();
                                if (base.user) {
                                    resolve(user);
                                } else {
                                    dbUser.user = user;
                                    dbUser.credential = null;
                                    dbUser.$save().then((ref) => {
                                        resolve(user);
                                    });
                                }
                            });
                        }).catch((err) => {
                            reject(err)
                        });

                    }).catch(console.error);
                });
            };
            factory.signInPopup = function (provider) {
                return $q((resolve, reject) => {
                    auth.$signInWithPopup(provider).then((data) => {
                        let userData = data.user;
                        user = {
                            id: userData.uid,
                            email: userData.email,
                            name: userData.displayName,
                            avatar: userData.photoURL,
                            createDate: Date.now(),
                            birthdayDate: null,
                            gender: null,
                            city: null
                        };
                        let dbUser = $firebaseObject(firebase.database().ref('users/' + user.id));
                        dbUser.$loaded().then((base) => {
                            if (base.user) {
                                resolve(user);
                            } else {
                                dbUser.user = user;
                                dbUser.credential = data.credential;
                                dbUser.$save().then((ref) => {
                                    resolve(user);
                                });
                            }
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                });
            };
            factory.updateUser = function (user) {
                if (!user.$id) {
                    let updates = {};
                    console.log(user);
                    updates['users/' + user.id + '/user'] = user;
                    return firebase.database().ref().update(updates);
                } else {
                    return user.$save();
                }
            };
            factory.getUser = function (id) {
                let deffered = $q.defer();
                let dbUser = $firebaseObject(firebase.database().ref('users/' + id + '/user'));
                dbUser.$loaded().then((data) => {
                    deffered.resolve(dbUser);
                }).catch((err) => {
                    console.error(err);
                    deffered.resolve(null);
                });
                return deffered.promise;
            };
            factory.getCurrentUser = function () {
                let deffered = $q.defer();
                const auth = $firebaseAuth();
                let authData = auth.$getAuth();
                if (authData) {
                    let dbUser = $firebaseObject(firebase.database().ref('users/' + authData.uid));
                    dbUser.$loaded().then((data) => {
                        deffered.resolve(data.user);
                    }).catch((err) => {
                        console.error(err);
                        deffered.resolve(null);
                    });
                } else deffered.resolve(null);
                return deffered.promise;
            };
            factory.logout = function () {
                return $q((resolve, reject) => {
                    $firebaseAuth().$signOut().then(() => {
                        user = null;
                        resolve();
                    }).catch(reject);
                });
            };
            return factory;
        });
})(window.angular);
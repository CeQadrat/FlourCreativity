'use strict';

const app = angular.module('IndexApp', ['ngMaterial','ngMdIcons','youtube-embed', 'firebase', 'ngSanitize', 'ng-showdown', 'ui.router', 'textAngular']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('index', {
        url: '/',
        component: 'postsList',
        resolve: {
            posts: (postService) => postService.getAllPosts()
        }
    });
    $stateProvider.state('profile', {
        url: '/profile/:userId',
        component: 'profilePage',
        resolve: {
            user: ($stateParams, userService) => userService.getUser($stateParams.userId)
        }
    });
    $stateProvider.state('tags', {
        url: '/tags/:tag',
        component: 'postsList',
        resolve: {
            posts: ($stateParams, postService) => postService.getPostsByTag($stateParams.tag)
        }
    });
    $stateProvider.state('createPost', {
        url: '/createPost',
        component: 'createPost',
        resolve: {
            post: (userService, $q) => {
                let deferred = $q.defer();
                userService.getCurrentUser().then((user) => {
                    let post =  {
                        content: '',
                        markdown: false,
                        writer: {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        },
                        title: 'Some title',
                        date: Date.now(),
                        tags: [],
                        likes: 0
                    };
                    deferred.resolve(post);
                });
                return deferred.promise;
            }
        }
    });
    $stateProvider.state('post', {
        url: '/post/:postId',
        component: 'postPage',
        resolve: {
            post: (postService, $stateParams) => postService.getPost($stateParams.postId),
            comments: (postService, $stateParams) => postService.getComments($stateParams.postId),
            user: (userService) => userService.getCurrentUser()
        }
    });
    $stateProvider.state('library', {
        url: '/mediaLibrary',
        component: 'mediaLibrary',
        resolve: {
            user: (userService) => userService.getCurrentUser(),
            clickFun: () => null
        }
    });
    $stateProvider.state('userPosts', {
        url: '/userPosts/:userId',
        component: 'postsList',
        resolve: {
            posts: (postService, $stateParams) => postService.getUserPosts($stateParams.userId)
        }
    });
    $stateProvider.state('favoritePosts', {
        url: '/favoritePosts/:userId',
        component: 'postsList',
        resolve: {
            posts: (postService, $stateParams) => postService.getFavoritePosts($stateParams.userId)
        }
    });
    $urlRouterProvider.otherwise('/');
});

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal');
});

app.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', 'taSelection', '$delegate', 'dialogService', '$window', 'taTranslations', 'taToolFunctions', function(taRegisterTool, taSelection, taOptions, dialogService, $window, taTranslations, taToolFunctions) {
        taRegisterTool('libraryImage', {
            iconclass: 'fa fa-clipboard',
            tooltiptext: 'Add image from Media Library',
            action: function() {
                dialogService.showChooseImgDialog(null).then((imageLink) => {
                    let embed = '<img src="' + imageLink + '">';
                    return this.$editor().wrapSelection('insertHTML', embed, true);
                }).catch(() => {

                });
            }
        });
        taRegisterTool('insertVideoYT', {
            iconclass: 'fa fa-youtube-play',
            tooltiptext: taTranslations.insertVideo.tooltip,
            action: function(){
                let urlPrompt;
                urlPrompt = $window.prompt(taTranslations.insertVideo.dialogPrompt, 'https://');
                if (urlPrompt && urlPrompt !== '' && urlPrompt !== 'https://') {
                    let videoId = taToolFunctions.extractYoutubeVideoId(urlPrompt);
                    if (videoId) {
                        console.log(videoId);
                        console.log(angular.element("<div>" + '<youtube-video video-url="' + urlPrompt + '" player-width="\'100%\'" player-height="\'100%\'"></youtube-video>' + "</div>"));
                        let embed = '<youtube-video video-url="' + urlPrompt + '" player-width="\'100%\'" player-height="\'100%\'"></youtube-video>';

                        return this.$editor().wrapSelection('insertHTML', embed, true);
                    }
                }
            },
            onElementSelect: {
                element: 'youtube-video',
                action: taToolFunctions.imgOnSelectAction
            }
        });
        taRegisterTool('divider', {
            iconclass: 'fa fa-window-minimize',
            tooltiptext: 'Add divider',
            action: function() {
                let embed = '<div class="md-divider"></div>';
                return this.$editor().wrapSelection('insertHTML', embed);
            }
        });
        taOptions.toolbar[3].splice(2, 0, 'libraryImage');
        // taOptions.toolbar[3][4] = 'insertVideoYT';
        taOptions.toolbar[1].splice(6, 0, 'divider');
        return taOptions;
    }]);
});

app.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}]);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
    });
}else{
    console.log('Service worker not found');
}

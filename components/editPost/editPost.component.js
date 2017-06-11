(function(angular){
    'use strict';

    angular
        .module('IndexApp')
        .component('editPost',{
            controller: editPostCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'components/editPost/editPost-template.html',
            bindings:{
                post: '=',
                blockStyle: '='
            }
        });

    function editPostCtrl(dialogService, notifyService, postService, $mdBottomSheet){
        const self = this;
        self.editTitle=false;
        self.post.blocks=[];
        self.querySearch = function (query) {
            return postService.getTags(query);
        };
        self.showCreateBlockDialog = function (ev) {
            dialogService.showCreateBlockDialog(ev, {}).then(function (block) {
                self.post.blocks.push(block);
                notifyService.notify('Block add');
            }).catch(console.error);
        };
        self.showBlockActions = function (blockIndex) {
            $mdBottomSheet.show({
                templateUrl: 'components/editPost/blockActions-template.html',
                controller: blockActionsCtrl,
                controllerAs: 'ctrl',
                locals: {
                    blockIndex: blockIndex,
                    blocks: self.post.blocks
                }
            }).then(function(blocks) {
                self.post.blocks = blocks;
            });
        }
    }
    function blockActionsCtrl($mdBottomSheet, dialogService, blockIndex, blocks) {
        const self = this;
        self.blockIndex = blockIndex;
        self.blocks = blocks;
        self.moveBlockUp = function (index) {
            let buf = self.blocks[index];
            self.blocks[index] = self.blocks[index-1];
            self.blocks[index-1] = buf;
        };
        self.moveBlockDown = function (index) {
            let buf = self.blocks[index];
            self.blocks[index] = self.blocks[index+1];
            self.blocks[index+1] = buf;
        };
        self.editBlock = function (index) {
            dialogService.showCreateBlockDialog(null, self.blocks[index]).then((block) => {
                self.blocks[index] = block;
            }).catch(console.error);
        };
        self.removeBlock = function (index) {
            self.blocks.splice(index, 1);
        };
        self.actions = [
            {name: 'Move up', icon: 'arrow_upwards', click: self.moveBlockUp},
            {name: 'Move down', icon: 'arrow_downward', click: self.moveBlockDown},
            {name: 'Edit', icon: 'edit', click: self.editBlock},
            {name: 'Delete', icon: 'delete', click: self.removeBlock},
        ];
        self.clickAction = function (index) {
            self.actions[index].click(blockIndex);
            $mdBottomSheet.hide(self.blocks);
        }
    }
})(window.angular);
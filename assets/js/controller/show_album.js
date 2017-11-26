BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    //相册详情页
    Controller.showAlbum = {
        showAlbumById:function (model) {
            var albumItemView = new BlogAppManager.List.ShowAlbumItem();

            BlogAppManager.mainRegion.show(albumItemView);
            BlogAppManager.trigger("menu:select:5");
        }
    }
});
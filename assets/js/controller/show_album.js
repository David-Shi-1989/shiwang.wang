BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    //相册详情页
    Controller.showAlbum = {
        showAlbumById:function (id) {
            var images = BlogAppManager.request("albumitems:entities",id);
            var albumItemView = new BlogAppManager.List.ShowAlbumItemView({
                collection:images
            });

            BlogAppManager.mainRegion.show(albumItemView);
            BlogAppManager.trigger("menu:select:5");
        }
    }
});
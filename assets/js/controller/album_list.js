BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.Album = {
        showList:function (model) {
            var albums = BlogAppManager.request("albumlist:entities");
            var albumListView = new BlogAppManager.List.AlbumListView({
                collection:albums
            });

            BlogAppManager.mainRegion.show(albumListView);
            BlogAppManager.trigger("menu:select:5");
        }
    }
});
BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.AlbumListItem = Marionette.ItemView.extend({
        tagName:"li",
        template:"#album-page-list-item",
        className:"album-item",
        events:{
            "click div.image-item-imageWrapper":"openCurrentAlbum",
            "click div.image-item-des > a":"openCurrentAlbum"
        },
        openCurrentAlbum:function (evt) {
            if(evt){
                evt.preventDefault();
                evt.stopPropagation();
            }
            BlogAppManager.navigate("album/"+this.model.get("id"));
            BlogAppManager.Controller.showAlbum.showAlbumById(this.model.get("id"));
        }
    });

    List.AlbumListView = Marionette.CompositeView.extend({
        tagName: "ul",
        id: "imageContainer",
        childView: List.AlbumListItem,
        template: "#album-page-list",
        childViewContainer:"#imageContainerWrapper"
    });
});
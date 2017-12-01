BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.MessageListItem = Marionette.ItemView.extend({
        tagName:"li",
        template:"#message-page-item",
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

    List.MessageListView = Marionette.CompositeView.extend({
        tagName: "ul",
        id: "messageUL",
        childView: List.MessageListItem,
        template: "#message-page",
        childViewContainer:"#messageContainer"
    });
});
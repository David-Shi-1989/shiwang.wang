BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.AlbumListItem = Marionette.ItemView.extend({
        tagName:"li",
        template:"#album-page-list-item",
        className:"album-item"
    });

    List.AlbumListView = Marionette.CompositeView.extend({
        tagName: "ul",
        id: "imageContainer",
        childView: List.AlbumListItem,
        template: "#album-page-list",
        childViewContainer:"#imageContainerWrapper"
    });
});
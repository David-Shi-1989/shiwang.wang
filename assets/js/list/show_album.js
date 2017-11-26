BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ShowAlbumItem = Marionette.ItemView.extend({
        tagName:"div",
        template:"#album-page-item-image",
        className:"imageWrapper",
        events:{
            // "click li.bl-article-item":"openCurrentImage"
        },
        openCurrentImage:function (evt) {
            if(evt){
                evt.preventDefault();
                evt.stopPropagation();
            }
            
            // BlogAppManager.navigate("article/"+this.model.get("id"));
            // BlogAppManager.Controller.showArticle.showArticleById(this.model);
        }
    });

    List.ShowAlbumItemView = Marionette.CompositeView.extend({
        tagName: "ul",
        id: "imageContainer",
        childView: List.ShowAlbumItem,
        template: "#album-page-item",
        childViewContainer:"#imagesContainer"
    });
});
BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ShowAlbumItem = Marionette.ItemView.extend({
        tagName:"div",
        template:"#album-pate-item",

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
});
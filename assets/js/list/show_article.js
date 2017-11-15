BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ShowArticleItem = Marionette.ItemView.extend({
        tagName:"div",
        template:"#article-show",

        events:{
            "click li.bl-article-item":"openCurrentArticle"
        },
        openCurrentArticle:function (evt) {
            if(evt){
                evt.preventDefault();
                evt.stopPropagation();
            }
            
            BlogAppManager.navigate("article/"+this.model.get("id"));
            BlogAppManager.Controller.showArticle.showArticleById(this.model);
        }
    });
});
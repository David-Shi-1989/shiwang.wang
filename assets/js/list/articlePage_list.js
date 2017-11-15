BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ShowArticlePageList = Marionette.ItemView.extend({
        tagName:"li",
        template:"#article-page-list-item",
        className:"bl-article-item bl-tag-original",
        events:{
            "click":"openCurrentArticle"
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

    List.ArticlePageListView = Marionette.CompositeView.extend({
        tagName: "ul",
        id: "blog_list",
        childView: List.ShowArticlePageList,
        template: "#article-page-list",
        childViewContainer:"ul"
    });
});
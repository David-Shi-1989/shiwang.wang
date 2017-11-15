BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ArticleItemView = Marionette.ItemView.extend({
        tagName:"li",
        className:"article-info cannot-select",
        template:"#blog-article-list-item",

        events:{
            "click a.article-title,a.article-btn-readmore":"openCurrentArticle"
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

    List.ArticlesView = Marionette.CompositeView.extend({
        tagName:"ul",
        id:"articleList",
        childView:List.ArticleItemView,
        template:"#blog-article-list-view"
        // childViewContainer:"ul"
    });
});
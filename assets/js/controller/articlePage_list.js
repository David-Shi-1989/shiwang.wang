BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.ShowArticlePageList = {
        show:function (model) {
            var articles = BlogAppManager.request("blogarticlelist:entities");
            var articlesListView = new BlogAppManager.List.ArticlePageListView({
                collection:articles
            });

            BlogAppManager.mainRegion.show(articlesListView);
            BlogAppManager.trigger("menu:select:2");
        }
    }
});
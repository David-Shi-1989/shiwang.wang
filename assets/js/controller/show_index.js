BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.indexList = {
        listIndexItems:function () {
            var articles = BlogAppManager.request("indexarticlelist:entities");

            var articlesListView = new BlogAppManager.List.ArticlesView({
                collection:articles
            });

            BlogAppManager.mainRegion.show(articlesListView);
            BlogAppManager.trigger("menu:select:1");
        }
    }
});
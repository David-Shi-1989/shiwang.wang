BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.showArticle = {
        showArticleById:function (model) {
            var articlesItemView = new BlogAppManager.List.ShowArticleItem();

            BlogAppManager.mainRegion.show(articlesItemView);
            BlogAppManager.trigger("menu:select:2");
        }
    }
});
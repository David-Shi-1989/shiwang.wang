BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.Product = {
        showList:function (model) {
            var products = BlogAppManager.request("productlist:entities");
            var productListView = new BlogAppManager.List.ProductListView({
                collection:products
            });

            BlogAppManager.mainRegion.show(productListView);
            BlogAppManager.trigger("menu:select:4");
        }
    }
});
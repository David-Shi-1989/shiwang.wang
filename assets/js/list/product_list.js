BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ProductListItem = Marionette.ItemView.extend({
        tagName:"div",
        template:"#product-page-item",
        className:"col-lg-4 col-md-4 col-sm-6"
    });

    List.ProductListView = Marionette.CompositeView.extend({
        tagName: "div",
        id: "product_list",
        childView: List.ProductListItem,
        template: "#product-page",
        childViewContainer:"#demoContainer"
    });
});
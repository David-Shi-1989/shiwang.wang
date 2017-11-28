BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.ProductListItem = Marionette.ItemView.extend({
        tagName:"div",
        template:"#product-page-item",
        className:"col-lg-4 col-md-4 col-sm-6",
        events:{
            "click a.cover-img span.cover-des,div.cover-info h5":"openCurrentProduct"
        },
        openCurrentProduct:function (evt) {
            if(evt){
                evt.preventDefault();
                evt.stopPropagation();
            }
            var productId = this.model.get("id");
            BlogAppManager.Controller.Product.showProduct(productId,this.model);
            // BlogAppManager.navigate("article/"+this.model.get("id"));
            // BlogAppManager.Controller.showArticle.showArticleById(this.model);
        }
    });

    List.ProductListView = Marionette.CompositeView.extend({
        tagName: "div",
        id: "product_list",
        childView: List.ProductListItem,
        template: "#product-page",
        childViewContainer:"#demoContainer"
    });

    List.ShowProduct = Marionette.ItemView.extend({
        tagName:"div",
        template:"#show-product-page",
        // events:{
        //     "click a.cover-img span.cover-des,div.cover-info h5":"openCurrentProduct"
        // },
        // openCurrentProduct:function (evt) {
        //     if(evt){
        //         evt.preventDefault();
        //         evt.stopPropagation();
        //     }
        //     var productId = this.model.get("id");
        //     // BlogAppManager.navigate("article/"+this.model.get("id"));
        //     // BlogAppManager.Controller.showArticle.showArticleById(this.model);
        // }
    });
});
BlogAppManager.module("Entities",function (Entities,BlogAppManager,Backbone,Marionette,$,_) {
    Entities.ProductListModel = Backbone.Model.extend({
        default:{
            author:"david"
        }
    });

    Entities.ProductListCollection = Backbone.Collection.extend({
        model:Entities.ProductListModel,
    });

    var productList;//Index Page

    var initializeProductList = function () {
        productList = new Entities.ProductListCollection([
            {
                id:1,
                title:"BootStrap Validator",
                notes:"基于BootStrap的表单验证,支持自定义正则验证及Ajax验证。",
                image:"assets/image/demos/bootstrapValidator.png",
                view:12,like:22,
                url:"./demos/bootstrap-validator/index.html"
            },
            {
                id:2,
                title:"自动寻路算法",
                notes:"基于A*算法的自动寻路AI。",
                image:"assets/image/demos/routerSearch.png",
                view:12,like:22,
                url:"./demos/A-route-ai/index.html"
            },
            {
                id:3,
                title:"HTML代码高亮",
                notes:"读取HTML代码，采用树形结构构造标签。最终输出带样式的HTML代码。常用于博客代码展示。",
                image:"assets/image/demos/ligthcode-1.png",
                view:12,like:22,
                url:"./demos/light-code/index.html"
            },
            {
                id:4,
                title:"BootStrap富文本采集",
                notes:"富文本多信息采集",
                image:"assets/image/demos/richText.png",
                view:12,like:22,
                url:"./demos/bootstrap-step-form/index.html"
            },
            {
                id:5,
                title:"Backbone.js教程翻译",
                notes:"基于Backbone英文文档结构,将联系人app改写成股票app。同时结合使用Marionette.backbone.js MVC开发模式。",
                image:"assets/image/demos/backbone.stock.png",
                view:12,like:22,
                url:"./demos/A-route-ai/index.html"
            }
        ]);
    };

    var API = {
        getProductList:function () {
            if(productList == undefined){
                initializeProductList();
            }
            return productList;
        },
        getProductById:function (productId) {
            if(productList == undefined){
                initializeProductList();
            }

            return productList.get(productId);
        }
    };

    BlogAppManager.reqres.setHandler("productlist:entities",function () {
        return API.getProductList();
    });

    BlogAppManager.reqres.setHandler("product:entities",function (productId) {
        return API.getProductById(productId);
    });
});
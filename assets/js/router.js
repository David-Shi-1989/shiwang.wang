BlogAppManager.module("BlogApp",function (BlogApp,BlogAppManager,Backbone,Marionette,$,_) {
    BlogApp.Router = Marionette.AppRouter.extend({
        appRoutes:{
            "":"showIndex",
            "article":"listArticle",
            "resume":"showResume",
            "product":"listProduct",
            "album":"listAlbum",
            "message":"listMessage",

            "article/:id":"showArticleById",
            "album/:id":"showAlbumById"
        }
    });

    var aMenuIdEnum = BlogAppManager.request("menuidenum:entities");
    var API = {
        menuIdEnum:aMenuIdEnum,
        showIndex:function () {
            BlogAppManager.Controller.indexList.listIndexItems();
        },
        listArticle:function () {
            BlogAppManager.Controller.ShowArticlePageList.show();
        },
        showResume:function () {
            BlogAppManager.Controller.ResumePage.showResume();
        },
        listProduct:function () {
            BlogAppManager.Controller.Product.showList();
        },
        listAlbum:function () {
            BlogAppManager.Controller.Album.showList();
        },
        listMessage:function () {
            BlogAppManager.trigger("menu:select:"+this.menuIdEnum.message);
        },

        showArticleById:function (id) {
            BlogAppManager.Controller.showArticle.showArticleById(this.model);
        },
        showAlbumById:function (id) {
            BlogAppManager.Controller.showAlbum.showAlbumById(this.model);
        }
    };

    //main menu
    BlogAppManager.on("show:index",function () {
        BlogAppManager.navigate("");
        API.showIndex();
    });
    BlogAppManager.on("article:list",function () {
        BlogAppManager.navigate("article");
        API.listArticle();
    });
    BlogAppManager.on("show:resume",function () {
        BlogAppManager.navigate("resume");
        API.showResume();
    });
    BlogAppManager.on("product:list",function () {
        BlogAppManager.navigate("product");
        API.listProduct();
    });
    BlogAppManager.on("album:list",function () {
        BlogAppManager.navigate("album");
        API.listAlbum();
    });
    BlogAppManager.on("message:list",function () {
        BlogAppManager.navigate("message");
        API.listMessage();
    });

    //article
    BlogAppManager.on("article:show",function () {
        BlogAppManager.navigate("article");
        API.showArticleById();
    });

    BlogAppManager.addInitializer(function () {
        return new BlogApp.Router({
            controller:API
        });
    });
});
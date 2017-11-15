BlogAppManager.module("Entities",function (Entities,BlogAppManager,Backbone,Marionette,$,_) {
    Entities.ArticleListModel = Backbone.Model.extend({
        default:{
            author:"david"
        }
    });

    Entities.ArticleListCollection = Backbone.Collection.extend({
        model:Entities.ArticleListModel,
        comparator:"datetime"
    });
    
    var articleIndexList;//Index Page
    var articleCatalogList;//Blog Page
    
    var initializeIndexArticleList = function () {
        articleIndexList = new Entities.ArticleListCollection([
            {
                id:1,
                title:"SQL基础",
                datetime:"2017-04-09 10:40:14",
                author:"david",
                content:"结构化查询语言SQL定义SQL(Structured Query Language)，即结构化查询语言，是一种非过程化的介于关系代数与关系演算之间的语言，其功能包括查询、操纵、定义和控制。是一种通用的、功能极强的关系数据库语言。体系结构· 关系模式（模式）：基本表（base table）· 存储模式（内模式）：存储文件（stored file）· 子"
            },
            {
                id:2,
                title:"代码高亮LightCode",
                datetime:"2017-04-14 10:46:38",
                author:"david",
                content:"背景：在很多技术博客中，需要贴上一些代码。目前网上也有很多成熟的代码高亮的js库，方便也美观。但是，折腾了一个礼拜，我也搞了一个出来，暂且称为LightCode吧～目前只开发出HTML代码高亮，后期将会推出js和css的高亮。原理：LightCode一个字一个符号地分析代码流，然后构造出树形结构，这也符合HTML代码的规则。这样不仅可以利用于高亮代码，也可以用在其他地方。。。好吧，言归正传，戳这里"
            }
        ]);
    };
    var initializeBlogArticleList = function () {
        articleCatalogList = new Entities.ArticleListCollection([
            { id:1,title:"SQL基础",datetime:"2017-04-09 10:40:14",isOriginal:true,className:"bl-tag-original"},
            { id:2,title:"代码高亮LightCode",datetime:"2017-04-14 10:46:38",isOriginal:true,className:"bl-tag-original"},
            { id:3,title:"使用Node.js+Socket.IO搭建WebSocket实时应用",datetime:"2017-02-17 12:19:08",isOriginal:false,className:"bl-tag-reproduce"}
        ]);
    };

    var API = {
        getIndexArticleList:function () {
            if(articleIndexList == undefined){
                initializeIndexArticleList();
            }
            return articleIndexList;
        },
        getBlogArticleList:function () {
            if(articleCatalogList == undefined){
                initializeBlogArticleList();
            }
            return articleCatalogList;
        }
    };

    BlogAppManager.reqres.setHandler("indexarticlelist:entities",function () {
        return API.getIndexArticleList();
    });
    BlogAppManager.reqres.setHandler("blogarticlelist:entities",function () {
        return API.getBlogArticleList();
    });
});
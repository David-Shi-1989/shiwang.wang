BlogAppManager.module("Entities",function (Entities,BlogAppManager,Backbone,Marionette,$,_) {
    Entities.AlbumListModel = Backbone.Model.extend({
        default:{
            author:"david"
        }
    });

    Entities.AlbumListCollection = Backbone.Collection.extend({
        model:Entities.AlbumListModel
    });

    var albumList;

    var initializeAlbumList = function () {
        albumList = new Entities.AlbumListCollection([
            {
                id:1,
                title:"BootStrap Validator",
                des:"基于BootStrap的表单验证,支持自定义正则验证及Ajax验证。",
                image:"assets/image/demos/bootstrapValidator.png",
                size:12,
                datetime:"2017-10-01"
            },
            {
                id:2,
                title:"自动寻路算法",
                des:"基于A*算法的自动寻路AI。",
                image:"assets/image/demos/routerSearch.png",
                size:12,
                datetime:"2017-10-01"
            },
            {
                id:3,
                title:"HTML代码高亮",
                des:"读取HTML代码，采用树形结构构造标签。最终输出带样式的HTML代码。常用于博客代码展示。",
                image:"assets/image/demos/ligthcode-1.png",
                size:12,
                datetime:"2017-10-01"
            },
            {
                id:4,
                title:"BootStrap富文本采集",
                des:"富文本多信息采集",
                image:"assets/image/demos/richText.png",
                size:12,
                datetime:"2017-10-01"
            },
            {
                id:5,
                title:"Backbone.js教程翻译",
                des:"基于Backbone英文文档结构,将联系人app改写成股票app。同时结合使用Marionette.backbone.js MVC开发模式。",
                image:"assets/image/demos/backbone.stock.png",
                size:12,
                datetime:"2017-10-01"
            }
        ]);
    };

    var API = {
        getAlbumList:function () {
            if(albumList == undefined){
                initializeAlbumList();
            }
            return albumList;
        }
    };

    BlogAppManager.reqres.setHandler("albumlist:entities",function () {
        return API.getAlbumList();
    });
});
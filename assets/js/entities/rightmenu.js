BlogAppManager.module("Entities",function (Entities,BlogAppManager,Backbone,Marionette,$,_) {
    Entities.MenuItemModel = Backbone.Model.extend({
        // default:{
        //     author:"david"
        // }
    });

    Entities.MenuItemsCollection = Backbone.Collection.extend({
        model:Entities.MenuItemModel,
        comparator:"id"
    });

    var MenuItemsList;
    var MenuIdEnum = {index:1,article:2,resume:3,product:4,album:5,message:6};

    var initializeMenuItems = function () {
        MenuItemsList = new Entities.MenuItemsCollection([
            { id:0, title:"", class:"ant-bg", icon:"fa fa-home"},
            { id:1, title:"主页", class:"active", icon:"fa fa-home"},
            { id:2, title:"博客", class:"", icon:"fa fa-paper-plane"},
            { id:3, title:"简历", class:"", icon:"fa fa-tasks"},
            { id:4, title:"作品", class:"", icon:"fa fa-cube"},
            { id:5, title:"照片", class:"", icon:"fa fa-image"},
            { id:6, title:"留言", class:"", icon:"fa fa-heart"}
        ]);
    };

    var API = {
        getMenuItems:function () {
            if(MenuItemsList == undefined){
                initializeMenuItems();
            }
            return MenuItemsList;
        },
        getMenuIdEnum:function () {
            return MenuIdEnum;
        }
    };

    BlogAppManager.reqres.setHandler("menulist:entities",function () {
        return API.getMenuItems();
    });
    BlogAppManager.reqres.setHandler("menuidenum:entities",function () {
        return API.getMenuIdEnum();
    });
});
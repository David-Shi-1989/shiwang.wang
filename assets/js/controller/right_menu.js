BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.rightMenu = {
        listRightMenu:function () {
            var menus = BlogAppManager.request("menulist:entities");

            var rightMenusView = new BlogAppManager.List.MenuView({
                collection:menus
            });
            BlogAppManager.rightMenusRegion.show(rightMenusView);
        }
    }
});
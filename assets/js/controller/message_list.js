BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.Message = {
        showList:function (model) {
            var messages = BlogAppManager.request("message:entities");
            var messageListView = new BlogAppManager.List.MessageListView({
                collection:messages
            });

            BlogAppManager.mainRegion.show(messageListView);
            BlogAppManager.trigger("menu:select:6");
        }
    }
});
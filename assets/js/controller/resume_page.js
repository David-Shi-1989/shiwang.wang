BlogAppManager.module("Controller",function (Controller,BlogAppManager,Backbone,Marionette,$,_) {
    Controller.ResumePage = {
        showResume:function (model) {
            var resumeView = new BlogAppManager.List.ShowResume();

            BlogAppManager.mainRegion.show(resumeView);
            BlogAppManager.trigger("menu:select:3");
        }
    }
});
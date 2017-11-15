var BlogAppManager = new Backbone.Marionette.Application();
BlogAppManager.addRegions({
    mainRegion:"#main_left",
    rightMenusRegion:"#block_menu"
});

BlogAppManager.on("before:start",function () {
    BlogAppManager.Controller.indexList.listIndexItems();
    BlogAppManager.Controller.rightMenu.listRightMenu();
});

BlogAppManager.on("start",function () {
    UIAdjust();
});

BlogAppManager.navigate = function (route,options) {
    options || (options = {});
    Backbone.history.navigate(route,options);
};

BlogAppManager.getCurrentRoute = function () {
    return Backbone.history.fragment;
};

BlogAppManager.on("start",function (){
    if(Backbone.history){
        Backbone.history.start();
    }
});

function UIAdjust() {
    var H = document.body.clientHeight;
    $("#main_left").height(H - 3 - 135);
}
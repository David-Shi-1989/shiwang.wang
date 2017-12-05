BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.MessageListItem = Marionette.ItemView.extend({
        tagName:"li",
        template:"#message-page-item"
    });

    List.MessageListView = Marionette.CompositeView.extend({
        tagName: "div",
        id: "messageListContainer",
        childView: List.MessageListItem,
        template: "#message-page",
        childViewContainer:"ul"
    });
});
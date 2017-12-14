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
        childViewContainer:"ul.msg-target",
        events:{
            "click a.msg-add-btn-emoji":"openEmojiContainer",
            "click div.msg-emoji-class ul a":"switchEmojiClass"
        },
        openEmojiContainer:function () {
            $(this.$el).find(".msg-emoji-container").toggle();
        },
        switchEmojiClass:function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $(evt.target).add($(this.$el).find("div.msg-emoji-class span.emoji-hover")).toggleClass("emoji-hover").toggleClass("emoji-normal");
        }
    });
});
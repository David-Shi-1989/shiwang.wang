BlogAppManager.module("Entities",function (Entities,BlogAppManager,Backbone,Marionette,$,_) {
    Entities.MessageListModel = Backbone.Model.extend({
    });

    Entities.MessageListCollection = Backbone.Collection.extend({
        model:Entities.MessageListModel
    });

    var messageList;

    var initializeMessageList = function () {
        messageList = new Entities.MessageListCollection([
            {
                id:1,
                nickname:"MM",
                datetime:"2017/11/23 10:23:11",
                content:"这是一个有声音的留言"
            },
            {
                id:2,
                nickname:"M1231撒旦",
                datetime:"2017/11/23 04:23:11",
                content:"此处无声胜有声"
            },
            {
                id:3,
                nickname:"诗人",
                datetime:"2017/11/21 22:23:11",
                content:"欲把西湖比西子"
            }
        ]);
    };

    var API = {
        getMessageList:function () {
            if(messageList == undefined){
                initializeMessageList();
            }
            return messageList;
        }
    };

    BlogAppManager.reqres.setHandler("message:entities",function () {
        return API.getMessageList();
    });
});
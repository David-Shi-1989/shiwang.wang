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
                content:"这是一个有声音的留言",
                avatar:"assets/image/avatar/1.jpg"
            },
            {
                id:2,
                nickname:"M1231撒旦",
                datetime:"2017/11/23 04:23:11",
                content:"此处无声胜有声",
                avatar:"assets/image/avatar/2.jpg",
                items: [
                    {
                        id:4,
                        nickname:"M12旦",
                        datetime:"2017/11/23 04:23:11",
                        content:"回复1",
                        avatar:"assets/image/avatar/3.jpg"
                    },
                    {
                        id:5,
                        nickname:"M12旦",
                        datetime:"2017/11/23 04:23:11",
                        content:"回复2",
                        avatar:"assets/image/avatar/4.jpg"
                    }
                ]
            },
            {
                id:3,
                nickname:"诗人",
                datetime:"2017/11/21 22:23:11",
                content:"那么这两个区别是什么呢？假设我们需要加一个表头，提示列名。原来的CollectionView实现不了，因为它只能指定标签名为table，不能加。这时，我们想要是也能给table设一个template多好。对了！CompositeView就能做到。这也是二者最大的区别。",
                avatar:"assets/image/avatar/5.jpg",
                items:[]
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
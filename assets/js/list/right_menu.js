BlogAppManager.module("List",function (List,BlogAppManager,Backbone,Marionette,$,_){
    List.MenuItemView = Marionette.ItemView.extend({
        tagName:"a",
        template:"#rightmenu-menuitem-view",
        antBlock:"#block_menu2 a.menu-item.ant-bg",
        className:function () {
            var className = "menu-item " + this.model.get("class");
            return className.trim();
        },
        events:{
            "click":"onMenuClick"
        },
        onMenuClick:function (evt) {
            if(evt){
                evt.preventDefault();
                evt.stopPropagation();
            }
            // this.animateMenuItem(this.model.get("id"));
            switch (this.model.get("id")){
                case 1:
                    BlogAppManager.trigger("show:index");
                    break;
                case 2:
                    BlogAppManager.trigger("article:list");
                    break;
                case 3:
                    BlogAppManager.trigger("show:resume");
                    break;
                case 4:
                    BlogAppManager.trigger("product:list");
                    break;
                case 5:
                    BlogAppManager.trigger("album:list");
                    break;
                case 6:
                    BlogAppManager.trigger("message:list");
                    break;
            }
        },
        animateMenuItem:function (newIndex) {
            var oldModel = this.model.collection.where({class:"active"})[0],newModel = this.model;
            var oldIndex = oldModel.get("id");
            if(newIndex != oldIndex){
                var dis = newIndex - oldIndex;
                var disTop = dis * 30, $antBlock = $(this.antBlock);
                $antBlock.animate({top:"+="+(disTop+3*dis)},300,function () {
                    $antBlock.animate({top:"-="+(5*dis)},100,function () {
                        $antBlock.animate({top:"+="+(3*dis)},60,function () {
                            $antBlock.animate({top:"-="+(1*dis)},40);
                        });
                    });
                });
                oldModel.set("class",""),newModel.set("class","active");
                $(this.$el).addClass("active").siblings(".active").removeClass("active");
            }
        },

        initialize:function () {
            BlogAppManager.on("menu:select:"+this.model.get("id"),function () {
                this.animateMenuItem(this.model.get("id"));
            },this);
        }
    });

    List.MenuView = Marionette.CompositeView.extend({
        id:"block_menu2",
        childView:List.MenuItemView,
        template:"#rightmenu-menus-view"
    });
});
(function (root,factory,plug) {
    factory.call(root,root.jQuery,plug);
})(window,function ($,plug) {
    var __DEF_STEP_TMP = '<li {$dataAttr$}>' +
        '<dl>' +
        '<dt>'+
        '<i class="fa fa-check"></i>'+
        '<i class="fa fa-close"></i>'+
        '<b>{$serial$}</b>'+
        '</dt>'+
        '<dd>{$text$}</dd>'+
        '</dl>'+
        '<div class="ui-guide-stepLineWrapper"><span style="width:0;"></span></div>'+
        '</li>';
    var __DEF_BTN_TMP = '<div data-ui-guide-btncontainer="true">'+
        '<button class="btn btn-default btn-sm" data-ui-guide-btn-type="prew"><i class="fa fa-arrow-left"></i>上一步</button>' +
        '<button class="btn btn-primary btn-sm" data-ui-guide-btn-type="next"><i class="fa fa-arrow-right"></i>下一步</button>' +
        '<button class="btn btn-success btn-sm" data-ui-guide-btn-type="ok"><i class="fa fa-check"></i>提交</button>' +
        '</div>';
    var __DEFAULT__ = {
        stepData : [
            {serial:"1",text:"基本信息"},
            {serial:"2",text:"教育背景"},
            {serial:"3",text:"证书荣誉"},
            {serial:"4",text:"申请职位"},
            {serial:"5",text:"提交"},
        ],
        stepTemplate :__DEF_STEP_TMP,
        btnTemplate:__DEF_BTN_TMP,
        activeIndex:0,
        finshedBtnClick:function () {
            if(confirm("确认提交？")){
                alert("已提交.");
            }
        },
    };
    var __PROTO__ = {
        _init: function () {
            this._genSteps();
            this._genButtons();
            this._genInputForm();
            this._adjustToActiveIndex();
            this._bindEvents();
        },
        _genSteps: function () {
            this.$stepContainer = this.children("[data-ui-guide-stepcontainer]").addClass("ui-guide-step");
            for(var i = 0;i<this.stepData.length;i++){
                var dataAttr = '';
                if(i<this.activeIndex){
                    this.stepData[i]["dataAttr"] = 'data-ui-guide-error="true"';
                }else if(i>this.activeIndex){
                    this.stepData[i]["dataAttr"] = '';
                }else{
                    this.stepData[i]["dataAttr"] = 'data-ui-guide-active="true"';
                }
                this.$stepContainer.append(this._genStep(__DEFAULT__.stepTemplate,this.stepData[i]));
            }
            this.$stepContainer.append('<div class="clearfix"></div>');
            this.$stepCircles = this.$stepContainer.find("li dt");
        },
        _genStep:function (temp,data) {
            for(var prop in data){
                temp = temp.replace("{$"+prop+"$}",data[prop]);
            }
            return temp;
        },
        _genButtons: function () {
            this.append(__DEFAULT__.btnTemplate);
            this.$btnContainer = this.children("[data-ui-guide-btncontainer]").addClass("ui-guide-btn");
            this.$btnPrew = $("[data-ui-guide-btn-type=\"prew\"]",this.$btnContainer);
            this.$btnNext = $("[data-ui-guide-btn-type=\"next\"]",this.$btnContainer);
            this.$btnOK = $("[data-ui-guide-btn-type=\"ok\"]",this.$btnContainer);
        },
        _genInputForm:function () {
            this.$inputContainer = this.children("[data-ui-guide-inputcontainer]").addClass("ui-guide-input");
            this.$inputFormLis = this.$inputContainer.children("li");
        },
        _bindEvents: function () {
            var _$this = this;
            this.$btnNext.on("click",function () {
                var $activeLi = $("ul.ui-guide-step > li[data-ui-guide-active]");
                if($activeLi.index() != $("ul.ui-guide-step > li").length-1){
                    $activeLi.removeAttr("data-ui-guide-active").attr("data-ui-guide-over",true).next().attr("data-ui-guide-active",true);
                    $activeLi.find("span").width("100%");
                    _$this._adjustToActiveIndex(_$this.activeIndex++);
                }
            });
            this.$btnPrew.on("click",function () {
                var $activeLi = $("ul.ui-guide-step > li[data-ui-guide-active]");
                if($activeLi.index() != 0){
                    $activeLi.removeAttr("data-ui-guide-active").removeAttr("data-ui-guide-over").prev().attr("data-ui-guide-active",true).find("span").width(0);
                    _$this._adjustToActiveIndex(_$this.activeIndex--);
                }
            });
            this.$btnOK.on("click",function(){
                _$this.finshedBtnClick();
            });
        },
        _adjustToActiveIndex:function () {
            if(typeof(this.activeIndex) == "number" && this.activeIndex >= 0 && this.activeIndex < this.stepData.length){
                if(this.activeIndex == 0){
                    //step 1
                    this.$btnPrew.hide();
                    this.$btnNext.show();
                    this.$btnOK.hide();
                }else if(this.activeIndex < this.stepData.length-1){
                    this.$btnPrew.show();
                    this.$btnNext.show();
                    this.$btnOK.hide();
                }else{
                    //finish
                    this.$btnPrew.show();
                    this.$btnNext.hide();
                    this.$btnOK.show();
                }
                $(this.$inputFormLis[this.activeIndex]).show().siblings().hide();
            }
        },
    };
    $.fn[plug] = function (options) {
        $.extend(this,__DEFAULT__,__PROTO__,options);
        this._init();
    }
},"uiGuide");
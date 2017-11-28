(function (root,factory,plug) {
    return factory(root.jQuery,plug);
})(window,function ($,plug) {
    var __DEFS__ = {
        trigger : "keyup",
    };
    var __EXCEPTION_RULES__ = ["ajax"];
    var __RULES_ = {
        must:function () {
            return (this.val() && this.val().length > 0);
        },
        regex:function () {
            return new RegExp(this.data("sv-regex")).test(this.val());
        },
        isTel:function () {
            return /^1[34578]\d{9}$/.test(this.val());
        },
        isInteger:function () {
            return /^[1-9]+\d?$/.test(this.val());
        },
        greatthan:function () {
            return (parseInt(this.val()) > parseInt(this.data("sv-greatthan")));
        },
        greatequalthan:function () {
            return (parseInt(this.val()) >= parseInt(this.data("sv-greatequalthan")));
        },
        lessthan:function () {
            return (parseInt(this.val()) < parseInt(this.data("sv-lessthan")));
        },
        lessequalthan:function () {
            return (parseInt(this.val()) <= parseInt(this.data("sv-lessequalthan")));
        },
        isEmail:function () {
            return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-]+.)*([a-zA-Z0-9_-]+\.\w{2,6})$/.test(this.val());
        },
        isPassword:function () {
            var $rePSWInput = this.parent().parent().parent().find("input[data-sv-isrepassword='true']");
            if($rePSWInput.val().length > 0) {
                $rePSWInput.trigger("keyup");
            }
            return true;
        },
        isRePassword:function () {
            return (this.val() == this.parent().parent().parent().find("input[data-sv-ispassword='true']").val());
        },
        ajax:function () {
            this.after('<span class="glyphicon glyphicon-refresh" aria-hidden="true" title="清空"></span>');
            this.attr("disabled",true);
            $.ajax({
                type:"POST",
                url:$(this).data("sv-ajax"),
                data:{
                    value:$(this).val()
                },
                dataType:"json",
                success:function (data) {
                    var $el = $(".sww-validator-form-panel").find("span.glyphicon-refresh").siblings("input");
                    $el.attr("disabled",false).siblings("span.glyphicon-refresh").remove();
                    if(data == true){
                        $el.after('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>').parent().addClass("has-success");
                        $el.parent().addClass("has-success");
                    }else{
                        $el.after("<p>"+$el.data("sv-ajax-message")+"</p>"+'<span class="glyphicon glyphicon-remove" aria-hidden="true" title="清空" onclick="$(this).siblings(\'input\').val(\'\').trigger(\'keyup\');"></span>').parent().addClass("has-error");
                    }
                },
                error:function (data) {
                }
            });
            return true;
        }
    };
    var __BTN__ = {
        reset:function (formEl) {
            var $fileds = formEl.find("input").not("[type=button],[type=rest],[type=submit],[type=checkbox]");
            $.each($fileds,function () {
                var $filed = $(this);
                $filed.nextAll("span,p").remove();
                $filed.parent().removeClass("has-error").removeClass("has-success");
            });
        },
        submit:function (formEl) {
            if($(formEl).find("span.glyphicon-remove").length > 0){
                console.log("Fail to submit.")
            }else{
                console.log("Submit the form");
            }
        }
    };
    $.fn[plug] = function (options) {
        this.addClass("sww-validator-form-panel");
        $.extend(this,__DEFS__,options);
        var $fileds = this.find("input").not("[type=button],[type=rest],[type=submit],[type=checkbox]");
        for(var i = 0; i < $fileds.length;i++){
            var $el = $($fileds[i]);
            $el.on($el.data("sv-trigger")?$el.data("sv-trigger"):this.trigger,function () {
                var $filed = $(this);
                $filed.nextAll("span,p").remove();
                $filed.parent().removeClass("has-error");
                var result = true;
                $.each(__RULES_,function (rule,func) {
                    rule = rule.toLowerCase();
                    if($filed.data("sv-"+rule)){
                        result = func.call($filed);
                        if(!result && $.inArray(rule,__EXCEPTION_RULES__) < 0){
                            $filed.after("<p>"+$filed.data("sv-"+rule+"-message")+"</p>"+'<span class="glyphicon glyphicon-remove" aria-hidden="true" title="清空" onclick="$(this).siblings(\'input\').val(\'\').trigger(\'keyup\');"></span>').parent().addClass("has-error");
                            return false;
                        }else if(rule == "ajax"){

                        }
                    }
                });
                if(result && typeof($filed.data("sv-ajax")) == "undefined") {
                    $filed.after('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>').parent().addClass("has-success");
                    $filed.parent().addClass("has-success");
                }
            })
        }
        //Submit Button
        var $submitBtn = this.find("input[type=submit]");
        $submitBtn.on("click",function () {
            __BTN__.submit();
        });

        //Reset Button
        var $resetBtn = this.find("input[type=reset]");
        $resetBtn.on("click",function () {
            __BTN__.reset($(this).parent().parent().parent());
        });
    }
},"swwValidator");
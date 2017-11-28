$(function () {
    Page.init();
});

var Page = {
    init:function () {
        this.__bind_event__();
    },
    __bind_event__:function () {
        $("div.input-group-btn ul.dropdown-menu > li > a").on("click",function () {
            $(this).parent().parent().siblings("button").find("span.js-value").text($(this).text());
        })
    },
}
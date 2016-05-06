/**
 * Created by Administrator on 2016/5/6.
 */
var object_id = "";
var pubSub = {
    callbacks: {},
    on: function (msg, callback) {
        this.callbacks[msg] = this.callbacks[msg] || [];
        this.callbacks[msg].push(callback);
    },
    publish: function (msg) {
        this.callbacks[msg] = this.callbacks[msg] || [];
        for (var i = 0, len = this.callbacks[msg].length; i < len; i++) {
            this.callbacks[msg][i].apply(this, arguments);
        }
        ;
    }
};
var data_attr = "data-bind-" + object_id;
var message = object_id + ":change";
var changeHandler = function (event) {
    var target = event.target || event.srcElement, // IE8兼容
        prop_name = target.getAttribute(data_attr);

    if (prop_name && prop_name !== "") {
        pubSub.publish(message, prop_name, target.value);
    }
};
// 监听事件变化，并代理到pubSub
if (document.addEventListener) {
    document.addEventListener("keyup", changeHandler, false);
} else {
    // IE8使用attachEvent而不是addEventListenter
    document.attachEvent("onkeyup", changeHandler);
}
// 订阅事件
pubSub.on(message, function (event, prop_name, new_val) {
    var elements = document.querySelectorAll("[" + data_attr + "=" + prop_name + "]"),
        tag_name;
    for (var i = 0, len = elements.length; i < len; i++) {
        tag_name = elements[i].tagName.toLowerCase();

        if (tag_name === "input" || tag_name === "textarea" || tag_name === "select") {
            elements[i].value = new_val;
        } else {
            elements[i].innerHTML = new_val;
        }
        ;
        console.log("prop_name:" + new_val);
    }
    ;
})
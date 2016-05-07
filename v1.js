/**
 * Created by wjkang on 2016/5/6.
 */
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
var changeHandler = function (event) {
    var target = event.target || event.srcElement, // IE8兼容
        prop_name = target.getAttribute("data-bind");

    if (prop_name && prop_name !== "") {
        //发布事件（UI与user已经订阅此事件）
        pubSub.publish("name:change", prop_name, target.value);
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
pubSub.on("name:change", function (event, prop_name, new_val) {
    var elements = document.querySelectorAll("[data-bind=" + prop_name + "]"),
        tag_name;
    for (var i = 0, len = elements.length; i < len; i++) {
        tag_name = elements[i].tagName.toLowerCase();

        if (tag_name === "input" || tag_name === "textarea" || tag_name === "select") {
            elements[i].value = new_val;
        } else {
            elements[i].innerHTML = new_val;
        }

    }
    ;
});
var user = {
    attribute: {},
    // 属性设置器使用数据绑定器pubSub来发布
    set: function (attr_name, val) {
        this.attribute[attr_name] = val;
        pubSub.publish("name:change", attr_name, val, this);
    },
    get: function (attr_name) {
        return this.attribute[attr_name];
    }
};
//订阅事件,UI改变和调用user的set方法都会发布此事件
pubSub.on("name:change", function (event, attr_name, new_val, initiator) {
    if (initiator !== user) {
        //UI发布的事件才调用
        user.set(attr_name, new_val);
    }
});


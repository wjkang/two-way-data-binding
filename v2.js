function DataBinder(object_id) {
    // 创建一个简单的pubSub对象
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
        },

        data_attr = "data-bind-" + object_id,
        message = object_id + ":change",

        changeHandler = function (event) {
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
    ;

    // pubSub将变化传播到所有绑定元素
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

    return pubSub;
}

function User(uid) {
    var binder = new DataBinder(uid),
        user = {
            attribute: {},

            // 属性设置器使用数据绑定器pubSub来发布
            set: function (attr_name, val) {
                this.attribute[attr_name] = val;
                binder.publish(uid + ":change", attr_name, val, this);
            },

            get: function (attr_name) {
                return this.attribute[attr_name];
            },

            _binder: binder
        };

    binder.on(uid + ":change", function (event, attr_name, new_val, initiator) {
        if (initiator !== user) {
            user.set(attr_name, new_val);
        }
    });

    return user;
}
var user = new User(123);
user.set("name", "wujunkang");

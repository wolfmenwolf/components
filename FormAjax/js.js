// 原生js模拟form表单提交

// 创建XHR对象
function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != 'undefined') {
        if (typeof arguments.callee.activeXString != 'string') {
            var version = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", " MSXML2.XMLHttp"],
                i, len;

            for (i = 0, len = version.length; i < len; i++) {
                try {
                    new ActiveXObject(version[i]);
                    arguments.callee.activeXString = version[i];
                    break;
                } catch (ex) {
                    // 跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error('No XHR object available.');
    }
}

// 表单序列化
function serialize(form) {
    var parts = [],
        field = null,
        i, len, j, optLen, option, optValue;

    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];
        switch (field.type) {
            case 'select-one':
            case 'select-multiple':
                if (field.name.length) {
                    for (j = 0 , optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = '';
                            if (option.hasAttrbute) {
                                optValue = (option.hasAttrbute('value') ? option.value : option.text);
                            } else {
                                optValue = (option.attributes['value'].specified ? option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
                        }
                    }
                }
                break;
            case undefined:  // 字符集
            case 'file': //文件输入
            case 'submit': //提交按钮
            case 'reset': //重置按钮
            case 'button': //自定义按钮
                break;
            case 'radio': //单选按钮
            case 'checkbox': // 复选框
                if (!field.checked) {
                    break;
                }
            // 执行默认操作
            default:
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join('&');
}

// 模拟form表单
function standardForm(url, type, args) {
    var body = document.body,
        form = document.createElement('form'), // enctype='multipart/form-data'
        input;

    form.setAttribute('action', url);
    form.setAttribute('method', type);
    for (var key in args) {
        input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', args[key]);
        form.appendChild(input);
    }
    document.body.appendChild(form)
    document.body.removeChild(form);
    return form;
}

// ajax提交
function submitData(form, succ, err) {
    var xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                succ && succ(xhr.responseText);
            } else {
                err && err(xhr.status);
            }
        }
    }
    url = form.getAttribute('action');
    type = form.getAttribute('method');
    xhr.open(type, url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.setRequestHeader('Accept-Language', 'GBK');
    xhr.send(serialize(form));
}

var form = StandardForm('http://106.14.6.153:8888/','POST',{
    product_code: code,
    type: '1'
});

submitData(form, function(res){
    // success
},function(err){
    // fail
});
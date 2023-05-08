var BaseUrl = 'http://wwxsq.tangxx.cn';

var CK = {
    urlParams: {},
    createXHR: function () {
        var XHR = [  //兼容不同浏览器和版本得创建函数数组
            function () { return new XMLHttpRequest() },
            function () { return new ActiveXObject("Msxml2.XMLHTTP") },
            function () { return new ActiveXObject("Msxml3.XMLHTTP") },
            function () { return new ActiveXObject("Microsoft.XMLHTTP") }
        ];
        var xhr = null;
        //尝试调用函数，如果成功则返回XMLHttpRequest对象，否则继续尝试
        for (var i = 0; i < XHR.length; i++) {
            try {
                xhr = XHR[i]();
            } catch (e) {
                continue  //如果发生异常，则继续下一个函数调用
            }
            break;  //如果成功，则中止循环
        }
        return xhr;  //返回对象实例
    },
    ajax: function (url) {
        var xhr = this.createXHR();  //实例化XMLHttpRequest 对象
        xhr.open("GET", url, false);  //建立连接，要求同步响应
        //xhr.withCredentials = true;
        xhr.send(null);  //发送请求
        return JSON.parse(xhr.responseText);
    },
    appendParams: function(url, params) {
        if (params) {
            var baseWithSearch = url.split('#')[0];
            var hash = url.split('#')[1];
            for (var key in params) {
                var attrValue = params[key];
                if (attrValue !== undefined) {
                    var newParam = key + "=" + attrValue;
                    if (baseWithSearch.indexOf('?') > 0) {
                        var oldParamReg = new RegExp('^' + key + '=[-%.!~*\'\(\)\\w]*', 'g');
                        if (oldParamReg.test(baseWithSearch)) {
                            baseWithSearch = baseWithSearch.replace(oldParamReg, newParam);
                        } else {
                            baseWithSearch += "&" + newParam;
                        }
                    } else {
                        baseWithSearch += "?" + newParam;
                    }
                }
            }
            if (hash) {
                url = baseWithSearch + '#' + hash;
            } else {
                url = baseWithSearch;
            }
        }
        return url;
    },
    getUrlParams: function() {
        var pairs = location.search.substring(1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos === -1) {
                continue;
            }
            var key = pairs[i].substring(0, pos);
            if(key == 'appid') {
                key = 'acode';
            }else if(key == 'redirect_uri') {
                key = 'rurl'
            }
            CK.urlParams[key] = decodeURIComponent(pairs[i].substring(pos + 1));
        }
    },
    isBase64: function(str) {
        if(str === '' || str.trim() === ''){
            return false;
        }
        try{
            return btoa(atob(str)) == str;
        }catch(err){
            return false;
        }
    }

}
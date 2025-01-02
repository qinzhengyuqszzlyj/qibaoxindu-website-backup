
/**
 * User: 陈燊俊
 * Date: 15-4-7
 * Time: 上午11:00
 * 我的集成工具类
 */
/*
* 提供方法：
  1. Utils.formBuilder  //对象---创建隐藏的form/隐藏的input, 发送同步请求
     参数：  data:json键值对数据,
             url:请求地址,
             anchor:面包屑,
             form:载体form(jquery对象或Dom节点)
     方法：formBuilder.submitByForm(data, url, anchor) 创建隐藏的form, 发送同步请求
     方法：formBuilder.submitWithHiddenInput(data, form) 创建隐藏的input, 结合给予的form 发送同步请求


  2. Utils.identityCard  //对象----获取身份证信息
     参数：   cardNo:身份证号
     方法：identityCard.getCard(cardNo)


  3. Utils.download(url)  //创建一个Iframe下载


  4. Utils.formatMoney(money, dotNum)    格式化金额
     参数：    money：传入的float数字
               dotNum：希望返回小数点几位
     Utils.formatNumber(number, dotNum)    格式化数字
     参数：    money：传入的float数字
               dotNum：希望返回小数点最多几位


  5.Map系列功能
     方法：Utils.listToMap(list,name)  //将list转化为map
           Utils.addToMap(list,name,map)   //将list转化为map
           Utils.newMap()     //新建map对象


  6.Utils.uuid()   //生成32位纯数字uuid


  7.Utils.loadjscssfile(filename,filetype)   //加载指定引用资源
     参数：    filename:资源地址
               filetype:资源类型(js、css)


  8.Utils.formatDate(date,fmt)  //格式化日期(可用于格式化从后台传来的，被js识别为object的日期)
     参数：    date:date对象
               fmt:格式化样本（'yyyy-mm-dd'）

  9.Utils.strToDate(string,fmt) //将字符串根据fmt格式转换成日期
     参数：    string:日期字符串（'1900-01-01'）
               fmt:格式化样本（'yyyy-mm-dd'）


  10.Utils.formtoJson(formObj)  //将表单转化为json(有待完善，慎用)


  11.图片压缩系列
  (1)方法：Utils.zipImageFile (file,limit,callback)  压缩图片源文件（如果图片大小超过指定大小）
     参数：    file 图片源文件
               limit 限制的大小上限（可选）,单位 B
               callback 回调方法（可选）
  (1)方法：Utils.zipImageData (img_obj, quality)  压缩图片流
     参数：    img_obj 图片img标签dom元素或者Image对象
                quality 压缩质量（0-1，越高质量越好）


  12：Utils.sortObjects   //迷之方法（忘了做什么的了）

  13：Utils.numberToChinese   //阿拉伯数字转换为中文

 */
window.Utils = (function (Utils) {
    
    /**
     * 创建隐藏的form/隐藏的input, 发送同步请求
     * submitByForm(data, url, anchor)
     * submitWithHiddenInput(data, form)
     * data:json键值对数据, url:请求地址, anchor:面包屑, form:载体form(jquery对象或Dom节点)
     */
    Utils.formBuilder = (function (formBuilder) {
        var garbageBin;// 垃圾箱

        formBuilder.submitByForm = function (data, url, anchor, enctype) {
            var form;
            if (!anchor) {
                anchor = '';
            }
            // 创建form
            form = formBuilder.createForm(form, url, anchor, enctype);

            // 创建input
            createInput(data, form);
            // 提交
            form.submit();
            // 删除form
            discardElement(form);
        };
        formBuilder.submitWithHiddenInput = function (data, form) {
            var inputs = [];
            if (!form) {
                if (!(form instanceof Element) && (form[0] instanceof Element)) {
                    form = form[0];
                }
               // 创建input
                inputs = createInput(data, form);
               // 提交
                form.submit();
                // 删除form
                discardElement(inputs);
            }

        };
        formBuilder.createForm = function (form, url, anchor, enctype) {
            if (!form) {
                var type = 'application/x-www-form-urlencoded'; //上传文件用：multipart/form-data
                if (enctype) {
                    type = enctype;
                }
                form = createElement('form', {
                    method: 'post',
                    action: url + anchor,
                    enctype: type
                }, {
                    display: 'none'
                }, document.body);
            }
            return form;
        };
        var createInput = function (data, form) {
            var name, inputs = [];
            if (data instanceof Array) {
                for (var i = 0; i < data.length; i++) {
                    // 增加参数
                    for (name in data) {
                        inputs.push(createElement('input', {
                            type: 'hidden',
                            name: name + '[' + i + ']',
                            value: data[i][name]
                        }, null, form));
                    }
                }
            } else {
                // 增加参数
                for (name in data) {
                    inputs.push(createElement('input', {
                        type: 'hidden',
                        name: name,
                        value: data[name]
                    }, null, form));
                }
            }
        };

        /**
         * 设定dom元素的css样式
         */
        function css(el, styles) {
            if ((/msie/i.test(navigator.userAgent) && !window.opera)) { // #2686
                if (styles && styles.opacity !== undefined) {
                    styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
                }
            }
            $.extend(el.style, styles);
        }

        /**
         * 创建document元素
         */
        function createElement(tag, attribs, styles, parent) {
            var el = document.createElement(tag);
            if (attribs) {
                $.extend(el, attribs);
            }
            if (styles) {
                css(el, styles);
            }
            if (parent) {
                parent.appendChild(el);
            }
            return el;
        }

        /**
         * 将dom元素扔进垃圾箱清除
         */
        function discardElement(element) {
            // 创建一个回收站, 并非当前dom元素的
            if (!garbageBin) {
                garbageBin = createElement('div');
            }
            // 把节点拖进回收站
            if (element) {
                if (element instanceof Array) {
                    for (var i = 0; i < element.length; i++) {
                        garbageBin.appendChild(element[i]);
                    }
                } else {
                    garbageBin.appendChild(element);
                }
            }
            // 清空回收站
            garbageBin.innerHTML = '';
        }

        return formBuilder;
    })(Utils.formBuilder || {});

    /**
     * 读取身份证号, 判断身份证号码正确与否, 若正确, 额外读取生日, 地区, 性别等信息
     * getCard(sId) sid:身份证号
     */
    Utils.identityCard = (function(identityCard) {
        //身份证正则表达式(15位)
        var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        //身份证正则表达式(18位)
        var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;
        //地区、性别和身份证进行判断的正则表达式：
        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",
            34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",
            52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
        //function Card(sId){
        //    return {sid:sId,city:"未知",birthday:"未知",sex:"未知",regex:true,info:"Error:非法格式"}
        //}
        function Card(sId){
            this.sid = sId;
            this.city = "未知";
            this.birthday = "未知";
            this.sex = "未知";
            this.regex = true;
            this.info = "Error:非法格式";
        }
        identityCard.getCard = function (sId) {
            var card = new Card(sId);
            if (sId.match(isIDCard1)) {
                card.birthday = "19"+sId.substr(6, 2) + "-" + Number(sId.substr(8, 2)) + "-" + Number(sId.substr(10, 2));
                if (checkDate(card.birthday,new Date(1900,0,1), new Date(1999,11,31)) == false) {
                    card.regex = false;
                    card.info = "Error:非法生日";
                    return card;
                }
            } else if (sId.match(isIDCard2)) {
                var iSum = 0;
                sId = sId.replace(/x|X$/i, "a");
                if (aCity[parseInt(sId.substr(0, 2))] == null) {
                    card.regex = false;
                    card.info = "Error:非法地区";
                    return card;
                }
                card.birthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
                if (checkDate(card.birthday,new Date(1900,0,1), new Date()) == false) {
                    this.regex = false;
                    this.info = "Error:非法生日";
                    return card;
                }
                for (var i = 17; i >= 0; i--) {
                    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
                }
                if (iSum % 11 != 1) {
                    card.regex = false;
                    card.info = "Error:非法身份证号";
                    return card;
                }
                card.info = "Success:身份证号码正确";
                card.sex = sId.substr(16, 1) % 2 ? "男" : "女";
                card.city = aCity[parseInt(sId.substr(0, 2))];
            } else {
                card.regex = false;
            }
            return card;
        };

        function checkDate(strDate,DateFrom, DateTo ){
            //手动日期验证正则表达式
            var ReDigital8 = /\d{8}/;
            //自动日期验证正则表达式
            var ReAutoDate = /\d{4}-{1}\d{1,2}-\d{1,2}/;
            //自动日期提取正则表达式
            //ReGetDate = /(\d{4})-{1}(\d{1,2})-(\d{1,2})/;
            //debugger;
            if(strDate.indexOf("-")>-1)
            {
                if( ReAutoDate.test( strDate ) == false )
                    return false;
                //Arr = ReGetDate.exec( strDate );
                var Arr = strDate.split("-");
                strDate = (Arr[0]) + "" + (Arr[1].length<2?"0":"") + Arr[1] + (Arr[2].length<2?"0":"") + (Arr[2]);
            }
            if(strDate.length!=8)
                return false;
            if( ReDigital8.test(strDate)==false )
                return false;
            var MyDate = eval( strDate.replace( /^(\d{4})(\d{2})(\d{2})$/, "new Date($1,$2-1,$3)" ) );
            var strMyDate = MyDate.getFullYear()+(MyDate.getMonth()<9?"0":"")+(MyDate.getMonth()+1)+""+(MyDate.getDate()<=9?"0":"")+MyDate.getDate();
            //日期有效性验证
            if(strMyDate!=strDate)
                return false;
            //日期范围验证
            return (MyDate >= DateFrom && MyDate <= DateTo);
        }
        return identityCard;
    })(Utils.identityCard || {});
    /**
     *  Iframe下载
     *  url:下载地址
     */
    Utils.download = function (url) {
        var hiddenIFrameID = 'hiddenDownloader',
            iframe = document.getElementById(hiddenIFrameID);
        if (iframe === null) {
            iframe = document.createElement('iframe');
            iframe.id = hiddenIFrameID;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        iframe.method = 'post';
        iframe.src = url;
    };

    /**
     *  格式化金额     formatMoney("12345.675910", 3), 返回12,345.676 
     *  s:传入的float数字 , n:希望返回小数点几位
     */
    Utils.formatMoney = function (money, dotNum) {
        var _n = dotNum;
        dotNum = dotNum > 0 && dotNum <= 20 ? dotNum : 2;
        money = parseFloat((money + '').replace(/[^\d\.-]/g, '')).toFixed(dotNum) + '';
        var l = money.split('.')[0].split('').reverse(),
            r = money.split('.')[1];
        var t = '', ret;
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
        }
        if (_n && _n > 0) {
            ret = t.split('').reverse().join('') + '.' + r;
        } else {
            ret = t.split('').reverse().join('')
        }
        return ret;
    };
    /**
     *  格式化数字    formatNumber(12345.675910, 3), 返回12345.676
     *               formatNumber(12345, 3), 返回12345
     *  s:传入的float数字 , n:希望返回小数点几位
     */
    Utils.formatNumber = function (number, dotNum, last) {
        if (dotNum != null) {
            dotNum = dotNum > 0 && dotNum <= 20 ? dotNum : 2;
            number = parseFloat((number + '').replace(/[^\d\.-]/g, '')).toFixed(dotNum) + '';
        }
        if (last) {
            var str = number + "";
            if (last > str.length) {
                for (var i = last - str.length; i < last; i++) {
                    str = "0" + str;
                }
            }
            return str;
        }
        return number-0;
    };

    Utils.compare = function(propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            if (value2 < value1) {
                return 1;
            }
            else if (value2 > value1) {
                return -1;
            }
            else {
                return 0;
            }
        }
    }

    /**
     *  转换objectList为map<String,Object>
     */
    Utils.listToMap = function(list,name){
        if (!list)return {};
        list = jQuery.type(list) === "array" ? list : list.split(',');
        var map = new Map();
        for (var i = 0; i<list.length;i++) {
            var obj= list[i];
            map.put(obj[name],obj)
        }
        return map;
    };
    /**
     *  转换objectList为map<String,List<Object>>
     */
    Utils.toListMap = function(list,name){
        if (!list)return {};
        list = jQuery.type(list) === "array" ? list : list.split(',');
        var map = new Map();
        for (var i = 0; i<list.length;i++) {
            var obj= list[i];
            if(map.get(obj[name])){
                map.get(obj[name]).push(obj);
            }else{
                map.put(obj[name],[obj]);
            }
        }
        return map;
    };

    /**
     *  转换objectList为map
     */
    Utils.addToMap = function(list,name,map){
        if (!list)return {};
        if (!map)map = new Map();
        list = jQuery.type(list) === "array" ? list : list.split(',');
        for (var i = 0; i<list.length;i++) {
            var obj= list[i];
            map.put(obj[name],obj)
        }
        return map;
    };

    Utils.newMap = function(){
        return new Map();
    }

    /**
     *  创建map对象
     */
    function Map() {
        /** 存放键的数组(遍历用到) */
        this.keys = new Array();
        /** 存放数据 */
        this.data = new Object();

        /**
         * 放入一个键值对
         * @param {String} key
         * @param {Object} value
         */
        this.put = function (key, value) {
            if (this.data[key] == null) {
                this.keys.push(key);
            }
            this.data[key] = value;
        };

        /**
         * 获取某键对应的值
         * @param {String} key
         * @return {Object} value
         */
        this.get = function (key) {
            return this.data[key];
        };

        /**
         * 删除一个键值对
         * @param {String} key
         */
        this.remove = function (key) {
            this.keys.remove(key);
            this.data[key] = null;
        };

        /**
         * 遍历Map,执行处理函数
         *
         * @param {Function} 回调函数 function(key,value,index){..}
         */
        this.each = function (fn) {
            if (typeof fn != 'function') {
                return;
            }
            var len = this.keys.length;
            for (var i = 0; i < len; i++) {
                var k = this.keys[i];
                fn(k, this.data[k], i);
            }
        };

        /**
         * 获取键值数组(类似Java的entrySet())
         * @return 键值对象{key,value}的数组
         */
        this.entrys = function () {
            var len = this.keys.length;
            var entrys = new Array(len);
            for (var i = 0; i < len; i++) {
                entrys[i] = {
                    key: this.keys[i],
                    value: this.data[i]
                };
            }
            return entrys;
        };

        /**
         * 判断Map是否为空
         */
        this.isEmpty = function () {
            return this.keys.length == 0;
        };

        /**
         * 获取键值对数量
         */
        this.size = function () {
            return this.keys.length;
        };

        /**
         * 重写toString
         */
        this.toString = function () {
            var s = "{";
            for (var i = 0; i < this.keys.length; i++, s += ',') {
                var k = this.keys[i];
                s += k + "=" + this.data[k];
            }
            s += "}";
            return s;
        };
    }

    /**
     * 生成uuid
     * @returns {string}
     */
    Utils.uuid=function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    }

    Utils.loadjscssfile=function(filename,filetype){

        if(filetype == "js"){
            var fileref = document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src",filename);
        }else if(filetype == "css"){

            var fileref = document.createElement('link');
            fileref.setAttribute("rel","stylesheet");
            fileref.setAttribute("type","text/css");
            fileref.setAttribute("href",filename);
        }
        if(typeof fileref != "undefined"){
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }

    };
    /**
     * 格式化日期
     * 常用于格式化从后台传来的，被js识别为object的日期
     * @param date
     * @param fmt
     * @returns {*}
     */
    Utils.formatDate = function (date,fmt) { //author: meizz
        if(!date){
            return '';
        }
        if(isNaN(date)){
            var o = {
                "M+": date.month + 1, //月份
                "d+": date.date, //日
                "H+": date.hours, //小时
                "m+": date.minutes, //分
                "s+": date.seconds, //秒
                "q+": Math.floor((date.month + 3) / 3), //季度
                "S": date.time //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.year+1900 + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }else{
            date = new Date(date);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "H+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    };
    /**
     * 将字符串转换为日期
     * @param str
     * @returns {Date}
     */
    Utils.strToDate =function(str,fmt) {
        if(!fmt||!str){
            return 'error';
        }
        var index=null;
        function getFormat(str,fmt,reg,source){
            var ele =  fmt.match(reg);
            if(!ele||!ele[0]){ return 0}
            if(index==null){index = source}
            return str.substr(fmt.indexOf(ele[0]),ele[0].length)
        }
        var yearFormat = getFormat(str,fmt,/y[y]*/,0);
        var monthFormat = getFormat(str,fmt,/M[M]?/,1);
        var dayFormat = getFormat(str,fmt,/d[d]?/,2);
        var hourFormat = getFormat(str,fmt,/H[H]?/,3);
        var minuteFormat = getFormat(str,fmt,/m[m]?/,4);
        var secondFormat = getFormat(str,fmt,/s[s]?/,5);
        var today = new Date();
        switch(index){
            case 5:minuteFormat=today.getMinutes();
            case 4:hourFormat=today.getHours();
            case 3:dayFormat=today.getDate();
            case 2:monthFormat=today.getMonth()+1;
            case 1:yearFormat=today.getFullYear();
        }
        return new Date(yearFormat,monthFormat-1,dayFormat,hourFormat,minuteFormat,secondFormat,0);
    };
    /**
     * 将表单转化为json
     * @param formObj
     * @returns {*}
     */
    Utils.formtoJson = function(formObj){
        var paramObject = new Object();
        if(formObj){
            var elementsObj=formObj.elements;
            var obj;
            if(elementsObj){
                //将表单中所有参数转换为json对象
                for(var i=0; i<elementsObj.length;i+=1){
                    obj=elementsObj[i];
                    if(obj.name!=undefined&&obj.name!=""){
                        //排除未选择的单选
                        if(obj.type=='radio'&&!obj.checked){
                           continue;
                        }
                        //排除未选择的多选
                        if(obj.type=='checkbox'&&!obj.checked){
                           continue;
                        }
                        if(paramObject[obj.name]){
                            if(paramObject[obj.name] instanceof Array){
                                paramObject[obj.name].push(obj.value);
                            }else{
                                paramObject[obj.name]=[paramObject[obj.name],obj.value]
                            }
                        }else{
                            paramObject[obj.name] = obj.value;
                        }
                    }
                }
                return paramObject;
            }else{
                alert("没有elements对象!");
                return {};
            }
        }else{
            alert("form不存在!");
            return {};
        }
    };

 /**
     * 将表单转化为json
     * @param formObj
     * @returns {*}
     */
    Utils.formtoJson2 = function(formObj){
        var paramObject = new Object();
        if($(formObj).length>0){
            var elementsObj=$(formObj).serializeArray();
            var obj;
            if(elementsObj){
                //将表单中所有参数转换为json对象
                for(var i=0; i<elementsObj.length;i+=1){
                    obj=elementsObj[i];
                    if(paramObject[obj.name]){
                        var arr = paramObject[obj.name].split(',');
                        arr.push(obj.value);
                        paramObject[obj.name]= arr.join(',');
                    }else{
                        paramObject[obj.name] = obj.value;
                    }
                }
                return paramObject;
            }else{
                alert("没有elements对象!");
                return {};
            }
        }else{
            alert("form不存在!");
            return {};
        }
    };


    /**
     * 压缩图片文件（如果图片大小超过指定大小）
     * @param file 图片源文件
     * @param limit 限制的大小上限
     * @param callback 回调方法（可选）
     * @returns {*}
     */
    Utils.zipImageFile =function(file,limit,callback){
        var quality =  50;
        if (!file.type.match('image.*')) {
            return;
        }
        if(limit&&file.size>limit){
            quality = limit/file.size;
        }
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onloadend = (function(theFile) {
            return function(e) {
                console.log(e.target.result);
                var b = new Image();
                b.src = event.target.result;
                b.src = Utils.zipImageData(b,quality).src;
                event.target.result = b.src;
                if(callback){
                    callback();
                }
            };
        })(file);
        reader.readAsDataURL(file);
    };
    /**
     * 压缩图片流
     * @param img_obj 图片img标签dom元素或者Image对象
     * @param quality 压缩质量（0-1）
     * @returns {*}
     */
    Utils.zipImageData =function(img_obj, quality){

        var mime_type = "image/jpeg";

        var cvs = document.createElement('canvas');
        //naturalWidth真实图片的宽度
        cvs.width = img_obj.naturalWidth;
        cvs.height = img_obj.naturalHeight;
        cvs.getContext("2d").drawImage(img_obj, 0, 0);
        var newImageData = cvs.toDataURL(mime_type, quality);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        cvs.remove();
        return result_image_obj;
    };


    Utils.sortObjects = function(){
        var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字
        var oMultiDiff = {
            "19969": "DZ",
            "19975": "WM",
            "19988": "QJ",
            "20048": "YL",
            "20056": "SC",
            "20060": "NM",
            "20094": "QG",
            "20127": "QJ",
            "20167": "QC",
            "20193": "YG",
            "20250": "KH",
            "20256": "ZC",
            "20282": "SC",
            "20285": "QJG",
            "20291": "TD",
            "20314": "YD",
            "20340": "NE",
            "20375": "TD",
            "20389": "YJ",
            "20391": "CZ",
            "20415": "PB",
            "20446": "YS",
            "20447": "SQ",
            "20504": "TC",
            "20608": "KG",
            "20854": "QJ",
            "20857": "ZC",
            "20911": "PF",
            "20504": "TC",
            "20608": "KG",
            "20854": "QJ",
            "20857": "ZC",
            "20911": "PF",
            "20985": "AW",
            "21032": "PB",
            "21048": "XQ",
            "21049": "SC",
            "21089": "YS",
            "21119": "JC",
            "21242": "SB",
            "21273": "SC",
            "21305": "YP",
            "21306": "QO",
            "21330": "ZC",
            "21333": "SDC",
            "21345": "QK",
            "21378": "CA",
            "21397": "SC",
            "21414": "XS",
            "21442": "SC",
            "21477": "JG",
            "21480": "TD",
            "21484": "ZS",
            "21494": "YX",
            "21505": "YX",
            "21512": "HG",
            "21523": "XH",
            "21537": "PB",
            "21542": "PF",
            "21549": "KH",
            "21571": "E",
            "21574": "DA",
            "21588": "TD",
            "21589": "O",
            "21618": "ZC",
            "21621": "KHA",
            "21632": "ZJ",
            "21654": "KG",
            "21679": "LKG",
            "21683": "KH",
            "21710": "A",
            "21719": "YH",
            "21734": "WOE",
            "21769": "A",
            "21780": "WN",
            "21804": "XH",
            "21834": "A",
            "21899": "ZD",
            "21903": "RN",
            "21908": "WO",
            "21939": "ZC",
            "21956": "SA",
            "21964": "YA",
            "21970": "TD",
            "22003": "A",
            "22031": "JG",
            "22040": "XS",
            "22060": "ZC",
            "22066": "ZC",
            "22079": "MH",
            "22129": "XJ",
            "22179": "XA",
            "22237": "NJ",
            "22244": "TD",
            "22280": "JQ",
            "22300": "YH",
            "22313": "XW",
            "22331": "YQ",
            "22343": "YJ",
            "22351": "PH",
            "22395": "DC",
            "22412": "TD",
            "22484": "PB",
            "22500": "PB",
            "22534": "ZD",
            "22549": "DH",
            "22561": "PB",
            "22612": "TD",
            "22771": "KQ",
            "22831": "HB",
            "22841": "JG",
            "22855": "QJ",
            "22865": "XQ",
            "23013": "ML",
            "23081": "WM",
            "23487": "SX",
            "23558": "QJ",
            "23561": "YW",
            "23586": "YW",
            "23614": "YW",
            "23615": "SN",
            "23631": "PB",
            "23646": "ZS",
            "23663": "ZT",
            "23673": "YG",
            "23762": "TD",
            "23769": "ZS",
            "23780": "QJ",
            "23884": "QK",
            "24055": "XH",
            "24113": "DC",
            "24162": "ZC",
            "24191": "GA",
            "24273": "QJ",
            "24324": "NL",
            "24377": "TD",
            "24378": "QJ",
            "24439": "PF",
            "24554": "ZS",
            "24683": "TD",
            "24694": "WE",
            "24733": "LK",
            "24925": "TN",
            "25094": "ZG",
            "25100": "XQ",
            "25103": "XH",
            "25153": "PB",
            "25170": "PB",
            "25179": "KG",
            "25203": "PB",
            "25240": "ZS",
            "25282": "FB",
            "25303": "NA",
            "25324": "KG",
            "25341": "ZY",
            "25373": "WZ",
            "25375": "XJ",
            "25384": "A",
            "25457": "A",
            "25528": "SD",
            "25530": "SC",
            "25552": "TD",
            "25774": "ZC",
            "25874": "ZC",
            "26044": "YW",
            "26080": "WM",
            "26292": "PB",
            "26333": "PB",
            "26355": "ZY",
            "26366": "CZ",
            "26397": "ZC",
            "26399": "QJ",
            "26415": "ZS",
            "26451": "SB",
            "26526": "ZC",
            "26552": "JG",
            "26561": "TD",
            "26588": "JG",
            "26597": "CZ",
            "26629": "ZS",
            "26638": "YL",
            "26646": "XQ",
            "26653": "KG",
            "26657": "XJ",
            "26727": "HG",
            "26894": "ZC",
            "26937": "ZS",
            "26946": "ZC",
            "26999": "KJ",
            "27099": "KJ",
            "27449": "YQ",
            "27481": "XS",
            "27542": "ZS",
            "27663": "ZS",
            "27748": "TS",
            "27784": "SC",
            "27788": "ZD",
            "27795": "TD",
            "27812": "O",
            "27850": "PB",
            "27852": "MB",
            "27895": "SL",
            "27898": "PL",
            "27973": "QJ",
            "27981": "KH",
            "27986": "HX",
            "27994": "XJ",
            "28044": "YC",
            "28065": "WG",
            "28177": "SM",
            "28267": "QJ",
            "28291": "KH",
            "28337": "ZQ",
            "28463": "TL",
            "28548": "DC",
            "28601": "TD",
            "28689": "PB",
            "28805": "JG",
            "28820": "QG",
            "28846": "PB",
            "28952": "TD",
            "28975": "ZC",
            "29100": "A",
            "29325": "QJ",
            "29575": "SL",
            "29602": "FB",
            "30010": "TD",
            "30044": "CX",
            "30058": "PF",
            "30091": "YSP",
            "30111": "YN",
            "30229": "XJ",
            "30427": "SC",
            "30465": "SX",
            "30631": "YQ",
            "30655": "QJ",
            "30684": "QJG",
            "30707": "SD",
            "30729": "XH",
            "30796": "LG",
            "30917": "PB",
            "31074": "NM",
            "31085": "JZ",
            "31109": "SC",
            "31181": "ZC",
            "31192": "MLB",
            "31293": "JQ",
            "31400": "YX",
            "31584": "YJ",
            "31896": "ZN",
            "31909": "ZY",
            "31995": "XJ",
            "32321": "PF",
            "32327": "ZY",
            "32418": "HG",
            "32420": "XQ",
            "32421": "HG",
            "32438": "LG",
            "32473": "GJ",
            "32488": "TD",
            "32521": "QJ",
            "32527": "PB",
            "32562": "ZSQ",
            "32564": "JZ",
            "32735": "ZD",
            "32793": "PB",
            "33071": "PF",
            "33098": "XL",
            "33100": "YA",
            "33152": "PB",
            "33261": "CX",
            "33324": "BP",
            "33333": "TD",
            "33406": "YA",
            "33426": "WM",
            "33432": "PB",
            "33445": "JG",
            "33486": "ZN",
            "33493": "TS",
            "33507": "QJ",
            "33540": "QJ",
            "33544": "ZC",
            "33564": "XQ",
            "33617": "YT",
            "33632": "QJ",
            "33636": "XH",
            "33637": "YX",
            "33694": "WG",
            "33705": "PF",
            "33728": "YW",
            "33882": "SR",
            "34067": "WM",
            "34074": "YW",
            "34121": "QJ",
            "34255": "ZC",
            "34259": "XL",
            "34425": "JH",
            "34430": "XH",
            "34485": "KH",
            "34503": "YS",
            "34532": "HG",
            "34552": "XS",
            "34558": "YE",
            "34593": "ZL",
            "34660": "YQ",
            "34892": "XH",
            "34928": "SC",
            "34999": "QJ",
            "35048": "PB",
            "35059": "SC",
            "35098": "ZC",
            "35203": "TQ",
            "35265": "JX",
            "35299": "JX",
            "35782": "SZ",
            "35828": "YS",
            "35830": "E",
            "35843": "TD",
            "35895": "YG",
            "35977": "MH",
            "36158": "JG",
            "36228": "QJ",
            "36426": "XQ",
            "36466": "DC",
            "36710": "JC",
            "36711": "ZYG",
            "36767": "PB",
            "36866": "SK",
            "36951": "YW",
            "37034": "YX",
            "37063": "XH",
            "37218": "ZC",
            "37325": "ZC",
            "38063": "PB",
            "38079": "TD",
            "38085": "QY",
            "38107": "DC",
            "38116": "TD",
            "38123": "YD",
            "38224": "HG",
            "38241": "XTC",
            "38271": "ZC",
            "38415": "YE",
            "38426": "KH",
            "38461": "YD",
            "38463": "AE",
            "38466": "PB",
            "38477": "XJ",
            "38518": "YT",
            "38551": "WK",
            "38585": "ZC",
            "38704": "XS",
            "38739": "LJ",
            "38761": "GJ",
            "38808": "SQ",
            "39048": "JG",
            "39049": "XJ",
            "39052": "HG",
            "39076": "CZ",
            "39271": "XT",
            "39534": "TD",
            "39552": "TD",
            "39584": "PB",
            "39647": "SB",
            "39730": "LG",
            "39748": "TPB",
            "40109": "ZQ",
            "40479": "ND",
            "40516": "HG",
            "40536": "HG",
            "40583": "QJ",
            "40765": "YQ",
            "40784": "QJ",
            "40840": "YK",
            "40863": "QJG"
        };
//参数,中文字符串
//返回值:拼音首字母串数组
        function makePy(str) {
            if (typeof(str) != "string")
                throw new Error(-1, "函数makePy需要字符串类型参数!");
            var arrResult = new Array(); //保存中间结果的数组
            for (var i = 0, len = str.length; i < len; i++) {
//获得unicode码
                var ch = str.charAt(i);
//检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
                arrResult.push(checkCh(ch));
            }
//处理arrResult,返回所有可能的拼音首字母串数组
            return mkRslt(arrResult);
        }

        function checkCh(ch) {
            var uni = ch.charCodeAt(0);
//如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
            if (uni > 40869 || uni < 19968)
                return ch; //dealWithOthers(ch);
//检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
            return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
        }

        function mkRslt(arr) {
            var arrRslt = [""];
            for (var i = 0, len = arr.length; i < len; i++) {
                var str = arr[i];
                var strlen = str.length;
                if (strlen == 1) {
                    for (var k = 0; k < arrRslt.length; k++) {
                        arrRslt[k] += str;
                    }
                } else {
                    var tmpArr = arrRslt.slice(0);
                    arrRslt = [];
                    for (k = 0; k < strlen; k++) {
//复制一个相同的arrRslt
                        var tmp = tmpArr.slice(0);
//把当前字符str[k]添加到每个元素末尾
                        for (var j = 0; j < tmp.length; j++) {
                            tmp[j] += str.charAt(k);
                        }
//把复制并修改后的数组连接到arrRslt上
                        arrRslt = arrRslt.concat(tmp);
                    }
                }
            }
            return arrRslt;
        }

//两端去空格函数
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        };

//查看拼音首字母缩写
        function query() {
            var str = document.getElementById("txtChinese").value.trim();
            if (str == "") return;
            var arrRslt = makePy(str);
            alert(arrRslt);
        }
    };

    //↓↓======================加减乘除方法区域====================↓↓//

    //除法函数，用来得到精确的除法结果
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：accDiv(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
    function accDiv(arg1,arg2){
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split(".")[1].length}catch(e){}
        try{t2=arg2.toString().split(".")[1].length}catch(e){}
        with(Math){
            r1=Number(arg1.toString().replace(".",""))
            r2=Number(arg2.toString().replace(".",""))
            return (r1/r2)*pow(10,t2-t1);
        }
    }

//给Number类型增加一个div方法，调用起来更加方便。
    Number.prototype.div = function (arg){
        return accDiv(this, arg);
    }

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
    function accMul(arg1,arg2)
    {
        var m=0,s1=arg1.toString(),s2=arg2.toString();
        try{m+=s1.split(".")[1].length}catch(e){}
        try{m+=s2.split(".")[1].length}catch(e){}
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    }

//给Number类型增加一个mul方法，调用起来更加方便。
    Number.prototype.mul = function (arg){
        return accMul(arg, this);
    };

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
    function accAdd(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2))
        return (arg1*m+arg2*m)/m
    }

    //给Number类型增加一个add方法，调用起来更加方便。
    Number.prototype.add = function (arg){
        return accAdd(arg,this);
    };


    //减法函数
    function accSub(arg1, arg2) {
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    };
    //给Number类型增加一个add方法，调用起来更加方便。
    Number.prototype.sub = function (arg){
        return accSub(arg,this);
    };

    /**
     * 将数字转换为中文
     * @param formObj
     * @returns {*}
     */
    Utils.numberToChinese = function(num){
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;

        if(num === 0){
            return _chnNumChar[0];
        }

        while(num > 0){
            var section = num % 10000;
            if(needZero){
                chnStr = _chnNumChar[0] + chnStr;
            }
            strIns = _SectionToChinese(section);
            strIns += (section !== 0) ? _chnUnitSection[unitPos] : _chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }

        return chnStr;
    };
    var _chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    var _chnUnitSection = ["","万","亿","万亿","亿亿"];
    var _chnUnitChar = ["","十","百","千"];
    function _SectionToChinese(section){
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = _chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = _chnNumChar[v];
                strIns += _chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }



    return Utils;
})(window.Utils || {});
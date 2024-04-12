function returnFun(type_P){
    fnTurnPage(type_P);
}
 function fnTurnPage(str,currentPage1,totalPage1,pagesize1)
{
	
 var currentPage = parseInt(currentPage1);
 var totalPage = parseInt(totalPage1); 
 var pagesize = parseInt(pagesize1); 

 var pageNum = 1;
 if(str == "first")
 {
  pageNum = 1;
 }
 if(str == "previous")
 {
  if(currentPage > 1) pageNum = currentPage-1;
 }
 if(str == "next")
 {
  if(currentPage < totalPage) 
     pageNum = currentPage + 1;
  else
     pageNum = totalPage; 
 }
 if(str == "last")
 {
  pageNum = totalPage;
 } 
 var url = window.location.href;
 
 var indexN2 = url.indexOf("p=");
 if(indexN2>-1){
	 url = url.substring(0,indexN2+2);
	 url += pageNum;
 }else{
     if(url.indexOf("?")>-1){
    	 url += "&p="+pageNum;
     } else{
    	 url += "?p="+pageNum;
     }
 }
 //alert(url);
 window.location = url;

}

/////////////////////////////////////////
function gotoPage(currentPage1,totalPage1,pagesize1){ 
	 var currentPage = parseInt(currentPage1);
	 var totalPage = parseInt(totalPage1); 
	 var pagesize = parseInt(pagesize1); 
  var gotoPage1 = document.getElementById("goPage").value;
  if(trim(gotoPage1)==""){
     alert("请输入页数");
	 document.getElementById("goPage").select();
	 return;
  }else{
	  if(!checkint(gotoPage1))
	  {
		 alert("只能输入整数!");   	 
		 document.getElementById("goPage").select();
		 return;
	  }
		if(gotoPage1 < 1 || gotoPage1 > totalPage)
	   {
		   alert("你输入的页数超出范围,请重新输入!");
           document.getElementById("goPage").select();
		   return;
	   }else{
		   //alert(gotoPage1);
	         var url = window.location.href; 

	         var indexN2 = url.indexOf("p=");
	         if(indexN2>-1){
	        	 url = url.substring(0,indexN2+2);
	        	 url += gotoPage1;
	         }else{
	             if(url.indexOf("?")>-1){
	            	 url += "&p="+gotoPage1;
	             } else{
	            	 url += "?p="+gotoPage1;
	             } 
	         }
	         //alert(url);
	         window.location = url;
	         
	         /*
			 var indexN2 = url.indexOf("?");
			 if(indexN2>-1)
			 {
			   url = url.substring(0,indexN2)
			 }
			 //alert(url);
			 url += "?treeId="+treeId+"&ps="+gotoPage1;
			 window.location = url;
			 */
	   }
  }
  
}
function checkint(svalue){
	  var zhengshu = /^(\s)*[0-9]*(\s)*$/;
	  if(zhengshu.test(svalue)){
	      return true;
	   }else{
	     return false;
	  }
}
function trim(str){
	 str = str.toString()
	 var index = str.indexOf(" ")
	 if(index == -1 || str.length == 0) 
	  return str
	 //去掉头部空格
	 if(index == 0){
	  while(index == 0)
	  {
	   str = str.replace(" ","")
	   index = str.indexOf(" ")
	  }
	 }
	 return str;
} 



$(document).ready(function(){	

        if($("#search_form_span").length>0){
			 //alert('存在'); 
			var GetUrl = request.getUrl();
			var Plist = [];
			if (GetUrl.indexOf('?') > 0) {
				Plist = GetUrl.split('?')[1].split('&');
			} else if (GetUrl.indexOf('#') > 0) {
				Plist = GetUrl.split('#')[1].split('&');
			}
			var q2 = request.getParameter("q2");
			//if(q2=="undefined"){
			//	 q2 = "";
			//}
			//alert(q2);
			if (GetUrl.length > 0) {
				for (var i = 0; i < Plist.length; i++) {
					var GetValue = Plist[i].split('=');
					//alert(GetValue[0]+"===" + GetValue[1]);
					var name = GetValue[0];
					var value = decodeURI(GetValue[1]);
					if(name=='p'){
					    value='1';
					}
					if(name!="q2"){
						if(q2 != ""){
							q2 = q2.replace("+"," ");
						}
						if(name=="q" && q2 != ""){
						    value = value + "AND" + decodeURI(q2);
						}  
						//alert(value);
						var inputStr = "<input type='hidden' id='"+name+"' name='"+name+"' value='"+value+"'/>"
						$("#search_form_span").append(inputStr);
					}
				}
			}
        }else{
		    
		}

});




/**
 * 对页面request对象的实现,可以得到页面地址,参数,读写cookie等
 * @param {Object} name
 */
request = {
	/**
	 * 得到参数	如在aaa.html?id=1中request.getParameter("id")得到1
	 * @param {Object} name	参数名
	 */
	getParameter : function(name) {
		var GetUrl = this.getUrl();
		var Plist = [];
		if (GetUrl.indexOf('?') > 0) {
			Plist = GetUrl.split('?')[1].split('&');
		} else if (GetUrl.indexOf('#') > 0) {
			Plist = GetUrl.split('#')[1].split('&');
		}
		if (GetUrl.length > 0) {
			for (var i = 0; i < Plist.length; i++) {
				var GetValue = Plist[i].split('=');
				if (GetValue[0].toUpperCase() == name.toUpperCase()) {
					return GetValue[1];
					break;
				}
			}
			return "";
		}
	},
	/**
	 * 如果有多个值的参数,返回包含全部值的Array对象
	 * @param {Object} name
	 */
	getParameters : function(name) {
		var param=this.getParameter(name);
		if(param){
			return param.split(",");
		}
	},
	/** 获取浏览器URL */
	getUrl : function() {
		return location.href;
	},
	/**得到应用的context*/
	getContextPath : function() {
		return context;
	},
//	getSession : function(){
//		return jsonrpc.jsonUtil.getSession();
//	},
	/*
	 * cookies设置函数 @name Cookies名称 @value 值
	 */
	setCookie : function(name, value) {
		try {
			var longTimes = 0;
			var argv = this.setCookie.arguments;
			var argc = this.setCookie.arguments.length;
			var expires = (argc > 2) ? argv[2] : null;			
			if (expires != null) {
				var str1=expires.substring(1,expires.length)*1; 
				var str2=expires.substring(0,1); 
				if (str2=="s"){
					longTimes = str1*1000;
				}else if (str2=="h"){
					longTimes = str1*60*60*1000;
				}else if (str2=="d"){
					longTimes = str1*24*60*60*1000;
				}
				var LargeExpDate = new Date();
				LargeExpDate.setTime(LargeExpDate.getTime()
						+ (longTimes));
			}
			document.cookie = name
					+ "="
					+ escape(value)
					+ ((expires == null) ? "" : ("; expires=" + LargeExpDate
							.toGMTString()));
			return true;
		} catch (e) {
			alert(e.description);
			return false;
		}
	},
	/*
	 * cookies读取函数 @Name Cookies名称 返回值 Cookies值
	 */
	getCookie : function(Name) {
		var search = Name + "="
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search)
			if (offset != -1) {
				offset += search.length
				end = document.cookie.indexOf(";", offset)
				if (end == -1)
					end = document.cookie.length
				return unescape(document.cookie.substring(offset, end))
			} else {
				return;
			}
		}
	},
	removeCookie: function(name){
		if (this.getCookie(name)) {
			document.cookie = name + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
	}
};
 
var MemberManRPC = jsonrpc.MemberManRPC;

var memberBean = null;
$(document).ready(function() {	

		memberBean = MemberManRPC.getMemberBySession();

		if(memberBean == null){
		
 	           MemberManRPC.setUrlToSession(window.location.href);

			window.location.href = "/member/memberLogin.htm";

		}else{  
		
                   if(memberBean.me_nickname.indexOf("-ll")!=-1){

			   $(".homeLogin").remove(); 
		
                           var href = window.location.href;  
	
 		          if(href.indexOf("memberManage")!=-1){
	
      		             window.location.href = "/info/iList.jsp?cat_id=18065";

			   }
		  
               }else{
			
                           $("#me_nickname").html(memberBean.me_nickname); 
                          $("#me_logout_btn").html("<a href='/info/iList.jsp?tm_id=875'>修改密码</a>");
			    $("#me_login_btn").html("<a href='javascript:logout()'>注销</a>");
  
		   }
		
	
	}
});



function logout(){

	var success =  MemberManRPC.logout();
 
	if(success){
	 
          window.location.href = "/member/memberLogin.htm";

 	}
	
 
}








function  updatePassword(){
 
var  password=$("#me_password").val();
var  me_account=$("#me_account").val();
var  password1=$("#me_password1").val();
if(me_account==null||me_account==""||me_account.trim()==""){
  alert("账户不能为空");
  return;

}

if(password==null||password==""||password.trim()==""){

   alert("密码不能为空");
   return;

}



if(password1==null||password1==""||password1.trim()==""){
   alert("确认密码不能为空");
   return;
}

if(password1!=password){
 
alert("两次输入的密码不一致！");
  return;

}


password = encrypt($.trim(password));
     var message = MemberManRPC.updateMemberInfo(password,me_account);
     if(message){ 
  alert("修改成功");
 logout();
     }else{
     alert("修改失败");
     }
     
          
  
}

$(function () {
	$('#menu dt').click(function () {
		$('#menu dt').removeClass('active')
		$(this).addClass('active').next('dd').slideDown().siblings('dd').slideUp();
	})
    //jQuery(".mfocus").slide({titCell:".hd ul",mainCell:".bd ul",effect:"left",autoPage:true,autoPlay:true});
    //jQuery(".mtab").slide({ titCell:".mtabt li", mainCell:".mtabcon"});
    jQuery(".toproll").slide({mainCell:".bd ul",effect:"left",autoPage:true,autoPlay:true,vis:3});
    

})





















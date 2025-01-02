$(function () {
	
    jQuery(".focus").slide({titCell:".hd ul",mainCell:".bd ul",effect:"left",autoPage:true,autoPlay:true});
	jQuery(".banner").slide({titCell:".hd ul",mainCell:".bd ul",effect:"left",autoPage:true,autoPlay:true});
    jQuery(".bdnews").slide({ titCell:".tabt a", mainCell:".tabcon"});
    jQuery(".mtnews").slide({mainCell:".bd ul",effect:"top",autoPage:true,autoPlay:false,vis:6,scroll:6});
    jQuery(".nroll").slide({mainCell:".bd ul",effect:"top",autoPage:true,autoPlay:false,vis:5,scroll:5,prevCell:".sprev",nextCell:".snext"});

})





















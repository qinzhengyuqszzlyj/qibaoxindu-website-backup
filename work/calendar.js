// 关于月份： 在设置时要-1，使用时要+1
$(function () {

  $('#calendar').calendar({
    ifSwitch: true, // 是否切换月份
    hoverDate: false, // hover是否显示当天信息
    backToday: false // 是否返回当天
  });

});

;(function ($, window, document, undefined) {

  var Calendar = function (elem, options) {
    this.$calendar = elem;

    this.defaults = {
      ifSwitch: true,
      hoverDate: false,
      backToday: false
    };

    this.opts = $.extend({}, this.defaults, options);

    // console.log(this.opts);
  };

  Calendar.prototype = {
    showHoverInfo: function (obj) { // hover 时显示当天信息
     
    },

    showCalendar: function () { // 输入数据并显示
      var self = this;
      var year = dateObj.getDate().getFullYear();
      var month = dateObj.getDate().getMonth() + 1;
      var dateStr = returnDateStr(dateObj.getDate());

      var firstDay = new Date(year, month - 1, 1); // 当前月的第一天

      this.$calendarTitle_text.text(year + '年' + parseInt(dateStr.substr(4, 2))+'月');
		
	  var first_day_count = firstDay.getDay();
	  if(first_day_count == 0)
	  {
		//表示是周天,因为要从周一开始显示,所以这里特殊处理一下
		first_day_count = 7;
	  }
	  first_day_count = first_day_count -1;
	  var index = 0;
      this.$calendarDate_item.each(function (i) {
		  //第一列现在放成周工作了,所以这里特殊处理下
		if(!$(this).hasClass('week_detail_li'))
		{
			// allDay: 得到当前列表显示的所有天数
			var allDay = new Date(year, month - 1, index + 1 - first_day_count);
			//console.log(firstDay.getDay())
			var allDay_str = returnDateStr(allDay);
			console.log(allDay_str)
			
			$(this).text(allDay.getDate()).attr('data', allDay_str);

			if (returnDateStr(new Date()) === allDay_str) {
			  $(this).attr('class', 'item item-curDay');
			  //console.log('item-curDay=='+allDay_str.substr(6, 2));
				$("#mm_curday").html(allDay_str.substr(6, 2));
				
			} else if (returnDateStr(firstDay).substr(0, 6) === allDay_str.substr(0, 6)) {
			  $(this).attr('class', 'item item-curMonth');
			} else {
			  $(this).attr('class', 'item');
			}
			index++;
		}
      });
    },

    renderDOM: function () { // 渲染DOM
      this.$calendar_title = $('<div class="calendar-title"></div>');
      this.$calendar_week = $('<ul class="calendar-week"></ul>');
      this.$calendar_date = $('<ul class="calendar-date"></ul>');
      this.$calendar_today = $('<div class="calendar-today"></div>');

	//'<a href="#" class="title"></a>'+
                      //'<a href="javascript:;" id="backToday">T</a>'+
      var _titleStr = '<div class="arrow">'+
                        '<span class="arrow-prev">&#160;<</span>'+
						'<a href="#" class="title"></a>'+
                        '<span class="arrow-next">>&#160</span>'+
                      '</div>';
      var _weekStr =  '<li class="item" style="width:100px; background-color: #E7F4FF;">一周安排</li>'+
					  '<li class="item">一</li>'+
                      '<li class="item">二</li>'+
                      '<li class="item">三</li>'+
                      '<li class="item">四</li>'+
                      '<li class="item">五</li>'+
                      '<li class="item">六</li>'+
					  '<li class="item">日</li>';

      var _dateStr = '';
      var _dayStr = '<i class="triangle"></i>'+
                    '<p class="date"></p>'+
                    '<p class="week"></p>';

      for (var i = 0; i < 6; i++) {
        _dateStr += '<li class="item week_detail_li" style="width:100px;"></li>'+
					'<li class="item">26</li>'+
                    '<li class="item">26</li>'+
                    '<li class="item">26</li>'+
                    '<li class="item">26</li>'+
                    '<li class="item">26</li>'+
                    '<li class="item">26</li>'+
                    '<li class="item">26</li>';
      }

      this.$calendar_title.html(_titleStr);
      this.$calendar_week.html(_weekStr);
      this.$calendar_date.html(_dateStr);
      this.$calendar_today.html(_dayStr);

	  $("#calendar-side").append(this.$calendar_title);
      this.$calendar.append(this.$calendar_week, this.$calendar_date, this.$calendar_today);
      this.$calendar.show();
    },

    inital: function () { // 初始化
      var self = this;

      this.renderDOM();

      this.$calendarTitle_text = this.$calendar_title.find('.title');
      this.$backToday = $('#backToday');
      this.$arrow_prev = this.$calendar_title.find('.arrow-prev');
      this.$arrow_next = this.$calendar_title.find('.arrow-next');
      this.$calendarDate_item = this.$calendar_date.find('.item');
      this.$calendarToday_date = this.$calendar_today.find('.date');
      this.$calendarToday_week = this.$calendar_today.find('.week');

      this.showCalendar();

      if (this.opts.ifSwitch) {
		 this.$calendarDate_item.bind('click', function () {
			 $(".item").removeClass("cur");
			 $(this).addClass("cur");
			 if(!$(this).hasClass('week_detail_li'))
			 {
				 var _date = $(this).attr('data');
				 var c_date = _date.substring(0,4)+"-"+_date.substring(4,6)+"-"+_date.substring(6,8);
					
					$(".opendiv").hide();
					console.log("item-left=="+$(this).offset().left);
					console.log("item-top=="+$(this).offset().top);
					$("#arrange_info").css("left",$(this).offset().left+47);
					$("#arrange_info").css("top",$(this).offset().top);
					$("#arrange_info").show();
					
				 showArrangeFDay(c_date,changingStr(c_date).getDay());
			 }else{
				//点击工作周
				var week_id = $(this).attr('week_id');
				if(week_id != null && week_id != undefined && week_id != '')
				{
					$(".opendiv").hide();
					console.log("item-left=="+$(this).offset().left);
					console.log("item-top=="+$(this).offset().top);
					$("#arrange_week").css("left",$(this).offset().left+100);
					$("#arrange_week").css("top",$(this).offset().top);
					$("#arrange_week").show();
					
					showArrange(week_id,$(this).attr('week_code'));
				}
			}
        });
        this.$arrow_prev.bind('click', function () {
          var _date = dateObj.getDate();
		  var new_date = new Date(_date.getFullYear(), _date.getMonth() - 1, 1);
          dateObj.setDate(new_date);
          self.showCalendar();
		  //alert(new_date.getFullYear()+"-"+(new_date.getMonth() + 1))
		  var t_month = new_date.getMonth() + 1;
		  if(t_month < 10)
			  t_month = "0"+t_month;
		  getWeekDetailList(new_date.getFullYear()+"-"+t_month);
        });

        this.$arrow_next.bind('click', function () {
          var _date = dateObj.getDate();
		  var new_date = new Date(_date.getFullYear(), _date.getMonth() + 1, 1);
          dateObj.setDate(new_date);	
          self.showCalendar();
		  //alert(new_date.getFullYear()+"-"+(new_date.getMonth() + 1))
		  var t_month = new_date.getMonth() + 1;
		  if(t_month < 10)
			  t_month = "0"+t_month;
		  getWeekDetailList(new_date.getFullYear()+"-"+t_month);
        });
      }

      if (this.opts.backToday) {
        this.$backToday.bind('click', function () {
          if (!self.$calendarDate_item.hasClass('item-curDay')) {
            dateObj.setDate(new Date());

            self.showCalendar();
          }
        });
      }

      this.$calendarDate_item.hover(function () {
        self.showHoverInfo($(this));
      }, function () {
        self.$calendar_today.css({left: 0, top: 0}).hide();
      });
    },

    constructor: Calendar
  };

  $.fn.calendar = function (options) {
    var calendar = new Calendar(this, options);

    return calendar.inital();
  };


  // ========== 使用到的方法 ==========

  var dateObj = (function () {
    var _date = new Date();

    return {
      getDate: function () {
        return _date;
      },

      setDate: function (date) {
        _date = date;
      }
    }
  })();

  function returnDateStr(date) { // 日期转字符串
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    month = month < 10 ? ('0' + month) : ('' + month);
    day = day < 10 ? ('0' + day) : ('' + day);

    return year + month + day;
  };

  function changingStr(fDate) { // 字符串转日期
    var fullDate = fDate.split("-");
    
    return new Date(fullDate[0], fullDate[1] - 1, fullDate[2]); 
  };

})(jQuery, window, document);



function getCurWeekstr(){
	var str = "";  
	var week = new Date().getDay();  
	if (week == 0) {  
	        str = "星期日";  
	} else if (week == 1) {  
	        str = "星期一";  
	} else if (week == 2) {  
	        str = "星期二";  
	} else if (week == 3) {  
	        str = "星期三";  
	} else if (week == 4) {  
	        str = "星期四";  
	} else if (week == 5) {  
	        str = "星期五";  
	} else if (week == 6) {  
	        str = "星期六";  
	}  
	
	return str;
}

$(document).ready(function() {
	updateDate();
	try {
		$('#sbar_in').smartsearch({dialog:'#details_dialog'});
		$('#new_file').button();
		$('#search_files').button();
		$('#transpop').button();
		$('#rolling_messages div').vTicker();
	
		$('#voucher_form').submit(function(){
			$('#voucher_info').attr('src','vouchers/'+$('#vid').val());
			$('#voucher_info').css({'height':'300px'});
//			$.get('vouchers/'+$('#vid').val(),function(data){
//				$('#voucher_info').html(data);
//				initWidgets();
//			});
			return false;
		});
		$('#suppliers .filter').tableFilter({'table': '#suppliers .content table'});
	}

	catch (err) {}
	$('#create_staff_voucher').click(function(){
		$('#staff_voucher_form').toggle();                    
	});

	$('#bar #uname').click(function(){
		$('#bar #profile').slideToggle();
	});
});

function updateDate (){
	$.get("/now/", function (d) {$('#date').html(d)});
	window.setTimeout (updateDate, 60000, true);
}



$(document).ready(function() {
	updateDate();
	$('#sbar_in').smartsearch({dialog:'#details_dialog'});
//	$('#new_group').button({icons:{primary:'ui-icon-plusthick'}}).click(function(){window.location.href='/group/new/';});
	$('#new_file').button();
	$('#search_files').button();
	$('#transpop').button();
	//$('#rolling_messages div').vTicker({'height':'130px'});
	$('#files_tabs').tabs();
	$('#files_tabs2').tabs();
	$('#mining_tabs').tabs();
	
	$('#bar #uname').click(function(){
		$('#bar #profile').slideToggle();
	});
});


function updateDate (){
	$.get("/now/", function (d) {$('#date').html(d)});
	window.setTimeout (updateDate, 60000, true);
}



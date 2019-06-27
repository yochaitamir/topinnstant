
$(document).ready(function() {
	$('#search_in').smartsearch ({dialog: '#details_dialog'});
	$("#textarea").keyup(function(e) {
		while($(this).outerHeight() < $(this).scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
			$(this).height($(this).height()+1);
		};
	});

	$('#bar #uname').click(function(){
		$('#bar #profile').slideToggle();
	});
});

function calc (){
	inp = $("#in").val();
	$("#res").val(eval(inp));
}


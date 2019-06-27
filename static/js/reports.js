
$(document).ready(function(){
	$("#xls_export").click(function (e) {
		window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
		e.preventDefault();
	});
});



$(document).ready(function() {
	$.tablesorter.defaults.widgets = ['zebra']; 
//	$('table.tablesorter').tablesorter({sortList: [[0,0]], dateFormat: 'ddmmyyyy'});

	$("table.tablesorter .delete").click(function ( event ) {
		var ndx = $(this).parent().index() + 1;
		$(this).closest('table.tablesorter').find("td:nth-child("+ndx+")").remove()
		$(this).closest('table.tablesorter').find("th:nth-child("+ndx+")").remove()
	});
	$('#remove_cols').click(function(){$('table.tablesorter .delete').toggle();});

	$('table.tablesorter').tablesorter({dateFormat : "ddmmyyyy"});
	var theTable = $('table.tablesorter');
	$("#table_filter").keyup(function() {$.uiTableFilter( theTable, this.value );})

	$('.links-dialog tbody tr').click(function(){
		var id = $(this).attr('title');
		var dialog = $('#details_dialog');
		var type = $('#list table').attr('title');
		$.get('/'+type+'/'+id+'/', function (res) {dialog.html(res); dialog.dialog();});
	});

	$("#xls_export").click(function (e) {
		var ht = $("table").html();
		//window.open('data:application/vnd.ms-excel,' + $('#content').html());
		window.open('data:application/vnd.ms-excel,' + ht);
		e.preventDefault();
	});

	$("#toggle_price").click(function (e) {
		$('th.price, td.price').toggle();
	});

	/*
	$("table.colshl thead th").hover(function (e,o) {

		console.log('hover')
		console.log(e)
		console.log(o)
	});
	*/
});


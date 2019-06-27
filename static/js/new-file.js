$(document).ready(function() {
	$("#file_form").submit( function (){
		return validForm($(this));
	});
	$('#id_ddate').focus(function(){
		var adate = $('#id_adate').datepicker("getDate");
		var ddate = $('#id_ddate').datepicker("getDate");
//		if (adate == null && ddate == null) return false;
		if (adate == null || ddate != null) return false;
		$('#id_ddate').datepicker("setDate", adate);
	})
	$('#id_adate,#id_ddate').blur(function(){
		var adate = $('#id_adate').datepicker("getDate");
		var ddate = $('#id_ddate').datepicker("getDate");
		if (adate == null || ddate == null) ngths = 'N/A';
		else ngths = Math.round((ddate-adate)/DAY_MILIISECS);
		$('#nightsn').html(ngths);
	});
});


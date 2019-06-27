

function check(){
	$('#linear_loader').show();
	$('.error').removeClass('error');;

	var pbs = []

	$("#file_form table tbody tr").each(function(){
		pbs.push({
			'date':$(this).data('date'),
			'dpk':$(this).find('td.driver select').val(),
			'vpk':$(this).find('td.vehicle select').val()
		});
	});

	/*
                $.post('save/',data, function(res) {
                        if (res['success'] == true ) timedMessage('#save_msg', 'Saved !');
                        else timedMessage('#save_msg', 'An Error Occurred. Please try again later.');
                });

	*/
	var jp = $.toJSON(pbs);
	$.post("check/", jp, function (json) {
		if (json.overlaps) {
			$.each(json.overlaps, function(key, d) {
				tr = $("#file_form table tr[data-date='"+d.date+"']");
				tr.addClass('error');
				if (d.drv){
					dtd = tr.find('td.driver');
					dtd.addClass('error');
					dtd.find('.overlaps').html(d.drv);
				}
				if (d.vh){
					vtd = tr.find('td.vehicle');
					vtd.addClass('error');
					if (d.hours_ol) vtd.addClass('hours-error');
					if (d.hours_ol) console.log('##############33')
					vtd.find('.overlaps').html(d.vh);
				}
			});
		}
		$('#linear_loader').hide();
	}, "json");
}

$(document).ready(function() {
	// File page:
	check();
	/*
	$('#file_form').submit(function(){
		alert('Submit!!')
		return false;
	});
	*/


	$('#check_btn').click(function(){check();});
	$('td.vehicle select, td.driver select').change(function(){check()});


	$('.multiedit').each(function(){
		$(this).find('select.supplier').html($("#id_form-0-supplier").html());
		$(this).find('select.vehicle').html($("#id_form-0-vehicle").html());
		$(this).find('select.driver').html($("#id_form-0-driver").html());
		//$(this).find('select.type').html($("#id_form-0-type").html());
	});
	$('.multiedit button').click(function(){
		var supplierval = $('table thead tr select.supplier').val();
		var vehicleval = $('table thead tr select.vehicle').val();
		var driverval = $('table thead tr select.driver').val();
		//var typeval = $('table thead tr select.type').val();
		$('table tbody tr').each(function(){
			$(this).find('select.supplier').val(supplierval);
			$(this).find('select.vehicle').val(vehicleval);
			$(this).find('select.driver').val(driverval);
			//$(this).find('select.type').val(typeval);
		});
		check();
		return false;
	});
});

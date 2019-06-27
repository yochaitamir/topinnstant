
$(document).ready(function() {
    Message('Loading information...');

	if ($('#assign_vehicles').length > 0) {
		// Assign vehicles page:
		$('.box select').change(function(){
			// check and notify for double usage of the same bus
			var cls = $(this).prop('class');
			var orig = $(this).parent().attr('data-file');
			var current = $(this).val();
			var d = $(this).parent().attr('data-date');
			var errors = [];
			$('.box[data-date="'+d+'"]').each(function(){
				var val = $(this).find('select.'+cls).val();
				if (val !='' && val == current){
					if ($(this).attr('data-file') != orig) errors.push('#'+$(this).attr('data-file'));
				}
			});
			if (errors.length > 0) $(this).parent().find('.error-'+cls).html(cls+' already in use by:'+errors);
			else $(this).parent().find('.error-'+cls).html('');
		});


		$('.color-box1, .color-box2, .color-box3').click(function(){
			var color = $(this).css('backgroundColor')
			$(this).parent().parent().find('.content').css({'background':color});
			return false;	
		});

		$('.multiedit').each(function(){
			$(this).find('select.vehicle').html($(".flex-container :first-child select.vehicle").html());
			$(this).find('select.driver').html($(".flex-container :first-child select.driver").html());
		});
		$('.multiedit button').click(function(){
			var vehicleval = $(this).parent().find('select.vehicle').val()
			var driverval = $(this).parent().find('select.driver').val()
			if ($(this).parents('.content').find("input:checked" ).length > 0) cnfrm = confirm('Are you sure? the driver is requested!!');
			else cnfrm = true;
			if (cnfrm){
				$(this).parents('.content').find('.box').each(function(){
					$(this).find('select.vehicle').val(vehicleval).change();
					$(this).find('select.driver').val(driverval).change();
				});
			}
		});
	}

	if ($('#id_year').length > 0) {
		$('#id_year, #id_month').change(function(){
			var key = $(this).attr('id');
			var value = $(this).val();
			localStorage.setItem(key, value)
		});

		$.each(['id_year', 'id_month'], function(index, key){
			if(localStorage.getItem(key)){
				value = localStorage.getItem(key);
				$('#'+key).val(value);
			}
		});


		$("#month_chooser").submit(function(e){
			location.href = $(this).attr('action')+$(this).find('#id_year').val()+"/"+$(this).find('#id_month').val();
			return false;
		});
	}

	/*

        // Unassigned groups page:

		$('.unassigned-file').click(function(){
			$(this).toggleClass('hl');	
			fpk = $(this).data('filepk');
			if ($(this).hasClass('hl')){
				// selected
				$("input[value='"+fpk+"']").attr('checked', true);
			}
			else {
				// de-selected
				$("input[value='"+fpk+"']").attr('checked', false);
			}
		});

	*/
});

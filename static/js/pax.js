
$(document).ready(function(){

	$( "#dialog" ).dialog({autoOpen: false,
		buttons: [
			{text: "All room", click: function() {
				var dnum = _dialogr.find('input:first').val();
				$('#pax_insert tbody tr.dynamic-form').each(function(){
					if ($(this).find('input:first').val() == dnum)
						$(this).find('.e-btn-delete-short').click()
				//	$(this).find('	
				});
				//_dialogr.html())
				$(this).dialog( "close" );
			}},
			
			{text: "Single person", click: function() {
				$( this ).dialog( "close" );
			}},
		]
	 });

	$('.e-btn-print').click(function(){$("ul.#printmenu").toggle();});
	$('.e-btn-edit').click(function(){$("ul.#editmenu").toggle();});
	var room_num = 1;
	$('#pax_edit tbody tr').formset({deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short', prefix: 'passenger_set', addded: function () {initIcons(); initDatePickers()}});
	$('#pax_insert tbody tr').formset({
		deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short', prefix: 'passenger_set',
		addded: function () {initIcons();},
		removed: function(r){
			var rtype = r.find('select').val();
			if (rtype != 's'){
				_dialogr = r;
				 $("#dialog").dialog( "open" );
			}
			
			var rowspan = r.find('td:last').attr('rowspan')
			if (rowspan > 1){
				var roomid = r.find('input:first').val();
				$('#pax_insert tbody tr').each(function(){
					if ($(this).find('input:first').val() == roomid)
						$(this).find('td:last-child a').click()
				});
			}
		
			if (room_num > 1) room_num--;
		}
	});

	$('#pax_edit tr.dynamic-form:last').hide();
	$('#pax_insert tr.dynamic-form:last').hide();

	var lr = $('#pax_insert tr.dynamic-form:visible:last');
	if (lr.length > 0) room_num = 1 + 1*(lr.find('td:first-child input').val());
	$('#new_rooom_size').keypress(function(e) {
		if(e.which == 13) {
			$('#new_room').click();
		}
		return false;
	});
	$('#new_room').click(function(){
		var ROOMS = ['a','s','d','t','q'];
		var size = $('#new_room_size').attr('value');
		if (size) { 
			if ((size) > 4) size = 4;
			for (ai=1; ai<=size; ai++){
				$('#pax_insert .add-row').click();
				var lastrow = $('#pax_insert tr.dynamic-form:last');
				if (ai==1) firstrow = lastrow;
				/*
				if (ai==1){
					firstrow = lastrow;
					firstrow.find('td:first').attr('rowspan',size);
					firstrow.find('td:last').attr('rowspan',size);
					firstrow.addClass('new-room');
				}
				else {				
					lastrow.find('td:first').hide();
					lastrow.find('td:last').hide();
				}
				lastrow.addClass('newroom'+ai)
				*/
				lastrow.find('input:first').val(room_num);
				lastrow.find('select:first').val(ROOMS[size]);
			}
			room_num++;
			firstrow.find('input:eq(1)').focus();
		}
		return false;
	});
	
	$('#flights_form tbody tr').formset({
		addText: 'Add Flight', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
		prefix: 'flight_set', // causes serious bug. this is the {{formset.prefix}} value
		added: function () {initIcons(); initDatePickers(); }
//          initWidgets();
//            initIcons();
  //          initDatePickers();
	});
	$('#rl_pax tbody tr').formset({deleteText:'Delete', deleteCssClass: 'e-btn-delete-short', prefix: 'passengerroom_set','addText':''});


});



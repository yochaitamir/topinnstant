
$(document).ready(function() {
	$('#hotels_dialog').dialog({ autoOpen: false, title: 'Hotels', width: 620, position: 'top', buttons: {
		"Save": function() {
			if (validForm($('#hotels_form'))){
				var dates_valid = true;
				var from = $(this).find('#id_from_date').datepicker('getDate');
				var till = $(this).find('#id_till_date').datepicker('getDate');
				var till = $(this).find('#id_till_date').datepicker('getDate');

				// check hotel from is in file dates:
				if ($('#id_adate').datepicker('getDate') > from) dates_valid = false;
				
				// check hotel till is in file dates:
				if (till > $('#id_ddate').datepicker('getDate')) dates_valid = false;

				// check every hotel date in nights:
				for(var date=from; date<till; date.setDate(date.getDate()+1)) {
					var datengts = 0;
					$('#nights_formset .nights-dynamic').each(function(){
						var ngtfrom = $(this).find('.from-date').datepicker('getDate');
						var ngttill = $(this).find('.till-date').datepicker('getDate');
						if (date >= ngtfrom && date < ngttill) datengts++;
					})
					if (datengts != 1) dates_valid = false;
				}
				dates_valid = true;
				if (dates_valid) Save('plan/hotel/'+$('#hotel_plan_id').html(), form2JSON($('#hotels_form')), '#hotels_dialog .message',function(){
					if ($('#hotels_adv_dialog').dialog( "isOpen" )) {
						$('#hotels_adv_dialog').dialog('close');
						$('#hotels_dialog').dialog('close');
						$('#hotels_adv_dialog').dialog( "open" );
					}
					else editHotels();
				});
				else timedMessage($(this).find('.message'),"Invalid Dated");
			}		
		},
		"Cancel": function() { $(this).dialog('close'); },
		"Delete": function() {if (confirmDialog("Are you sure you want to delete that hotel ?\n\nPlease make sure you cancel reservation as well (if exists).")){
			var hid = $('#hotel_plan_id').html();
			$.get("plan/hotel/"+hid+"/delete/", function (json) {
				if(json['success']) {
					Message ('Hotel Deleted.');
					$(this).dialog('close');
					if ($('#hotels_adv_dialog').dialog( "isOpen" )) {$('#hotels_adv_dialog').dialog('close');$('#hotels_adv_dialog').dialog( "open" );}
					editHotels();					
				}
				else Message ("Error: "+_ERRORS[json['error']]);
			});
		}},
		"Get Contract Prices": function() {
			var dlg =  $(this);
			var hid = dlg.find('#id_supplier').val();
			var from = dlg.find('#id_from_date').datepicker('getDate');
			from = $.datepicker.formatDate('yy-mm-dd' ,from);
			var to = dlg.find('#id_till_date').datepicker('getDate');
			to = $.datepicker.formatDate('yy-mm-dd' ,to);
			Message('Fetching hotel contract...');
			$.get("/hotel/"+hid+"/contract/"+from+"/"+to+"/", function (json) {
				if(json['success']) {
					var contract = json['contract'];
					if (contract['notes'] == '') { 			
						Message ('Got hotel contract.');
						var contract = json['contract'];
						dlg.find('#id_contract_single_suppliment').val(contract['ss']);
						dlg.find('#id_contract_child_reduction').val(contract['cr']);
						dlg.find('#id_contract_third_reduction').val(contract['tr']);
						dlg.find('#nights_formset tr.nights-dynamic').each(function() {
							var val = $(this).find('select option:selected').val();
							var price = 0;
							switch(val) {
								case '4': price = contract['pp_ro']; break;
								case '1': price = contract['pp_bb']; break;
								case '2': price = contract['pp_hb']; break;
								case '3': price = contract['pp_fb']; break;
							}
							$(this).find('input.contract-price').val(price);
						});
					}/* of if contract */
					else $("<div>"+contract['notes']+"</div>").dialog({position:['center','top']});	
				} /* of if json */
				else Message ("Error: "+_ERRORS[json['error']]);
			});
		}
		
	},
	});
	$('#hotels_adv_dialog').dialog({ autoOpen: false, title: 'Hotels', width: 900, position: 'top', buttons: {
		"Save":function(){
			if (validForm($('hotels_adv_form'))){
				Save('plan/hotels-adv/', form2JSON ($('#hotels_adv_form')));
				loadHotels()
				$(this).dialog('close');
				Message ("Saved.");
				refresh();
			}
		},
		"Cancel":function(){$(this).dialog('close');},
		},
		open: function () {
			Message('Loading Hotels...');
			$.get("plan/hotels-adv/", function (html) {
				$('#hotels_adv_dialog').html(html);
			});
		}
	});
	$('#hotels_btn').toggle(
		function() {
			editHotels();
			$('#hotels_btn').removeClass('editable');
		},
		function() {
			loadHotels();
			$('tr.ec-hotels').selectable('destroy');
			$('#hotels_btn').addClass('editable');
		}
	);
	$('#hotels_adv_btn').click(function() {$('#hotels_adv_dialog').dialog('open');});
});

function loadHotels () {
	// load hotels plannings
	Message ("Retrieving Events...");
	$.get("plan/hotels/", function (json) {
		if(json['success']) {
			drawHotels(json['hotels']);
			Message ('Hotels Loading Finished.');
		}
		else Message ("Error: "+_ERRORS[json['error']]);
//		else alert("Error: "+_ERRORS[json['error']])
	});
}

function drawHotels(hotels) {
    // draw hotels row
	$('tr.ec-hotels td').not('.ec-row-head').remove();
	var blank = $("<td class='ec-hotel0'></td>");
	blank.appendTo('tr.ec-hotels');
	for (var h=0; h<hotels.length; h++){
		var cls = (hotels[h]['name']=='')?'0':(1+h%2);
		var dt = (hotels[h]['date']=='')?'0':(1+h%2);
//		var night = $("<td class='ec-hotel"+cls+"' colspan='"+2*hotels[h]['len']+"'></td>");
//        night.html(hotels[h]['name']);      
		var night = $("<td class='ec-hotel"+cls+"' colspan='"+2*hotels[h]['len']+"'></td>");
		night.html(hotels[h]['name']+"<br />"+hotels[h]['date']);        
        night.appendTo($('tr.ec-hotels'));     
	}
}

function get_hotel_notes(hotelid){
	$('hotels_form .contract-file').remove();
	$.get("/hotel/"+hotelid+"/notes/",function(json){
		$('.contract-file').remove();
		if (json['success']) {
			if (json['notes'] != '') $("<div>"+json['notes']+"</div>").dialog({position:['right','top']});
			pdflink = $("<a class='contract-file' href='"+json['file']+"' target='_blank'><img src='/static/icons/pdf-icon.png' /> Contract</a>");
			pdflink.css('float','right');
			pdflink.appendTo($('#hotels_form p')[1]);
		}
	});
}

function loadHotelPlan(phid, from, till) {
	$('#hotels_dialog .content').html("<h2>Loading...</h2>");
	$('#hotels_dialog .message').empty();
	$('#hotels_dialog').dialog('open');
	Message('Loading Hotel...');
	$.get("plan/hotel/"+phid, function (html) {		
		$('#hotels_dialog .content').html(html);
		$('#id_from_date, #id_till_date').blur(function(){
			var adate = $('#id_from_date').datepicker("getDate");
			var ddate = $('#id_till_date').datepicker("getDate");
			if (adate == null || ddate == null) ngths = 'N/A';
			else ngths = Math.round((ddate-adate)/DAY_MILIISECS);
			$('#nightsn').html(ngths);
		});
		try {
		$('#hotels_dialog #nights_formset tbody tr').formset({
			addText:'Add board range', addCssClass:'e-btn-create', deleteText:'Delete', cancelTest: 'Cancel', deleteCssClass:'e-btn-delete-short',
			prefix: 'plannedhotelboard_set', formCssClass:'nights-dynamic',// causes serious bug. this is the {{formset.prefix}} value
			added: function () {initDatePickers($('#hotels_dialog')); initIcons($('#hotels_dialog'))}
		});
		} catch(err) {alert(err)}
		initDatePickers($('#hotels_dialog'));
		initIcons($('#hotels_dialog'));
		initComboBoxes($('#hotels_dialog'));
		if ((typeof(from) != "undefined") && (typeof(till) != "undefined")) {
			$('#hotels_form #id_from_date').datepicker('setDate', from);
			$('#hotels_form #id_plannedhotelboard_set-0-from_date').datepicker('setDate', from);
			
			$('#hotels_form #id_till_date').datepicker('setDate', till);
			// fix day/night dates issue - increment last date to match the next day
			till = $('#hotels_form #id_till_date').datepicker('getDate'); 
			till.setDate(till.getDate()+1); 
			$('#hotels_form #id_plannedhotelboard_set-0-till_date').datepicker('setDate', till);		
			$('#hotels_form #id_till_date').datepicker('setDate', till);
		}
		$('#id_from_date').trigger('blur');	// for nights sum
		$("#hotels_dialog #id_supplier").change(function(){
			hotelid = $(this).val();
			get_hotel_notes(hotelid);
		})
	});
}

function editHotels() {
	// edit hotels plannings
	$('tr.ec-hotels td').not('.ec-row-head').remove();
	var blank = $("<td class='ec-hotel0'>&nbsp;</td>");
	blank.appendTo('tr.ec-hotels');
	$.get("plan/hotels/", function (json) {
		if(json['success']) {
			var hotels = json['hotels'];
			var d = $("#id_adate").datepicker('getDate');
			for (var h=0; h<hotels.length; h++){
	
				var colspan = 2*hotels[h]['len'];
				var cls = (hotels[h]['phid']>0)?'hotel-edit-planned':'hotel-edit-new';
				var night = $("<td class='"+cls+"' colspan='"+colspan+"'></td>");
				night.html("<span>"+hotels[h]['name']+"</span><br /><span class='date'>"+hotels[h]['date']+"</span>");
				if (hotels[h]['phid']>0) {
					night.attr('title',hotels[h]['phid']);
					night.click(function(){loadHotelPlan($(this).attr('title'));});
				}
				night.appendTo($('tr.ec-hotels'));
				d.setDate(d.getDate()+1);
				
			}
			$('#hotels_dialog').dialog('close');
			
			$('tr.ec-hotels').selectable({cancel:'.hotel-edit-planned,.ec-row-head',filter:'td.hotel-edit-new',
				stop: function(event, ui) {
					if ($('.ui-selected').length <= 0) return;
					var from = $('.ui-selected', this).first().children('.date').html();
					var till = $('.ui-selected', this).last().children('.date').html();
					loadHotelPlan(0, from, till);
				}
			});
		}
		else Message('Error Loading Hotels.');
	});
}


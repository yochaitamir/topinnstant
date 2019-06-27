
var _GUIDESOPEN = false;
var _BUSESOPEN = false;
$(window).bind('beforeunload', function(e) {
	if(_GUIDESOPEN || _BUSESOPEN) {
		return 'sure?';
	}
});

function inDates(d,from,to){
	if (!from) from = $('#id_adate').datepicker('getDate');
	if (!to) to = $('#id_ddate').datepicker('getDate')
	return (d.getTime() >= from.getTime() && d.getTime() <= (to.getTime()+DAY_MILIISECS+10000000 /* js dates bug bypass */ ));
}

function guides_avail_check(){
	$('#guides_btn').hide();
	var grs = new Array();
	$('.ec-guide td.guide-day').each(function () {
		grs.push($(this).attr('id').substring(2)+_SEPERATOR+$(this).find('select').val());
	});
	$.post('plan/guides_avail_check/',{'guides':grs,'seperator': _SEPERATOR},function(json){
		if(json['success']){
			var conflict = false;
			$.each(json['results'], function(index, day) {
				var td = $(".ec-guide td.guide-day").eq(index);
				if (day != '') {
					td.find('.conflict').html('Booked on '+day);
					conflict = true;
				}
				else td.find('.conflict').empty('');
			});
			$('#guides_btn').data('conflict',conflict);
		}
		else alert('Problem fetching Availabilty info');
		$('#guides_btn').show();
	});
}

jQuery.fn.number = function() {
	var args = arguments[0] || {};
	var field = $(this[0]);
	max = args['Max'];
	min = args['Min'];
	errmsg = $('#errmsg');
	if (errmsg) errmsg.css("color", "red");
	field.bind('keypress', function(e) {return ( e.which!=8 && e.which!=0 && (e.which<48 || e.which>57)) ? false : true ;} )
	field.keyup(function () {
		var invalid = false;
		if (typeof max != 'undefined' && this.value > max) { errmsg.html("Too Big").show().fadeIn(); invalid = true; }
		if (typeof min != 'undefined' && this.value < min) { errmsg.html("Too Small").show().fadeIn(); invalid = true; }
		if (invalid) $(this).addClass("invalid-field");
		else {$(this).removeClass("invalid-field"); errmsg.hide().fadeOut("slow"); }
	})
};

function loadAttachment(aid) {
    $('#attachment_menu').hide();
    $('#attachment_dialog .content').html("<h2>Loading...</h2>");
    $('#attachment_dialog .message').empty();
    $('#attachment_dialog').dialog('open');
    Message('Loading Attcahment...');
    $.get("plan/attachment/"+aid, function (html) {
        $('#attachment_dialog .content').html(html);
    });
}


$(document).ready(function() {
	$('#basic').click(function() {$('#extended').toggle(); $('#basic_more').toggle();});
//	$('#id_pax').number ({ Max:53 });
	loadEvents(false);
	loadHotels();
	$('.wc-nav').html($('#calendar_toolbar').html ());


	// disable bus supplier change if vehicle selected:
	$('.ec-bus td.bus-day').each(function () {
		if ($(this).find('.vehicle').length > 0) {
			if ($(this).find('.vehicle').html().length > 2) {
				var sel = $(this).find('select.combobox');
				sel.ufd('disable');
				sel.prop( "disabled", true );
				sel.removeClass('combobox');
			}
		}
	});

	$('#buses_btn').toggle(
		function() {
			_BUSESOPEN = true;
			$('#bus_mass_dialog').dialog('open');
			$('.ec-bus td.bus-day').each(function () {$(this).find('div.edit').show(); $(this).find('div.display').hide();})	
		},
		function() {
			_BUSESOPEN = false;
			var brs = new Array();
			$('.ec-bus td.bus-day').each(function () {
				$(this).find('div.type').html($(this).find('input[type="radio"]:checked').parent().find('span').html())
				$(this).find('div.name').html($(this).find('select option:selected').text());
				$(this).find('div.name').data('pk', $(this).find('select option:selected').val());
				$(this).find('div.edit').hide(); $(this).find('div.display').show();
				brs.push($(this).attr('id').substring(2)+_SEPERATOR+$(this).find('input[type="radio"]:checked').val()+_SEPERATOR+$(this).find('select').val());
			});
			Save('save/buses/',{'buses': brs, 'seperator': _SEPERATOR});
			$('#bus_mass_dialog').dialog('close');
		}
	);
	$('#bus_mass_dialog').dialog({ autoOpen: false, title: 'Buses mass edit', width: 300, buttons: {
		"Apply": function(){
			var dtype = $(this).find('input:radio:checked').val();
			var supplier = $(this).find('select').val();
			var sname = $(this).find('select option:selected').text();

			$('.ec-bus td.bus-day').each(function () {
				$(this).find('input:radio[value="'+dtype+'"]').attr('checked','checked');
				$(this).find('select option[value="'+supplier+'"]').attr('selected', 'selected');
				$(this).find('.ufd input').val(sname);

			});
			$(this).find('.combobox').ufd("changeOptions");
			$(this).dialog('close');
		},
		"Close": function(){$(this).dialog('close');},
	}});

	$('#clean_btn').click(function(){
		Message('cleannig the data......');
		return Confirm('Are you sure you want to delete all these plannings?');
	});

	

	//
	// Guides :
	//

	$('#guides_btn').toggle(
		function() {
			_GUIDESOPEN = true;
			$('.ec-guide td.guide-day').each(function () {$(this).find('div.edit').show(); $(this).find('div.display').hide();})
			$('#guide_mass_dialog').dialog('open');
			$(this).parent().find('.hidden').show();
		},
		function() {
			_GUIDESOPEN = false;
			var grs = new Array();
			$('.ec-guide td.guide-day').each(function () {
				$(this).find('div.req').hide();
				$(this).find('div.type').html($(this).find('input[type="radio"]:checked').parent().find('span').html())
				$(this).find('div.name').html($(this).find('select option:selected').text());
				$(this).find('div.name').data('pk', $(this).find('select option:selected').val());
				$(this).find('div.edit').hide(); $(this).find('div.display').show();
				if ($(this).find('input[type="checkbox"]').is(':checked')) $(this).find('div.req').show();
				grs.push($(this).attr('id').substring(2)+_SEPERATOR+$(this).find('input[type="radio"]:checked').val()+_SEPERATOR+$(this).find('select').val()+_SEPERATOR+$(this).find('input[type="checkbox"]').prop('checked'));
			});
			if ($(this).data('conflict')){
				conflict = true;
				alert('TOP alert: Guide overlap problem detected.');
			}
			else conflict = false;
			Save('save/guides/',{'guides': grs, 'seperator': _SEPERATOR,'conflict':conflict});
			$(this).parent().find('.hidden').hide();
			$('#guide_mass_dialog').dialog('close');
		}
	);
	$('#guide_mass_dialog').dialog({ autoOpen: false, title: 'Guides mass edit', width: 300, buttons: {
		"Apply": function(){
		
			var dtype = $(this).find('input:radio:checked').val();
			var supplier = $(this).find('select').val();
			var sname = $(this).find('select option:selected').text();

			$('.ec-guide td.guide-day').each(function () {
				$(this).find('input:radio[value="'+dtype+'"]').attr('checked','checked');
				$(this).find('select option[value="'+supplier+'"]').attr('selected', 'selected');
				$(this).find('.ufd input').val(sname);
			});
			guides_avail_check();
			$(this).dialog('close');
		},
		"Close": function(){$(this).dialog('close');},
	}});
	
	//
	// Events : 
	// 
//	
	$('#events_btn').toggle(
		function (){eventsEditStart(); $(this).parent().find('.more').toggle();},
		function(){eventsEditStop(); $(this).parent().find('.more').toggle();}
	);


	$('.ec-guide td.guide-day select').change(function(){guides_avail_check();});

	$('#guides_avail_check').click(function(){
		guides_avail_check();
	});

	//
	// sites :
	//

	$('#sites_dialog').dialog({ autoOpen: false, title: 'Sites', width: 1000, height: 600, buttons: {
		"Save": function() {
			if (validForm($('#sites_form'))){
				Save('plan/sites/', form2JSON ($('#sites_form')),'#sites_dialog',function(selector){
					$(selector).dialog('close');
					Message ("Saved.");
					loadEvents(true);
				});
			}
		
		},
		"Cancel": function() { $(this).dialog('close'); },
		},
		open: function () {
			Message('Loading Sites...');
			$.get("plan/sites/", function (html) {
				$('#sites_dialog').html(html);			
				$('#sites_dialog .filter').selectFilter({'select': '#sites_dialog .source'});
				$('#sites_form tbody tr').formset({
					deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
					prefix: 'plannedsite_set',
					added: function (row) {
						var st = $('#sites_dialog .source').find('option:selected');
						var s = _Sites[st.val()];
						row.find('td:first').html(s.name);
						row.find('input[type="hidden"].prs').val(st.val());
						row.find('.special-price').val(s.sprice);					
						row.find('.scurrency').html(s.currency);					
						row.find('.quote-price').val(s.qprice);					
						row.find('input[type="checkbox"]').attr('checked', true);
						initIcons();
						initNumericInputs()
						$('#planned_sites tbody tr.hl').removeClass('hl');
						// remove empty line in case of extra=1
						empty = $('#planned_sites tbody tr.dynamic-form:first-child td:first-child');
						if (empty.html() == '') empty.parent().hide();
						$("#sites_dialog .dest").attr({ scrollTop: $("#sites_dialog .dest").attr("scrollHeight") });
						row.addClass('hl')
					}
				});
				$('#sites_dialog .controls .add').click(function() {$('#sites_dialog #sites_form .add-row').click();});
				$('#sites_dialog .source option').dblclick(function() {$('#sites_dialog #sites_form .add-row').click();});				
				initWidgets();
				initNumericInputs()
				Message('Sites Loading Finished.');
			});
		}
	});
	
	$('#sites_btn').button().click(function() {$('#sites_dialog').dialog('open');});

	function sortUL(selector) {
		$(selector).children("li").sort(function(a, b) {
			var upA = $(a).text().toUpperCase();
			var upB = $(b).text().toUpperCase();
		    return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
		}).appendTo(selector);
	}
	$('#event_edit_dialog').dialog({ autoOpen: false, title: 'Edit', width: 350, minHeight: 300, buttons: {
		"Save": function() {
			updateEvent(
				$(this).find('input[type="hidden"]').val(),
				sysDate($(this).find('.date-input').datepicker('getDate')),
				$(this).find('.hour-input').val(),
				$(this).find('textarea').val(), true
			);
			$(this).dialog('close');

			sortUL($('ul.scheduled'));
			/*
			$('ul.scheduled').each(function(){
//				$(this).css()
				$(this).children("li").sort(function(a, b) {
					var upA = $(a).text().toUpperCase();
					var upB = $(b).text().toUpperCase();
					return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
				}).appendTo($(this));
			});
			*/
		},
		"Cancel": function() {
			$(this).dialog('close');
			loadEvents(true);
		}
	}});




	//
	// Restaurants :
	//
	
	$('#restaurants_dialog').dialog({ autoOpen: false, title: 'Restaurants', width: 800, height: 600, buttons: {
		"Save": function() {
			if (validForm($('#restaurants_form'))){
				Save('plan/restaurants/', form2JSON ($('#restaurants_form')),'#restaurants_dialog',function(selector){
					$(selector).dialog('close');
					Message ("Saved.");
					loadEvents(true);
				});
			}
		},
		"Cancel": function() { $(this).dialog('close'); },
		},
		open: function () {
			Message('Loading Restaurants...');
			$.get("plan/restaurants/", function (html) {
				$('#restaurants_dialog').html(html);			
				$('#restaurants_dialog .filter').selectFilter({'select': '#restaurants_dialog .source'});
				$('#restaurants_form tbody tr').formset({
					deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
					prefix: 'plannedrestaurant_set', formCssClass:'restaurants-dynamic',
	//				formTemplate: '#formset_template',
					added: function (row) {
						var rest = $('#restaurants_dialog .source').find('option:selected');
                        var r = _Restaurants[rest.val()];
						row.find('td:first').html(r.name);
						row.find('input[type="hidden"].prs').val(rest.val());

						row.find('.special-price').val(r.sprice);
						row.find('.scurrency').html(r.currency);                                 
						row.find('.quote-price').val(r.qprice);                                 
						row.find('input[type="checkbox"]').attr('checked', true);
						initIcons();
						initNumericInputs()
						$('#planned_restaurants tbody tr.hl').removeClass('hl');
						// remove empty line in case of extra=1
						empty = $('#planned_restaurants tbody tr.restaurants-dynamic:first-child td:first-child');
						if (empty.html() == '') empty.parent().hide();
						$("#restaurants_dialog .dest").attr({ scrollTop: $("#restaurants_dialog .dest").attr("scrollHeight") });
						row.addClass('hl')
					}
				});
				$('#restaurants_dialog .controls .add').click(function() {$('#restaurants_dialog #restaurants_form .add-row').click();});
				$('#restaurants_dialog .source option').dblclick(function() {$('#restaurants_dialog #restaurants_form .add-row').click();});				
				initWidgets();
				initNumericInputs()
				Message('Restaurants Loading Finished.');
			});
		}
	});
	
	$('#restaurants_btn').button().click(function() {$('#restaurants_dialog').dialog('open');});


	//
	// Transportation :
	//
	
	$('#transportation_dialog').dialog({ autoOpen: false, title: 'Transportation', width: 1300, height: 600, buttons: {
		"Save": function() {
			if (validForm($('#transportation_form'))){
				Save('plan/transportation/', form2JSON ($('#transportation_form')) ,null,function(){
					loadEvents(true);
				});
				$(this).dialog('close');
				Message ("Saved.");
			}
		},
		"Cancel": function() {loadEvents(false); $(this).dialog('close'); },
		},
		open: function () {
			Message('Loading Transportation...');
			$.get("plan/transportation/", function (html) {
				
				$('#transportation_dialog').html(html)
				console.log('ttt')

				try{
				$('#transportation_form tbody tr').formset({
					addText: 'Add Transportation', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
					prefix: 'plannedtransportation_set', // causes serious bug. this is the {{formset.prefix}} value
					added: function () {initIcons();initDatePickers();},formCssClass:'transportation-dynamic', // cause another serious bug

				});
				} catch(err) {alert(err)}
				initIcons();initDatePickers(); initNumericInputs()
				Message('Transportation Loading Finished.');
				/*
				$('#others_pool table tr').click(function (){
						var item = $(this).attr('title').split(_SEPERATOR);
						var check = $('#others_form table tr.others-dynamic:last').find('input')[2].value;
						console.log($('#others_form table tr.others-dynamic:last').find('input')[2].value);
						if (check != '') $('#others_dialog a.e-btn-create').trigger('click');
						var newform = $('#others_form table tr.others-dynamic:last');
						newform.find('input')[2].value = item[0]; // description
						newform.find('input')[3].value = item[1]; // special price
						newform.find('input')[4].value = item[1]; // quote price
						newform.find('select')[0].selectedIndex = (item[2]=='True')?0:1; // type (is global)
						newform.find('input')[5].value = item[3]; // amount
						if (item[4]=='True') newform.find('input')[7].checked = true; // is daily
				});
				*/
			});
		}
	});
	$('#transportation_btn').button().click(function() {$('#transportation_dialog').dialog('open');});



	
	//
	// Others :
	//
	
	$('#others_dialog').dialog({ autoOpen: false, title: 'Other Services', width: 1000, height: 600, buttons: {
		"Save": function() {
			if (validForm($('#others_form'))){
				Save('plan/others/', form2JSON ($('#others_form')) ,null,function(){
					loadEvents(true);
				});
				$(this).dialog('close');
				Message ("Saved.");
			}
		},
		"Cancel": function() {loadEvents(false); $(this).dialog('close'); },
		},
		open: function () {
			Message('Loading Other Services...');
			$.get("plan/others/", function (html) {
				
				$('#others_dialog').html(html)
				try{
				$('#others_form tbody tr').formset({
					addText: 'Add Service', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
					prefix: 'plannedother_set', // causes serious bug. this is the {{formset.prefix}} value
					added: function () {initIcons();initDatePickers();},formCssClass:'others-dynamic', // cause another serious bug
				});
				} catch(err) {alert(err)}
				initIcons();initDatePickers(); initNumericInputs()
				Message('Other services Loading Finished.');
				$('#others_pool table tr').click(function (){
						var item = $(this).attr('title').split(_SEPERATOR);
						var check = $('#others_form table tr.others-dynamic:last').find('input')[2].value;
						console.log($('#others_form table tr.others-dynamic:last').find('input')[2].value);
						if (check != '') $('#others_dialog a.e-btn-create').trigger('click');
						var newform = $('#others_form table tr.others-dynamic:last');
						newform.find('input')[2].value = item[0]; // description
						newform.find('input')[3].value = item[1]; // special price
						newform.find('input')[4].value = item[1]; // quote price
						newform.find('select')[0].selectedIndex = (item[2]=='True')?0:1; // type (is global)
						newform.find('input')[5].value = item[3]; // amount
						if (item[4]=='True') newform.find('input')[7].checked = true; // is daily
				});
			});
		}
	});
	$('#others_btn').button().click(function() {$('#others_dialog').dialog('open');});

	//
	// Res & Vouchers check for the plannings : 
	// 
//	
	$('#rvcheck_btn').click(function(){
		Message('Checking Reservations and Vouchers...');
		$.get("plan/rvcheck/", function (json) {
			$('.event-norv, .event-voucher').remove();

			$('.ec-table .ec-events li').each(function(){
                 	        var id = $(this).attr('id').substr(1)
				var r = 0;
				var v=0;
                                var rs = '';
				$.each(json['abstracts'], function(key, p) {
                                        if (p['id'] == id) {r = p['r']; rs = p['rs']; v=p['v']; return true;}
                                });
                                prestr = '';
				//if (r == 2) prestr += "<span class='event-voucher event-error'>R</span>";
				if (v == 0) prestr += "<span class='event-norv'></span>";
				if (v == 1) prestr += "<span class='event-voucher'>V</span>";
				if (v == 2) prestr += "<span class='event-voucher event-error'>V</span>";
				prestr += "<span class='event-voucher'>R"+rs+"</span>";
                                $(this).html(prestr + $(this).html());
                        });
			setTimeout(function(){$('.event-norv, .event-voucher').remove()}, 5000);

			/*
			$('.ec-table .site, .ec-table .rest').each(function(){

				var id = $(this).attr('id').substr(1)
				var r = 0, v = 0;
				console.log(id)
				$.each(json['plans'], function(key, p) {
					if (p['pid'] == id) {
						r = p['r'];
						v = p['v'];
						return	true;
					}
				});
				prestr = "";
//				if (v == 0) prestr += "<span class='event-norv'></span>";
				if (v == 1) prestr += "<span class='event-voucher'>V</span>";
				if (v == 2) prestr += "<span class='event-voucher event-error'>V</span>";
//				if (r == 0) prestr += "<span class='event-norv'></span>";
				if (r == 1) prestr += "<span class='event-voucher'>R</span>";
				if (r == 2) prestr += "<span class='event-voucher event-error'>R</span>";

				$(this).html(prestr + $(this).html());
			});
			*/
		});
	});

	if ($('#file_form .form-error').html() != '') {$('#extended').toggle(); $('#basic_more').toggle();}

	$('.e-btn-print').click(function(){$("ul.#printmenu").toggle(); return false;});

	$('.more-info').hover(
		function(){
			if ($(this).data('pk')) {
				var i = $("<span>i</span>");
				i.addClass('more-info-i');
				url = "/"+$(this).data('type')+"/"+$(this).data('pk');
				i.data('url',url);
				$(this).append(i);
				i.click(function(){
					var dialog = $('#details_dialog');
					$.get($(this).data('url'), function(res) { dialog.html (res); dialog.dialog(); });
				});
			}
		},
		function(){$('.more-info-i').remove();}
	);

	$('#attachment_dialog').dialog({ autoOpen: false, modal:true, title: 'Attachment', width: 500, height:300, position: {my: "center", at: "center", of: window },
        buttons: {
        "Save": function() {
            if (validForm($('#attachment_form'))){
                Save('plan/attachment/'+$('#attachment_id').html(), form2JSON($('#attachment_form')), '#attachment_dialog .message',function(){
                  refresh();
                });
            }
        },
        "Cancel": function() { $(this).dialog('close');},
    }});

   $('#attachment_btn').click(function(){
        if ($('#attachment_menu').length > 0) $("ul#attachment_menu").toggle();
        else loadAttachment(0);
        return false;
    });
    $('#attachment_upload').click(function(){loadAttachment(0)});


});

function refresh(){
    window.location.reload( true );
}


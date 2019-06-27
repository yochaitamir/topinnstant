
$(document).ready(function() {
	$('#new_site_btn').click(function(){$('#new_res_dialog').data('type','site').dialog('open');});		
	$('#new_restaurant_btn').click(function(){$('#new_res_dialog').data('type','restaurant').dialog('open');});
	$('#new_bus_btn').click(function(){$('#new_res_dialog').data('type','buse').dialog('open');});
	$('#new_guide_btn').click(function(){$('#new_res_dialog').data('type','guide').dialog('open');});
	$('#new_hotel_btn').click(function(){$('#new_res_dialog').data('type','hotel').dialog('open');});
	$('#new_other_btn').click(function(){$('#new_res_dialog').data('type','other').dialog('open');});			
	$('#new_res_dialog').dialog({ autoOpen: false, title: 'New Reservation', width: 500,
		buttons: {
			"Create": function() {
			dialog = $(this);
			//alert('type is ------->' + $(this).data('type'));
			pid = dialog.find('select.list option:selected').val();
			$.post(dialog.data('type')+"s/create/", {'pid': pid}, function(json){
				if (json['success']) {
					Message ("Created.");
					$("<li>"+json['name']+"</li>").appendTo($('#'+dialog.data('type')+'s_res_list'));
					dialog.dialog('close');
				}
				else Message("Error creating reservation.");
			});
			},
			"Cancel": function() {$(this).dialog('close');},
		},
		open: function(event, ui) {
			var dialog = $(this);
			$.ajax({
				url: $(this).data('type')+'s/',
				beforeSend: function() { dialog.find('.loading').show(); dialog.find('.content').hide();},
				complete: function() {
					dialog.find('.loading').hide();
					dialog.find('.content').show();
				},
				success: function (json){
					if (json['success']){
						var list = dialog.find('.content select.list');
						list.empty();
						for(var i=0; i<json['list'].length; i++){
							var r = json['list'][i];
							var option = $("<option value='"+r[1]+"'>"+r[0]+"</option>");
							option.appendTo(list);
						}
					}
					else Message('Error loading planned sites');
				}
			});
		}
	});
});




/*
$(document).ready(function() {
	$('#new_site_btn').click(function(){$('#new_site_dialog').dialog('open');});
	$('#new_site_dialog').dialog({ autoOpen: false, title: 'New Site Reservation', width: 500,
		buttons: {
			"Create": function() {
			dialog = $(this);
			psid = dialog.find('select.list option:selected').val();
			$.post("sites/create/", {'psid': psid}, function(json){
				if (json['success']) {
					Message ("Created.");
					$("<li>"+json['name']+"</li>").appendTo($('#sites_res_list'));
					dialog.dialog('close');
				}
				else Message("Error creating reservation.");
				});
			},
			"Cancel": function() {$(this).dialog('close');},
		},
		open: function(event, ui) {
			var dialog = $(this);
			$.ajax({
				url: "sites/",
				beforeSend: function() { dialog.find('.loading').show(); dialog.find('.content').hide();},
				complete: function() {
					dialog.find('.loading').hide();
					dialog.find('.content').show();
				},
				success: function (json){
					if (json['success']){
						var list = dialog.find('.content select.list');
						list.empty();
						for(var i=0; i<json['sites'].length; i++){
							var r = json['sites'][i];
							var option = $("<option value='"+r[1]+"'>"+r[0]+"</option>");
							option.appendTo(list);
						}
					}
					else Message('Error loading planned sites');
				}
			});
		}
	});
});

*/


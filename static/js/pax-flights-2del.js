var _WARN = false;

$(window).bind('beforeunload', function(e) {
	if(_WARN) {
		return 'sure?';
	}
});

function pax_list(id){
	var list = [];
	$('#'+id+' ul li').each(function(){
		list.push($(this).attr('value'));
	});
	return list;
}
function flights_pax(id){
	var list = [];
	$('#'+id+' .flight').each(function(){
		f = {};
		f['id'] = $(this).attr('id').substr(2);
		f['pax'] = pax_list($(this).attr('id'));
		list.push(f)
	});
	return list;
}

// $(function() {
// 	$( "#arrivals li" ).draggable({containment: "#arrivals",  appendTo: "ul",'revert':'invalid' });
// 	$( "#departures li" ).draggable({containment: "#departures",  appendTo: "ul",'revert':'invalid' });
// 	$('.cube-list').droppable({hoverClass: 'drop-active', accept: 'li',
// 		drop: function (event, ui) {
// 			var item = $(ui.draggable);
// 			item.appendTo($(this).find('ul'));
// 			item.css({'top':0, 'left': '0'});
// 			count_list_items();
// 		}
// 	});
// 	count_list_items();
// });

$(document).ready(function() {
	selectableDraggable($("#arrivals ul"), $("#arrivals .cube-list"));
	selectableDraggable($("#departures ul"), $("#departures .cube-list"));

	$('#pax_flights_save').click(function (){
		_WARN = false;
		btntxt = $(this).find('.ui-button-text');
		btntxt.html('Saving...');
		data = {
			'apax': pax_list('pax_a'),
			'aflights': flights_pax('flights_a'),
			'dpax': pax_list('pax_d'),
			'dflights': flights_pax('flights_d'),
		}
		data = $.toJSON(data);
		$.post('save/',data, function(res) {
			btntxt.html('Save');
			if (res['success'] == true ) timedMessage('#save_msg', 'Saved !');
			else timedMessage('#save_msg', 'An Error Occurred. Please try again later.');
		});
	});

	count_list_items();
});

// function count_list_items(){
// 	$('.cube-list').each(function(){
// 		var count = $(this).find('ul li').length;
// 		if($(this).find('.size').length == 0) {
// 			size = $("<div></div>");
// 			size.addClass('size');
// 			$(this).find('h2').append(size);
// 		}
// 		$(this).find('h2 .size').html(count);
// 	});
// }

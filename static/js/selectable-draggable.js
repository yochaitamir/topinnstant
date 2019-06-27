function count_list_items(){
	$('.cube-list').each(function(){
		var count = $(this).find('ul li').length;
		if($(this).find('.size').length == 0) {
			size = $("<div></div>");
			size.addClass('size');
			$(this).find('h2').append(size);
		}
		$(this).find('h2 .size').html(count);
	});
}

function selectableDraggable(from, dropto, callback){

	callback = callback || function(event) {};

	from.find('li').draggable({
		appendTo: "ul", 'revert':'invalid',
		start: function(ev, ui) {
			$(".ui-selected").each(function() {
				var el = $(this);
				el.data("offset", el.offset());
			});
			callback('started');
		},
		drag: function(ev, ui) {
			var base = $(this).data("offset"),
				dynamic = $(this).offset();
			$(".ui-selected").not(this).each(function() {
				var el = $(this), pos = el.data("offset");
				// css use relative positioning!
				el.css({top: dynamic.top - base.top, left: dynamic.left - base.left});
			});
		},
		stop: function(ev, ui) {
			$(".ui-selected").each(function() {
				$(this).removeAttr("style");
			});
			callback('stopped');
		}
	});

	from.selectable();

	from.find('li').click( function(e){
		// if (e.metaKey == true) {
		if (e.ctrlKey == true) {
			$(this).toggleClass("ui-selected");
		} else {
			from.find('li').each(function() {
				if ($(this).hasClass("ui-selected")) $(this).removeClass("ui-selected");
			});
		}
 	});

	dropto.droppable({hoverClass: 'drop-active',
		accept: function(d) {
			if (dropto.find(d).length) return true;
		},
		drop: function (event, ui) {
			var cont = $(this).find('ul');
			if ($(".ui-selected").length == 0) 	ui.draggable.appendTo(cont).removeAttr("style");
			else $(".ui-selected").each(function(){$(this).appendTo(cont).removeClass().removeAttr("style");});
			count_list_items();
			callback('droped');
		}
	});
}

/*

function flights_pax(id){
	var list = [];
	$('#'+id+' .flight').each(function(){
		fl = {};
		fl['id'] = $(this).attr('id').substr(2);
		fl['pax'] = pax_list($(this).attr('id'));
		list.push(fl)
	});
	return list;
}
	
$(function() {
	$( "#arrivals li" ).draggable({containment: "#arrivals",  appendTo: "ul",'revert':'invalid' });
	$( "#departures li" ).draggable({containment: "#departures",  appendTo: "ul",'revert':'invalid' });

	$('.cube-list').droppable({hoverClass: 'drop-active', accept: 'li',
		drop: function (event, ui) {
			var item = $(ui.draggable);
			item.appendTo($(this).find('ul'));
			item.css({'top':0, 'left': '0'});
			count_list_items();
		}
	});
	count_list_items();
	$('#pax_flights_save').click(function (){
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
});

*/

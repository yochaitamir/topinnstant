
function placeEvent(e,type){
	var t = 'p';
	if (type == "other") t = 'o';
	if (type == "transportation") t = 't';
	if (e['date'] != 'None' && inDates(new Date(e['date'])) ){
		if (e['hour'] != 'None') $('#d_'+e['date']).find('ul.scheduled').append("<li id='"+t+e['id']+"' class='"+type+"'><strong>"+e['hour']+"</strong> "+e['name']+"</li>");
		else $('#d_'+e['date']).find('ul.unscheduled').append("<li id='"+t+e['id']+"' class='"+type+"'>"+e['name']+"</li>");
	}
	else {
		var cls = type;
		if (type == "other" && e['everyday']) cls += " everyday";
		$('#pool').append($("<span id='"+t+e['id']+"' class='"+cls+"'>"+e['name']+"</span>"));
	}
}

function loadEvents (editModeOn){
	Message('Loading Events...');
	$.get("plan/", function (json) {
		if(json['success']) {
			$('#pool').empty();
			$('ul.unscheduled').empty();
			$('ul.scheduled').empty();
			$.each(json['sites'], function(key, ev) {placeEvent(ev,"site");});
			$.each(json['rests'], function(key, ev) {placeEvent(ev,"rest");});
			$.each(json['transportation'], function(key, ev) {placeEvent(ev,"transportation")});
			$.each(json['others'], function(key, ev) {placeEvent(ev,"other")});
			Message('Loading Finished.');
			$('ul.scheduled').parent().show();
			$('ul.unscheduled').parent().show();
//			$('ul.scheduled:empty').parent().hide();
//			$('ul.unscheduled:empty').parent().hide();
		}
		else Message('Error Loading Sites.');
		if (editModeOn) eventsEditStart(); 
	});
}

function editEvent(obj, odate){
	$('#event_edit_dialog').dialog('open');
	$('#event_edit_dialog .date-input').datepicker( "hide" );
	$('#event_edit_dialog .hour-input').focus();
	var id = obj.attr('id').substr(1);
	$('#event_edit_dialog h2').html(obj.html());
	$('#event_edit_dialog input[type="hidden"]').val(obj.attr('id'));
	Message("Loading...");
	$.get("plan/"+id+"/", function (json) {
		if(json['success']) {
			Message('Loading Finished.');
			if (!odate) {
				// no requested date, there for load original event date:
				if (json['date'] != '') $('#event_edit_dialog .date-input').datepicker("setDate", new Date(json['date']));
				else $('#event_edit_dialog .date-input').datepicker("setDate",null);
			}
			else $('#event_edit_dialog .date-input').datepicker("setDate", new Date(odate));
//			alert(json['hour'])
			if (json['hour'] != "None") $('#event_edit_dialog .hour').val(json['hour']);
			else $('#event_edit_dialog .hour').val('');
//			alert($('#event_edit_dialog textarea').length)
			$('#event_edit_dialog textarea').val(json['notes']);
		}
		else Message('Error Loading.');
	});
}

function updateEvent(pid, d, h,notes,reload){
	var t = '';
	if (pid[0] === 'o') t = 'other';
	pid = pid.substr(1);
	Save('plan/update/', {'pid': pid, 'type': t, 'date': d, 'hour': h,'notes':notes,},null,function(){
		if (reload) loadEvents(true);
	});
}

function eventsEditStart() {
	$('.ec-events').removeClass('ec-events-view');
	$('ul.scheduled').parent().show();
	$('ul.unscheduled').parent().show();
	$('#pool span').not('.everyday').each(function () {
		$(this).draggable({snap: '.ec-day', opacity: 0.5, cursor: 'move', revert: 'invalid', zIndex: 1000});
		$(this).dblclick(function() {editEvent($(this));});
	});
	$('.ec-day ul li').each(function () {
		$(this).draggable({snap: '#pool, .ec-day', opacity: 0.9, cursor: 'move', revert: 'invalid', zIndex: 1000});
		$(this).dblclick(function() {editEvent($(this));});
	});
	$('.ec-events-unscheduled').droppable({hoverClass: 'ec-day-active', accept: 'li,span',
		drop: function (event, ui) {
			var item = ui.draggable.html();
			var type = ui.draggable.attr('id').split('-')[0];
			item = item.replace(/^\<strong>\b[^>]*>(.*?)|\/strong>+$/g, '')
			var li = $("<li id='"+ui.draggable.attr('id')+"'>"+item+"</li>");
			li.attr('class',ui.draggable.attr('class'))
			li.dblclick(function() {editEvent($(this));});
			li.appendTo($(this).find('ul.unscheduled'));
			li.draggable({snap: '#pool', opacity: 0.9, cursor: 'move', revert: 'invalid', zIndex: 1000});
			ui.draggable.remove();
			updateEvent (ui.draggable.attr('id'), $(this).parent().attr('title'), '',null, false);
		}
	});
	$('.ec-events-scheduled').droppable({hoverClass: 'ec-day-active', accept: 'li,span',
		drop: function (event, ui) {
			var item = ui.draggable;
//			item.appendTo($('#pool'));
//			ui.draggable.remove();
			editEvent(item,$(this).parent().attr('title'));
		}
	});
	$('#pool').droppable({hoverClass: 'ec-day-active', accept: 'li',
		drop: function (event, ui) {
			var item = ui.draggable.html();
			var type = ui.draggable.attr('id').split('-')[0];
			item = item.replace(/^\<strong>\b[^>]*>(.*?)|\/strong>+$/g, '')
			var span = $("<span id='"+ui.draggable.attr('id')+"'>"+item+"</span>");
			span.attr('class',ui.draggable.attr('class'))
			span.dblclick(function() {editEvent($(this));});
			span.appendTo($('#pool'));
			span.draggable({snap: '.ec-day', opacity: 0.5, cursor: 'move', revert: 'invalid', zIndex: 1000});
			ui.draggable.remove();
			updateEvent (ui.draggable.attr('id'), 'pool', '', null, false);
		}
	});
}

function eventsEditStop() {
	$('.ec-events').addClass('ec-events-view');
//	$('ul.scheduled:empty').parent().hide();
//	$('ul.unscheduled:empty').parent().hide();
	Message('Edit finished.');
}


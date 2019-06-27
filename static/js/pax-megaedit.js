
function pax_list(id){
	var list = [];
	$('#'+id+' ul li').each(function(){
		list.push($(this).attr('value'));
	});
	return list;
}
function subs_pax(id){
	var list = [];
	$('#'+id+' .file').each(function(){
		f = {};
		f['id'] = $(this).attr('id').substr(1);
		f['pax'] = pax_list($(this).attr('id'));
		list.push(f)
	});
	return list;
}

$(document).ready(function() {
	selectableDraggable($('#mega_edit ul'),$('.cube-list'));

	$('#pax_mega_save').click(function (){
		btntxt = $(this).find('.ui-button-text');
		btntxt.html('Saving...');

		data = {
			'megapax': pax_list('pool'),
			'subspax': subs_pax('files'),
		}
		data = $.toJSON(data);
		$.post('save/',data, function(res) {
			btntxt.html('Save');
			if (res['success'] == true ) timedMessage('#save_msg', 'Saved !');
			else timedMessage('#save_msg', 'An Error Occurred. Please try again later.');
		});
	
	});
});


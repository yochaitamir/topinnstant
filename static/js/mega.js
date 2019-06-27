$(document).ready(function(){
	$('#mega_list tbody tr').formset({
		addText: 'Add group', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
		prefix: 'form',
		added: function (row) {
			row.find('.date-input').first().val($('#id_form-0-from_date').val());
			row.find('.date-input').last().val($('#id_form-0-to_date').val());
			initIcons(); initDatePickers();
		}
	});
	$('#reparent_link').click(function(){
		window.location = "/file/"+$(this).data('fn')+'/mega/reparent/'+$('#id_file').val();
	});

});


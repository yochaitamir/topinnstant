
$(document).ready(function() {
	$('#pax_formset tbody tr').formset({
		addText: 'Add Pax Group', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
		prefix: 'quotepax_set',
		added: function (row) {initIcons(); row.find('input[type="text"], input[type="number"]').val(0);}
	});

	$('#frees_qc_btn').click(function(){
		var n = $('#frees_qc_num').val();
		if ($('#frees_qc_kind').val() == 'c') $('#pax_formset input[id$="frees"]').each(function(){$(this).val(n)});
		else {
			$('#pax_formset tr').each(function(){
				var pn = $(this).find('input[id$="pax_num"]').val()
				frees = Math.floor((pn!= 0)?pn/n:0);
				$(this).find('input[id$="frees"]').val(frees)
			})
		}
	});
});


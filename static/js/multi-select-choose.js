

function option2tr(row){
	var name = row.html();
	var price = row.attr('label');
	newtr = "<td>"+name+"</td>";
	newtr += "<td><input type='text' readonly='readonly' size='3' maxlength='3' value='"+price+"' /></td>";
	newtr += "<td><input type='text' class='required pfloat special-price' size='3' maxlength='3' value='"+price+"' /></td>";
	newtr += "<td><input type='text' class='required pfloat quote-price' size='3' maxlength='3' value='"+price+"' /></td>";	
	row.parents('.multi-select-choose').find('.dest').append($("<tr>"+newtr+"</tr>"));
}

$(document).ready(function() {

	$('.multi-select-choose .controls .add').button ({icons: {primary: 'ui-icon-circle-arrow-e'}}).click(function() {
		option2tr($(this).parents('.multi-select-choose').find('.source option:selected'));
	})
	$('.multi-select-choose .source option').dblclick(function() {
		option2tr($(this).parent().find('option:selected'));
		return  false;
	});



	$('.multi-select-choose1 .controls .add').button ({icons: {primary: 'ui-icon-circle-arrow-e'}}).click(function() {
		$(this).parents('.multi-select-choose1').find('.source option:selected').clone().appendTo($(this).parents('.multi-select-choose1').find('.dest'));
	})
	$('.multi-select-choose1 .source option').dblclick(function() {
		return !$($(this).parent().find('option:selected').clone().appendTo($(this).parents('.multi-select-choose1').find('.dest')));
	});
	$('.multi-select-choose1 .controls .remove').button ({icons: {primary: 'ui-icon-circle-arrow-w'}}).click(function() {
		return !$('.multi-select-choose1 .dest option:selected').remove();
	})
});





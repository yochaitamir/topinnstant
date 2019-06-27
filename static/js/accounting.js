
jQuery.fn.receiptPaymentMethod = function() {
	var val = $(this).val();
	$('#receipt_payment_method span').hide();
	switch (val) {
		case 'ca': break;
		case 'bt':
			$('#receipt_payment_method #bank').show();
			$('#receipt_payment_method #cheque_date').show();
			$('#receipt_payment_method #deposit_date').show();
			break;
		case 'ch':
			$('#receipt_payment_method #cheque_date').show();
			$('#receipt_payment_method #cheque_num').show();
			break;
		case 'cr':
			$('#receipt_payment_method #credit_card').show();
			$('#receipt_payment_method #credit_4digits').show();
			break;
		case 'tc':
			$('#receipt_payment_method #bank').show();
			$('#receipt_payment_method #cheque_date').show();
			$('#receipt_payment_method #cheque_num').show();
			break;
	}
};

function updateGrandTotal(){
	var gt = 0;
	$('.total:visible').each(function(){
		gt += 1*$(this).val();
	})
	$('#grandtotal').val(gt);
}

function initRows() {
	$('.amount, .price').keyup(function() {
		var total = $(this).parent().parent().find('.amount').val() * $(this).parent().parent().find('.price').val();
		$(this).parent().parent().find('.total').val(total);
		updateGrandTotal();
	});
}
$(document).ready(function() {
	if ($('#id_payment_method').length > 0) {
		$('#id_payment_method').receiptPaymentMethod();
		$('#id_payment_method').change(function(){
			$(this).receiptPaymentMethod();
		});
	}
	if ($('#invoice_formset').length > 0) {
		$('#invoice_formset tbody tr').formset({
			addText: 'Add Row', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
			prefix: 'invoicerow_set',
			added: function () {initIcons();initRows();},
			removed: function (row) {
				$('.amount').first().keyup();
			}
		});
		initRows();		
	}
	if ($('#copy_p').length > 0 ) {
		$('#copy_p').click(function(){
			var pid = $('#proforma').val();
			$.get('../../proforma/copy/'+pid,function (res) {
				if (res['success'] == true){
					for (var i=0; i<res['rows'].length; i++){
						r = res['rows'][i];
						$('table.formset .e-btn-create').click();
						var lastrow = $('table.formset tr.dynamic-form:last');
						lastrow.find('td:first input').val(r[0]);
						lastrow.find('td:nth-child(2) input').val(r[1]);
						lastrow.find('td:nth-child(3) input').val(r[2]);
						lastrow.find('.amount').keyup();
					}
				}
				else Message('An error accoured');
			});
		});

	}
	if ($('#proforma_formset').length > 0) {
		$('#proforma_formset tbody tr').formset({
			addText: 'Add Row', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
			prefix: 'proformainvoicerow_set',
			added: function () {initIcons();initRows();},
			removed: function (row) {
				$('.amount').first().keyup();
			}
		});
		initRows();
	}	
	if ($('#set_reduction').length > 0) {
		$('#set_reduction').click(function(){
			$('form table select').val(0);
		});
	};
	updateGrandTotal();
});


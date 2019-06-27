
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

	if ( $('input#id_date').length >0) $.datepicker.setDefaults({minDate: $('#id_adate').datepicker('getDate'), maxDate: $('#id_ddate').datepicker('getDate')});

	if ($('#gvoucher_formset').length > 0) {
        $('#gvoucher_formset tbody tr').formset({
            addText: 'Add Row', addCssClass: 'e-btn-create', deleteText: 'Delete', deleteCssClass: 'e-btn-delete-short',
            prefix: 'proformainvoicerow_set',
            added: function () {initIcons();initRows();},
            removed: function (row) {
                $('.amount').first().keyup();
            }
        });
        initRows();
    }
    updateGrandTotal();
		
});



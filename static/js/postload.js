
/* include scripts to run after page load: improve widgets */

function initWidgets () {
	$('button:not(.icon-btn)').button();
	$('a.button').button();
}

function initComboBoxes(){
	$('select.combobox').attr('autocomplete','off');
	$('select.combobox').ufd({'zIndexPopup': 3000, 'addEmphasis': true,'moveAttrs': ["autocomplete"]});
}
//	obj.datepicker ({showButtonPanel: true, autoSize: true, dateFormat: 'dd/mm/yy'});}

function initDatePickers(obj) {
	if (!obj) {
		$('.date-input').datepicker({
			onSelect: function (){ this.focus();},
			onClose: function (){ this.focus();}
		});
		//.inputmask("d/m/99");
		$('.hour-input').timeEntry({show24Hours: true, noSeparatorEntry: true,how24Hours: true, spinnerImage: '/static/timeentry/spinnerDefault.png'});
//	handle: '#trigger-test'
//			convention: 12 });
//		});
//		$('.hour-input').inputmask("datetime12");
//		$('.hour-input').inputmask("99:99");
		//0[1-9]|1[012]
	}
	else obj.find('.date-input').datepicker({
		onClose: function() {$(this).trigger('blur');}
	});	
}

function initNumericInputs(){
	$('.pfloat').change(function(el){
		$(this).val($(this).val().replace(',','.'))
	});
}

function initIcons (obj) {
	feather.replace();

	if (!obj) obj = $('body').first();
	obj.find('.e-btn-accounting').button ({icons: {primary: 'ui-icon-note'}});
	obj.find('.e-btn-add').button({icons: {primary: 'ui-icon-plusthick'}});
	obj.find('.e-btn-attachment').button ({icons: {primary: 'ui-icon-arrowreturnthick-1-n'}});
	obj.find('.e-btn-create').button ({icons: {primary: 'ui-icon-plusthick'}});
	obj.find('.e-btn-cancel').button ({icons: {primary: 'ui-icon-trash'}}); /* Added: 25.5.2014 */
	obj.find('.e-btn-clean').button ({icons: {primary: 'ui-icon-trash'}});
	obj.find('.e-btn-delete').button ({icons: {primary: 'ui-icon-trash'}});
	obj.find('.e-btn-delete-short').button ({icons: {primary: 'ui-icon-trash'}, text: false});
	obj.find('.e-btn-edit').button ({icons: {primary: 'ui-icon-pencil'}});
	obj.find('.e-btn-gear').button ({icons: {primary: 'ui-icon-gear'}});
	obj.find('.e-btn-history').button ({icons: {primary: 'ui-icon-note'}}); /* Added: 25.5.2014 */
	obj.find('.e-btn-image').button ({icons: {primary: 'ui-icon-image'}});
	obj.find('.e-btn-itinerary').button ({icons: {primary: 'ui-icon-bookmark'}});
	obj.find('.e-btn-list').button ({icons: {primary: 'ui-icon-note'}});
	obj.find('.e-btn-note').button ({icons: {primary: 'ui-icon-note'}});
	obj.find('.e-btn-people').button ({icons: {primary: 'ui-icon-person'}});
	obj.find('.e-btn-print').button ({icons: {primary: 'ui-icon-print'}});
	obj.find('.e-btn-publish').button ({icons: {primary: 'ui-icon-print'}});
	obj.find('.e-btn-save').button ({icons: {primary: 'ui-icon-disk'}});
	obj.find('.e-btn-star').button ({icons: {primary: 'ui-icon-star'}});
	obj.find('.e-btn-tag').button ({icons: {primary: 'ui-icon-tag'}});
	obj.find('.e-btn-transfer').button ({icons: {primary: 'ui-icon-transferthick-e-w'}});
	obj.find('.e-btn-update').button ({icons: {primary: 'ui-icon-refresh'}});
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}


$(document).ready(function() {
//	$('.date-input').datepicker ({showButtonPanel: true, autoSize: true, dateFormat: 'yy-mm-dd'});
	initWidgets();
	initDatePickers();
	initIcons();
	initComboBoxes();
	initNumericInputs();
	
	if (typeof _minDate !== 'undefined') $.datepicker.setDefaults({minDate: _minDate});
	if (typeof _maxDate !== 'undefined') $.datepicker.setDefaults({maxDate: _maxDate});

	$('.open-date').datepicker("option","minDate",null);
	$('.open-date').datepicker("option","maxDate",null);
	$('form.valid-required').submit( function (){
			return validForm($(this));
	});
	$('form').attr('autocomplete','off'); // disable auto complete all over the system
//	$('textarea.autosize').autosize();
	// added 02.12.18:
	autosize($('textarea.autosize'));

	$('.checkall').click(function(){
		$(this).closest('table').find(':checkbox').attr('checked', true);
		$(this).parent().parent().find(':checkbox').attr('checked', true);
	});
	$('.uncheckall').click(function(){
		$(this).closest('table').find(':checkbox').attr('checked', false);
		$(this).parent().parent().find(':checkbox').attr('checked', false);
	});

	$('a.confirm, button.confirm').click(function(){
		return Confirm('Are You sure ?');
	});

    	$('dl.fold').each(function(){
            $(this).find('dt').click(function(e){
                    $(this).nextUntil('dt').toggle();
            });
            $(this).find('dd').hide();
	});

	$('table.export').each(function(){
		var btn = $("<button></button>");
		var tbl = $(this);
		btn.attr('title','CSV export (Excel)');
		btn.addClass('table-csv-export-btn');
		btn.click(function() {
			var csv = [];
			tbl.find("tr").each(function(){
				var row = [], cols = $(this).get(0).querySelectorAll("td, th");
				for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
				csv.push(row.join(",")); 
			});
			downloadCSV(csv.join("\n"), "table.csv");
		});
		btn.appendTo($(this))
	});

	$('.saved-msg').delay(5000).fadeOut('slow');

	$('.error-box, .notification').each(function(){
		btn = $("<button class='icon-btn close-btn'>×</button>");
		//btn.click(function(){$(this).parent().fadeOut()});
		btn.click(function(){$(this).parent().slideUp()});
		$(this).append(btn)
	});



});



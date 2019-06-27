
var numPattern = /[0-9.]+/;			

$(document).ready(function() {
	$(".sum-table > tbody").selectable({
		filter: "tr",
		cancel: "a",
		stop: function(event, ui){
			var table = $(this).parent(), sum = [];
			for (var i = 0; i < table.find("thead > tr > th").length; i++) sum.push(0);
			table.find("tbody > tr.ui-selected").each(function() {
				var row = $(this);
				row.find("td").each(function(i) {
					var value = $(this).text().replace(',', '');
					value = numPattern.exec(value)
					if (value != null) {
						sum[i] += parseFloat(value);
					}
				});
				table.find("tfoot > tr > td").each(function(i) {
					if ($(this).find('span.sum').length > 0) $(this).find('span.sum').html(sum[i].toFixed(2));
				});
			});
		}
	});

});

var _WARN = false;

$(window).bind("beforeunload", function(e) {
	if(_WARN) {
		return "sure?";
	}
});

$(document).ready(function() {
	$("input.required").each(function(el) {
		// values replaced because some js script remove the initial :00
		// therefore triggering change
		var original_value = $(this).val().replace(":00", "");
		$(this).change(function() {
			if (original_value != $(this).val()) {
				_WARN = true;
			}
		});
	});
	$("#save").click(function() {
		_WARN = false;
	});
});
$(document).ready(function() {
	$(".daily-notes").click(function() {
		var that = $(this);
		$("#daily-notes-dialog").dialog({autoOpen: false, title: 'Notes', buttons: {
			"Save": function() {
				var dialog = $(this);
				$.ajax({
					url: "plan/daily_notes/" + that.attr("date") + "/",
					type: "POST",
					data: {text: dialog.val()},
					dataType : "json",
					success: function(json) {
						$("#daily-notes-dialog").dialog('close');
					},
				});
			},
			"Cancel": function() { $(this).dialog('close'); },
			"Delete": function() {
				$.ajax({
					url: "plan/daily_notes/" + that.attr("date") + "/",
					type: "POST",
					data: {delete: true},
					dataType : "json",
					success: function(json) {
						$("#daily-notes-dialog").dialog('close');
					},
				});
		}}});

		$.ajax({
			url: "plan/daily_notes/" + $(this).attr("date") + "/",
			type: "GET",
			dataType : "json",
			success: function(json) {
				var dialog = $("#daily-notes-dialog");
				dialog.dialog("open");
				dialog.val(json.text);
			},
		});
	});
});
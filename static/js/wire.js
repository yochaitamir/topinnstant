

$(document).ready(function() {
	/*
	$('.date-input').blur(function(){
		alert('hi');
	});
	*/
	
	$('.date-input').datepicker({
		onClose: function(dateText, inst) {
			$.post('../get/hotel/',{'from':'2011-01-01', 'till':'2012-12-31'}, function(json){
				if (json['success']) {
					var hotels = json['hotels'];
					$('#hotel').empty();
					for (var i=0; i<hotels.length; i++) {
						$('#hotel').append($("<option value='"+hotels[i]['id']+"'>"+hotels[i]['s']+'</option>'));					
					}
				}				
				else {Message("Error fetching hotels.");}
			});
		}
	});
});


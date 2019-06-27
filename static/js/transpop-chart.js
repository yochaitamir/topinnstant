
var _FILES = []

function rand_color(){
	var r = Math.round(150+Math.random()*100);
	var b = Math.round(150+Math.random()*100);
	var g = Math.round(150+Math.random()*100);
	return "rgb("+r+","+g+","+b+")";
}

function draw_file(f, adatetd, ddatetd, key){
	var obj = $("<div></div>");
	obj.addClass('file-div');
	obj.attr('data-fn', f['fn']);
	var a = $("<a></a>");
	a.html(f['title']);
	a.attr('title', "Operator: "+f['operator']+"\nPax: "+f['pax']);
	a.attr('href', f['url']);
	a.attr('target', '_blank');
	obj.append(a);

	var base_height = 15;
	//var top_offset = Math.round(adatetd.offset().top+key*base_height);
	//var top_offset = Math.round(key*base_height);
	var top_offset = key*base_height;
	adatetd.parent().find('td:first-child').css({'height':(top_offset+base_height)+'px'});
	//obj.offset({ top: top_offset, left: Math.round(adatetd.offset().left)})
	obj.offset({ top: top_offset, left: 0});
	
	if (typeof(_FILES[f['fn']]) == 'undefined') _FILES[f['fn']] = rand_color();
	
	try {
		width = ddatetd.offset().left+ddatetd.width()-adatetd.offset().left+2+'px';
		obj.css({'width':width,'height':base_height+'px', 'background':_FILES[f['fn']]});
		adatetd.append(obj);
	} catch (e) {console.log('dates overflow');}
}

$(document).ready(function() {
    Message('Loading information...');
	if ($('#transpop_chart').length > 0) {
		console.log(new Date().toJSON().slice(14,-1) +' ajax fired')
	    $.get("chart/", function (json) {
		    if(json['success']) {
				console.log(new Date().toJSON().slice(14,-1) +' ajax success')
				$.each(json['rows'], function(key, v) {
					tr = $('#vehicle'+v['rid']+'_details');
					$.each(v['rfiles'], function(key, f){

						adatetd = tr.find('td[data-date="'+f.file['adate']+'"]');
						ddatetd = tr.find('td[data-date="'+f.file['ddate']+'"]');
						//adatetd.html("<<"); ddatetd.html(">>");

						draw_file(f.file, adatetd, ddatetd, key);
					});
					tr = $('#vehicle'+v['rid']+'_sum');
					trtds = tr.find('td');
					for(var i=0; i<v['rdays'].length; i++){
						td = trtds.eq(i);
						day = v['rdays'][i];
						if (day[3]) td.addClass('requested');
						if (day[0] == 0) td.addClass('freeday');
						else {
							if (day[0] == 1) {
								// event
								td.addClass('event');
								td.data('info', day[1])
							}
							else {
								if (Array.isArray(day[0])){
									// overlapping
									if (day[3]) td.addClass('olhours')
									else td.addClass('overlap');
									//td.attr('title','Overlapping: '+day);
									td.data('fn', day[0]);
								}
								else {
									// single file
									td.addClass('day blankbg');
									td.data('fn', day[0]);
									td.data('driver', day[2]);
									td.css({'background':_FILES[day[0]]});
									//td.attr('title', '@@@'+_FILES[day[0]]);
									if (day[2]) td.html('<strong>'+day[1]+'</strong>');
									else td.html(day[1]);
								}
							}
						}
					}
				});
	
				$.each(json['warnings'], function(key, v) {
					$('#warnings').append($("<li>"+v+"</li>"));
				});
				//for(var i=0; i<v['warnings'].length; i++)
				$('td.overlap, td.olhours').hover(
					function(){
						var tos = $(this).offset();
						$('#baloon').css({'top':tos.top-100+'px', 'left':tos.left-30+'px'}).show().addClass('overlap');
						
						var balht = '<strong>Overlap</strong>';
						$.each($(this).data('fn'), function(k,fn){
							$('.file-div[data-fn="'+fn+'"]').addClass('hl');
							balht += "<br/>#"+fn;
						});
						$('#baloon').html(balht);
					},
					function(){
						$('#baloon').hide().html('').removeClass('overlap');
						$('.file-div.hl').removeClass('hl');
					}
				);
				$('td.day').hover(
					function(){
						var tos = $(this).offset();
						$('#baloon').css({'top':tos.top-100+'px', 'left':tos.left-30+'px'}).html('<br/>#'+$(this).data('fn')+'<br/>'+$(this).data('driver')).show();
						$('.file-div[data-fn="'+$(this).data('fn')+'"]').addClass('hl');
					},
					function(){
						$('#baloon').hide().html('');
						$('.file-div.hl').removeClass('hl');
					}
				);
				$('td.event').hover(
					function(){
						var tos = $(this).offset();
						$('#tooltip').css({'top':tos.top-170+'px', 'left':tos.left-150+'px'}).html('<br/>'+$(this).data('info')).show();
					},
					function(){$('#tooltip').hide().html('');}
				);

				$('#chart_closeall').click();
				Message('Loading Finished.');
				$('#loading').hide();
			}
	        else Message('Error loading chart information.');
	
			console.log(new Date().toJSON().slice(14,-1) +' ajax completed')
		});
	
		$('#transpop_chart tr.vsum th').click(function(){
			var vid = $(this).attr('id');
			$('#'+vid+'_details td').toggle();
			$(this).parent().toggleClass('closed');
		});
		$('#chart_fcolors_btn').click(function(){
			if ($(this).hasClass('on')) {
				$(this).removeClass('on')
				$('td.day').addClass('blankbg');
				$(this).find('.ui-button-text').html('Show Colors')
			}
			else {
				$(this).addClass('on')
				$('td.day').removeClass('blankbg');
				$(this).find('.ui-button-text').html('Hide Colors')
			}
		});
		$('#chart_closeall').click(function(){$('tr.vdetails td').hide(); $('tr.vsum').addClass('closed');});
		$('#chart_openall').click(function(){$('tr.vdetails td').show(); $('tr.vsum').removeClass('closed');});
	}
});

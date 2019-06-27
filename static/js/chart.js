
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

		$("#month_chooser").submit(function(e){
			location.href = "/transpop/"+$(this).find('#id_year').val()+"/"+$(this).find('#id_month').val();
			return false;
		});

	    $.get("chart/", function (json) {
		    if(json['success']) {
				$.each(json['vs'], function(key, v) {
					tr = $('#vehicle'+v['vid']+'_details');
					$.each(v['vfiles'], function(key, f){

						adatetd = tr.find('td[data-date="'+f.file['adate']+'"]');
						ddatetd = tr.find('td[data-date="'+f.file['ddate']+'"]');
						//adatetd.html("<<"); ddatetd.html(">>");

						draw_file(f.file, adatetd, ddatetd, key);
					});
					tr = $('#vehicle'+v['vid']+'_sum');
					trtds = tr.find('td');
					for(var i=0; i<v['vdays'].length; i++){
						td = trtds.eq(i);
						day = v['vdays'][i];
						if (day[0] == 0) td.addClass('freeday');
						else {
							if (Array.isArray(day[0])){
								// overlapping
								td.addClass('overlap');
								//td.attr('title','Overlapping: '+day);
								td.data('fn', day[0]);
							}
							else {
								// single file
								td.addClass('day');
								td.data('fn', day[0]);
								td.data('driver', day[2]);
								td.css({'background':_FILES[day[0]]});
								td.attr('title', _FILES[day[0]]);
								if (day[2]) td.html('<strong>'+day[1]+'</strong>');
								else td.html(day[1]);
							}
						}
					}
				});
	
				$('td.overlap').hover(
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
				$('#chart_closeall').click();
				Message('Loading Finished.');
			}
	        else Message('Error loading chart information.');
		});
	
		$('#transpop_chart tr.vsum th').click(function(){
			var vid = $(this).attr('id');
			$('#'+vid+'_details td').toggle();
			$(this).parent().toggleClass('closed');
		});
		$('#chart_closeall').click(function(){$('tr.vdetails td').hide(); $('tr.vsum').addClass('closed');});
		$('#chart_openall').click(function(){$('tr.vdetails td').show(); $('tr.vsum').removeClass('closed');});

		$('#id_year, #id_month').change(function(){
			var key = $(this).attr('id');
			var value = $(this).val();
			localStorage.setItem(key, value)
		});

		$.each(['id_year', 'id_month'], function(index, key){
			if(localStorage.getItem(key)){
				value = localStorage.getItem(key);
				$('#'+key).val(value);
			}
		});
	}
});

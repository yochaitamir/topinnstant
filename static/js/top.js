
_ERRORS = ["Incorrect Request","Form is not valid"];
_SEPERATOR = '$|%';

var DAY_MILIISECS = 86400000;

function span (html, cls){ 
	if (typeof(html) == "undefined" || html == null || html=="") return "";
	if (typeof(cls) == "undefined") return "<span>"+html+"</span>";
	return "<span class='"+cls+"'>"+html+"</span>&nbsp;";
}

function shortDate(d){return $.datepicker.formatDate('d/m/y', new Date(d));}
function sysDate(d){return $.datepicker.formatDate('yy-mm-dd', new Date(d));}

function arrayLength (a) { var l=0; $.each(a, function(key, value) { l++;}); return l;};

function arraysCompare (a, b) {
	if (arrayLength(a) != arrayLength(b)) return false;
	for (key in a) if (a[key] != b[key]) return false;
	return true;
};

$.datepicker.setDefaults({dateFormat: 'd/m/y', showButtonPanel: true, autoSize: true, 'changeYear': true, yearRange: '-02:+03' });
//hideIfNoPrevNext: true

jQuery.fn.selectFilter = function() {
	var o = $(this[0]);
	var args = arguments[0] || {};
	var select = args['select'];
	if (!select) return false;
	o.keyup(function() {
		term = $(this).val().toLowerCase();
		$(select+' option').each(function(){$(this).css('display',($(this).html().toLowerCase().indexOf(term)<0)?'none':'block');});
	});
};

/* Added: 25.5.2014 */
jQuery.fn.ulFilter = function() {
        var o = $(this[0]);
        var args = arguments[0] || {};
        var ul = args['ul'];
        if (!ul) return false;
        o.keyup(function() {
                term = $(this).val().toLowerCase();
                $(ul+' li').each(function(){$(this).css('display',($(this).html().toLowerCase().indexOf(term)<0)?'none':'block');});
        });
};

jQuery.fn.tableFilter = function() {
        var o = $(this[0]);
        var args = arguments[0] || {};
        var table = args['table'];
        if (!table) return false;
        o.keyup(function() {
                term = $(this).val().toLowerCase();
                $(table+' tr').each(function(){$(this).css('display',($(this).html().toLowerCase().indexOf(term)<0)?'none':'table-row');});
        });
};


(function($) {
	$.widget("ui.combobox", {
	_create: function() {
		var self = this;
        var select = this.element.hide();
        var input = $("<input>")
		.insertAfter(select)
		.autocomplete({
			source: function(request, response) {
				var matcher = new RegExp(request.term, "i");
				response(select.children("option").map(function() {
				var text = $(this).text();
				if (!request.term || matcher.test(text))
					return {
						id: $(this).val(),
						label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + request.term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
						value: text
					};
				}));
			},
			delay: 0,
			select: function(e, ui) {
				if (!ui.item) {/* remove invalid value, as it didn't match anything*/ $(this).val("");return false;}
				$(this).focus();
				select.val(ui.item.id);
				self._trigger("selected", null, { item: select.find("[value='" + ui.item.id + "']") });
			},
			minLength: 0
        })
//		.addClass("ui-widget ui-widget-content ui-corner-left");
		$("<button>&nbsp;</button>").insertAfter(input).button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                }).removeClass("ui-corner-all")
		.addClass("ui-corner-right ui-button-icon")
		.position({my: "left center", at: "right center", of: input, offset: "-1 0" }).css("top", "")
		.click(function() {
			// close if already visible
			if (input.autocomplete("widget").is(":visible")) {input.autocomplete("close"); return;}
			// pass empty str to search for, displaying all results
			input.autocomplete("search", ""); input.focus();
        });
    }
});
})(jQuery);


jQuery.fn.smartsearch = function() {
	var o = $(this[0]);
	var args = arguments[0] || {};
	var res = $(args.results);
	var dialog = $(args.dialog);

	o.autocomplete({ disabled: false, autoFocus: true,
		source: function(request, response) {
			var re = /\d+/;
			var stop = 0;
			if (request.term.length >= 4){
				try {
					res = eval(request.term);
					$('#calc_res').html(res);
					stop = 1;
					if (re.test(request.term) && request.term.length >= 5) {
						url = '/search/fn/'+request.term+'/';
						stop = 3;
					}
				}
				catch (er) {}
					
				if (stop == 1) return;
				re = /^\w\s$/;
				if (!(re.test(request.term))){
					if (stop == 0) {
						request.term = request.term.toLowerCase();
						re = /^[abdfghrs]\s.+/;
						if (re.test(request.term)) {
							url = '/search/'+request.term.split(' ')[0]+'/'+request.term.split(' ').slice(1).join(' ')+'/';
						}
						else url = '/search/'+request.term+'/';
						console.log(request.term)
						console.log(request.term.split(' '))
						console.log(request.term.split(' ').slice(1).join(' '));
					}

					$.get(encodeURI(url), function(json) {
						var matches = [];
						if (json['success'] ) {
							if (json['matches'].length == 0) {
								var match = new Object;
								match.html = "<strong style='color:red;'>No Results...</strong>";
								matches.push (match);
							}
							for (var r=0; r<json['matches'].length;r++){
								var m = json['matches'][r];
								var match = new Object;
								var html = "<div class='match match-"+m['type']+"'>";
								match.name = m['type']+'@'+m['id'];
								switch (m['type']) {
									case 'file':
										html += span(m['name'] + " | "+m['status'],'name')+span(m['adate'],'')+" - "+span(m['ddate'],'');
										break;						
									case 'hotel': html += span(m['name'], "name")+span(m['phone'],'phone')+span(m['fax'],'fax'); break;
									case 'site': html += span(m['name'],'name')+span(m['phone'],'phone')+span(m['fax'],'fax')+span(m['desc'],'desc'); break;
									case 'restaurant': html += span(m['name'],'name')+span(m['phone'],'phone')+span(m['fax'],'fax')+span(m['desc'],'desc'); break;
									case 'guide': html += span(m['name'], "name")+span(m['phone'],'phone')+span(m['mobile'],'mobile'); break;
									case 'bus':
										if (m['contact']=="") html += span(m['name'],'name');
										else html += span(m['name']+" ("+m['contact']+")",'name');
										html += span(m['phone'],'phone') + span(m['fax'],'fax');
										break;
									case 'agent': html += span(m['name'],"name")+span(m['phone'],'phone')+span(m['fax'],'fax');	break;
								}
								match.html = html+"</div>";
								match.value = html+"</div>";
								matches.push (match);
							}
							response(matches);
						}
						else {Message ("An Error Occured"); response (null);}
					});
				}
			}
		},
		
		open: function(event, ui) {
			$('.ui-autocomplete').append('<li><a href="/reports/search/">Go to full Search</a></li>');
		},
		focus: function(event, ui) {return false;},
		select: function (event, ui) {
			var n = ui.item.name.split('@');
			var pos = n.indexOf("file")
			if (n[0] == 'file') {
				url = '/file/'+n[1]+'/';
				window.open(url);
			}
			else $.get("/"+n[0]+"/"+n[1], function(res) { dialog.html (res); dialog.dialog(); });
			return false;
		}
	}).data( "autocomplete" )._renderItem = function(ul,item) {
		return $("<li></li>") 
		.data("item.autocomplete", item)
		.append("<a>"+item.html+"</a>")
		.appendTo(ul);
	};
	
};

function form2JSON (f) {
	var o = {};
	var a = f.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) { o[this.name] = [o[this.name]]; }
			o[this.name].push (this.value || '');
		} else { o[this.name] = this.value || ''; }
	});
	return o;
};

function Message (txt) {
	if (!txt) return false;
	if ($('#statusbar').length>0) {
		$("#statusbar").html (txt);
		window.setTimeout("$('#statusbar').html('');",5000);
	}
	else alert(txt);
}
function timedMessage (selector, txt) {
	if (!txt) return false;
	if ($(selector).length>0) {
		$(selector).show();
		$(selector).html (txt);
		window.setTimeout("$('"+selector+"').hide('slow');",8000);	
	}
	else Message(txt);
}

function Confirm (txt) {
	if (!txt) return false;
	return confirm(txt);	
}

function Save (url, data, selector, callback) {
	Message ("Saving...");
	data.format = "json";
	$.post (url, data, function(json){
		if (json['success']){
			Message ("Saved.");
			if (callback) callback(selector);
		}
		else {
			if (selector) timedMessage(selector, json['error']);
			else Message ("Error: "+_ERRORS[json['error']]);
		}
	});
}

function SaveDialog (url, dialogselector) {
	if (!dialogselector || (dialogselector.length == 0)) return false;
	Message ("Saving...");
	form = $(dialogselector).find('form');
	data = form2JSON (form);
	$.post (url, data, function(json){
		if (json['success']){
			Message ("Saved.");
			$(dialogselector).dialog('close');
		}
		else {
			selector = $(dialogselector).find('.message');
			if (selector.length>0) timedMessage(selector, json['error']);
			else Message ("Error: "+_ERRORS[json['error']]);
		}
	}, "json");
}


function validForm(form){
	var valid = true;	
	var first_field = 1;
	form.find('input.required:visible').each(function(){
//		if ($(this).val() == '' || $(this).val() == 0) {
			if ($(this).val() == '') {
			if (first_field == 1) first_field = $(this);
			$(this).addClass('required-error');
			valid = false;		
		}
		else $(this).removeClass('required-error');
	});
	if (!valid) first_field.focus();
	return valid;
}

function confirmDialog(msg){
	return confirm(msg);
}

//function refresh(){
//    window.location.reload( true );
//}


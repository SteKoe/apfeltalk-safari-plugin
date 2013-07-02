/* Read the Settings */
function readSettings() 
{
	if(window != window.top) 
		return;
		
	safari.self.tab.dispatchMessage("readSettings", 1);
}

/* SET THE SETTINGS */
function setSettings(settings)
{
	whatsNew(settings.excludedForums, settings.overwriteServerExclusions);
	changeSearch(settings.changeForumSearch);
	
	addKarmaButtonToComments();
		
	if(settings.createCommentsLink) createCommentsLink();
}

function addKarmaButtonToComments() {
	var comments = document.getElementById('node_comments');
	if(comments != null) {
		var commentHeaders = comments.getElementsByClassName('postbit_headers');
		
		if(commentHeaders != null) {
			for(headerIndex in commentHeaders) {
				var commentHeader = commentHeaders[headerIndex];
				var postControls = commentHeader.getElementsByClassName('postcontrols')[0];			
				if(typeof postControls == 'undefined') 
					return;
					
				if(typeof(commentHeader) == 'object') {
					var reportLink = commentHeader.getElementsByClassName('report')[0];
					
					// Extract the post ID from report link
					var reportLinkHref = reportLink.href;
					reportLinkHref = reportLinkHref.substr(reportLinkHref.indexOf('?p=')+3);
					var postId = reportLinkHref.substr(0, reportLinkHref.indexOf('&'));
					
					var replyButton = postControls.getElementsByClassName('reply')[0].parentNode;
					
					var li = document.createElement('li');
					li.innerHTML = '<a href="http://www.apfeltalk.de/forum/reputation.php?do=addreputation&p='+postId+'"><img src="images/buttons/reputation-40b.png" alt="Karma geben"></a>';
					postControls.insertBefore(li, replyButton);
				}
			}
		}
	}
}

/* Kommentaranzeige im Magazin leitet durch Klick direkt zu den Kommentaren weiter */
function createCommentsLink()
{
	var _elements = document.getElementById('section_content');
	if(_elements == null)
		return;
		
	console.log(_elements);
	elements = _elements.getElementsByTagName('div');
	
	for(var i in elements)
	{
		if(elements[i].tagName == "DIV" && elements[i].className.indexOf('fullwidth') != -1)
		{
			var article = elements[i];
			var title = article.getElementsByClassName('title')[0];
			var href = title.getElementsByTagName('a')[0].href+"#comments";
			var commentnumber = article.getElementsByClassName('commentnumber')[0];
			commentnumber.setAttribute('data-href', href);
			commentnumber.onclick = function() {
				location.href = this.getAttribute('data-href');
			}
			commentnumber.style.cursor = "pointer";
		}	
	}
}

/* MANIPULATE SEARCH */
function whatsNew(exclusions, overwrite)
{
 	var wrappingElement = document.getElementById('navbar');
	var elements = wrappingElement.getElementsByTagName('a');
	
	for(var i in elements)
	{
		if(elements[i].innerHTML == "Was ist neu?" || elements[i].innerHTML == "Neue Beiträge")
		{
			var element = elements[i];
			var old_href = element.getAttribute('href');
			exclusions = exclusions.replace(" ","");
			
			var url = old_href;
			var new_href = url;
			var start = 0;

			// Overwrite server-settings
			if(overwrite)
			{
				var url = url.replace(/(exclude[=0-9,]*$)|(&exclude[=0-9,]*&)/gi,"");
			}
			
			// No exclusions set by board software
			if((start = url.lastIndexOf('exclude')) == -1)
			{
				new_href = url + "&exclude="+exclusions;
			}
			else
			{
				start = start+('exclude=').length;
			
				var current_exclusions = url.substr(start);
				var end = current_exclusions.indexOf('&');
				
				if(end != -1)
					current_exclusions = url.substr(start, end);
				else
					current_exclusions = url.substr(start);

				if(current_exclusions.length > 0)
					current_exclusions += ","+exclusions;
				else
					current_exclusions = exclusions;
			
				var new_url = url.substr(0,start);
				
				if(end != -1)
					var new_end_url = url.substr(start+end);
				else
					var new_end_url = "";
				
				new_href = new_url+current_exclusions+new_end_url;
			}
	
			element.setAttribute('href', new_href);
		}
	}
}

/* GOOGLE SEARCH INSTEAD OF FORUM */
function changeSearch(enable) {
	if(enable == 0)
		return;
		
	var search_form = document.getElementById('navbar_search');
	search_form.onsubmit = function(){
		for(var i = 0; i < search_form.elements.length; i++)
		{
			if(search_form.elements[i].name == "query")
			{
				var val = search_form.elements[i].value;
				if(val.length == 0)
				{
					alert("Du musst ein Suchwort eingeben!");
					break;
				}
				
				var query = "http://www.google.de/search?q="+val+"+site:apfeltalk.de";
				
				window.location.href = query;
			}
		}
		
		return false;
	};
}

function getAnswer(theMessageEvent) {
	switch(theMessageEvent.name)
	{
		case "settings":
			setSettings(theMessageEvent.message);
			break;
	}
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

safari.self.addEventListener("message", getAnswer, false);

readSettings();
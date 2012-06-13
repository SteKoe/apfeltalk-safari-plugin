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
	whatsNew(settings.excludedForums);
	changeSearch(settings.changeSearch);
	tapatalk();
}

/* MANIPULATE SEARCH */
function whatsNew(exclusions)
{
	if(exclusions.length == 0)
		return;
		 
	var elements = document.getElementsByClassName('navtab');
	for(var i in elements)
	{
		if(elements[i].innerHTML == "Was ist neu?")
		{
			var element = elements[i];
			var old_href = element.getAttribute('href');
			exclusions = exclusions.replace(" ","");
			
			var url = old_href;
			var new_href = url;
			var start = 0;
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
				var new_end_url = url.substr(start+end);
				new_href = new_url+current_exclusions+new_end_url;
			}
	
			element.setAttribute('href', new_href);
	
			break;
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

safari.self.addEventListener("message", getAnswer, false);

readSettings();
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

function tapatalk()
{
	console.log(window.jQuery);
	if(typeof jQuery == 'undefined')
		return;
		
		
		
	var api_url = 'http://www.apfeltalk.de/forum/mobiquo/mobiquo.php';
	var xml = '<?xml version="1.0"?><methodCall><methodName>get_raw_post</methodName><params><param><value><string>3663</string></value></param></params></methodCall>';
	
	console.log(xml);	
	
	jQuery.ajax({
	   url: api_url,
	   data: xml,
	   contentType:"text/xml",
	   type:"post",
	   success: function(msg){
			console.log(msg);
	   }
	 
	});
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
			var new_href = old_href+","+exclusions;
	
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
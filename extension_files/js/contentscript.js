function myMain () {
	var t = document.createElement('script');
	t.src = chrome.extension.getURL('jquery.min.js');
	(document.head||document.documentElement).appendChild(t);
	t.onload = function() {
		t.parentNode.removeChild(t);
		var s = document.createElement('script');
		s.src = chrome.extension.getURL('script.js');
		(document.head||document.documentElement).appendChild(s);
		s.onload = function() {
			s.parentNode.removeChild(s);
		};
	};
}

chrome.extension.sendRequest({method: "getStatus"}, function(response) {
	if(response.status=='enabled'){  
		myMain();
	}
});




var blockbg = false;

function checkForValidUrl(tabId, changeInfo, tab) {
	if(!blockbg){
		blockbg = true;
		if (tab.url.indexOf('https://www.youtube.com') == 0 | tab.url.indexOf('youtube.com') > -1) {
			chrome.pageAction.show(tabId);
			chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
				if (request.method == "getStatus")
					sendResponse({status: localStorage.extensionStatus});
				else
					sendResponse({}); });
			chrome.tabs.executeScript({file:"/js/contentscript.js", allFrames : true });
			blockbg =false;
		}
	}	
};
// chrome.tabs.onCreated.addListener(checkForValidUrl);
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/1U78lqUoz0t5N1hAfAfaC_R26iJh6TTGtVRgtnBbbMv8/viewform?usp=send_form");
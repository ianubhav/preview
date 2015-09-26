function checkForValidUrl(tabId, changeInfo, tab) {
if (tab.url.indexOf('https://www.youtube.com') == 0) {
chrome.pageAction.show(tabId);
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
if (request.method == "getStatus")
       sendResponse({status: localStorage.extensionStatus});
else
       sendResponse({}); });


chrome.tabs.executeScript({file:"contentscript.js", allFrames : true });
}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
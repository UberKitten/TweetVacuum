chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = chrome.extension.getURL("popup.html");
    chrome.tabs.create({ url: newURL });
});
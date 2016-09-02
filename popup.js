var query, url;

// http://stackoverflow.com/a/901144
function getParameterByName(name, url) {
    //if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function load() {
	chrome.tabs.query({lastFocusedWindow: true, windowType: "normal", currentWindow: true}, function (tabs) {
		url = tabs[0].url;
		query = getParameterByName("q", url);
		document.getElementById("searchquery").textContent = '"' + query + '"';
		if (query) {
			document.getElementById("yesparse").style.display = 'block';
			document.getElementById("noparse").style.display = 'none';
		} else {
			document.getElementById("noparse").style.display = 'block';
			document.getElementById("yesparse").style.display = 'none';
		}
		
		chrome.storage.local.get(query, function(items) {
			if (items.length > 0) {
				document.getElementById("datacount").textContent = items[0].length;
			} else {
				document.getElementById("datacount").textContent = '0';
			}
		});
	});
}


function start(e) {
	// Initialize Chrome data
	
	
	chrome.tabs.executeScript({
		file: "jquery-3.1.0.js"
	});
	chrome.tabs.executeScript({
		file: "inject.js",
		runAt: "document_end"
	});
}

function stop(e) {
	// elegant in its brute simplicity
	chrome.tabs.reload();
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("start").addEventListener('click', start);
	document.getElementById("stop").addEventListener('click', stop);
	load();
});
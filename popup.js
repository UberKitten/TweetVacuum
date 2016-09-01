function start(e) {
	chrome.tabs.executeScript({
		file: "jquery-3.1.0.js"
	});
	chrome.tabs.executeScript({
		file: "inject.js",
		runAt: "document_end"
	});
	window.close();
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("start").addEventListener('click', start);
});
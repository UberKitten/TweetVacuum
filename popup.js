function start(e) {
	chrome.tabs.executeScript({
		file: "inject.js"
	});
	window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("start").addEventListener('click', start);
});
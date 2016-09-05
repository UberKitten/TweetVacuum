var username, db;
var until;
var windowId, tabId;
var waiting = false;

function log(msg) {
	$("#endlog").append(msg).append("<br/>");
	console.log(msg);
}

function start(e) {	
	username = $("#username").val().toLowerCase();
	log("Running for user: " + username);
	db = createDb(username)
	
	var meta = {latestDate: new Date()};
	db.meta.toArray().then(function(metaobj) {
		meta = metaobj;
	});
	
	until = meta.latestDate;
	log("Latest date: " + isoDate(until));
	log("Opening new work window");
	chrome.windows.create({
		url: "about:blank",
	}, function(newwindow) {
		windowId = newwindow.id;
		loop();
	});
}

function loop() {
	if (!waiting) {
		var since = new Date(until.getTime());
		since.setMonth(since.getMonth() - 1);
		
		log("Going from " + isoDate(since) + " to " + isoDate(until));
		
		var query = "from:" + username + " since:" + isoDate(since) + " until:" + isoDate(until);
		var url = "https://twitter.com/search?f=tweets&q=" + encodeURIComponent(query);
		log("Searching: " + query);

		waiting = true;
		chrome.tabs.create({
			url: url,
			windowId: windowId
		}, function(tab) {
			tabId = tab.id;
			log("Injecting script")
			executeScripts(tabId, [
				{ file: "jquery-3.1.0.js" },
				{ file: "dexie.js" },
				{ file: "common.js" },
				{ file: "inject.js"}
			]);
			
			// Give it a few seconds to load all the scripts and be ready
			setTimeout(function() {
				chrome.tabs.sendMessage(tabId, {
					action: "start",
					username: username
				});
			}, 5000);
		});
	}
	
	setTimeout(loop, 1000);
}

function stop(e) {
	chrome.tabs.sendMessage(tabId, {
		action: "stop"
	});
}

function deleteDb() {
	username = $("#username").val().toLowerCase();
	Dexie.delete(username);
	log("Database deleted for " + username);
}

$(document).ready(function() {
	$("#start").click(start);
	$("#stop").click(stop);
	$("#delete").click(deleteDb);
	$('#form').submit(function () {
		return false;
	});	
});

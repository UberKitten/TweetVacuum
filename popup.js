var username, db;
var windowId, tabId;
var waiting = false;

function start(e) {	
	username = $("#username").val().toLowerCase();
	log("Running for user: " + username);
	db = createDb(username);
	
	db.tweet
		.orderBy("date")
		.limit(1)
		.toArray()
		.then(function(tweet) {
			if (tweet && tweet.date) {
				launchSearch(new Date(tweet.date));
			} else {
				var date = new Date();
				date.setDate(date.getDate() + 1)
				launchSearch(date);
			}
		})
		.catch(function() {});
}

function launchSearch(lastDate) {
	log("Searching up to " + isoDate(lastDate));
	
	var query = "from:" + username + " until:" + isoDate(lastDate);
	var url = "https://twitter.com/search?f=tweets&q=" + encodeURIComponent(query);
	log("Searching: " + query);

	waiting = true;
	
	if (windowId) {
		chrome.tabs.create({
			url: url,
			windowId: windowId
		}, inject);
	} else {
		log("Opening new work window");
		chrome.windows.create({
			url: url,
		}, function(newwindow) {
			windowId = newwindow.id;
			inject(newwindow.tabs[0].id);
		});
	}
}

function inject(id) {
	tabId = id;
	
	executeScripts(tabId, [
		{ file: "jquery-3.1.0.js" },
		{ file: "dexie.js" },
		{ file: "common.js" },
		{ file: "inject.js"}
	]);
	
	// Give it a few seconds to load all the scripts and be ready
	setTimeout(function() {
		log("Starting scrape");
		chrome.tabs.sendMessage(tabId, {
			action: "start",
			username: username
		});
	}, 5000);
}

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	db.tweet.add(request).catch(function (error) {
		log(error);
	});
});

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

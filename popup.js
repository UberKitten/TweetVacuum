var username, db;
var windowId, tabId;
var timeout, count;

function start(e) {	
	$("#start").hide();
	$("#stop").show();

	username = $("#username").val().toLowerCase();
	log("Running for user: " + username);
	db = createDb(username);

	newSearch();
}

function newSearch() {
	db.tweet
		.orderBy("date")
		.limit(1)
		.toArray()
		.then(function(tweet) {
			if (tweet[0]) {
				var date = new Date(tweet[0].date);
				log("Found existing data, latest date " + isoDate(date));
				date.setDate(date.getDate() + 1)
				launchSearch(date);
			} else {
				var date = new Date();
				date.setDate(date.getDate() + 1)
				launchSearch(date);
			}
		})
		.catch(function() {});
}

function launchSearch(lastDate) {
	log("Searching for tweets before " + isoDate(lastDate));
	
	var query = "from:" + username + " until:" + isoDate(lastDate);
	var url = "https://twitter.com/search?f=tweets&q=" + encodeURIComponent(query);
	
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
			inject(newwindow.tabs[0]);
		});
	}
	
	var endlog = $("#endlog");
	endlog.append("Current count: ").append("<span class='count'>0</span>").append("<br/>");
	count = 0;
}

function inject(tab) {
	if (tabId) {
		chrome.tabs.remove(tabId);
	}
	tabId = tab.id;
	
	executeScripts(tabId, [
		{ file: "jquery-3.1.0.js" },
		{ file: "inject.js"}
	]);
	
	timeout = setTimeout(searchFailure, 10000);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "add") {
			clearTimeout(timeout);
			timeout = setTimeout(searchFailure, 10000);
			
			count++;
			$(".count").last().text(count);

			db.tweet.add(request.data).catch(function (error) {
				console.log(error);
			});
		}
});

function searchFailure() {
	log("Tab crashed or failed, restarting");
	newSearch();
}

function stop(e) {
	$("#start").show();
	$("#stop").hide();
	
	log("Stopping");
	chrome.tabs.sendMessage(tabId, {
		action: "stop"
	});
	clearTimeout(timeout);
	tabId = "";
	windowId = "";
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

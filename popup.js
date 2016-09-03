var username, db;
var until;
var waiting = false;

function log(msg) {
	$("#endlog").append(msg).append("<br/>");
	console.log(msg);
}

function isoDate(date) {
	return date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
}

function start(e) {	
	username = $("#username").val().toLowerCase();
	log("Running for user: " + username);
	
	db = new Dexie(username);
	db.version(1).stores({
		meta: 'latestDate',
		tweet: '&id'
	});
	db.open();
	
	var meta = {latestDate: new Date()};
	db.meta.toArray().then(function(metaobj) {
		meta = metaobj;
	});
	
	until = meta.latestDate;
	log("Latest date: " + until);
	loop();
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
		chrome.tabs.create({url: url}, function(tab) {
			log("Injecting script")
			chrome.tabs.executeScript(tab.id, {
				file: "jquery-3.1.0.js"
			});
			chrome.tabs.executeScript(tab.id, {
				file: "dexie.js"
			});
			chrome.tabs.executeScript(tab.id, {
				file: "inject.js",
				runAt: "document_end"
			});
		});
	}
	
	setTimeout(loop, 1000);
}

function stop(e) {
	// elegant in its brute simplicity
	location.reload(true);
}

$(document).ready(function() {
	$("#start").click(start);
	$("#stop").click(stop);
	$('#form').submit(function () {
		return false;
	});	
});

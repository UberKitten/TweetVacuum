$(".topbar").remove();
$("#page-container").css("paddingTop", "0px");
$(".AdaptiveFiltersBar").remove();
$(".SidebarCommonModules").parent().remove();
// We need this so that we can scroll to the bottom and trigger Twitter's infinite scroll code
$("#page-container").append($("<div>", {
	style: "height: 10000px; width: 1px;"
}));

var db;

function run(username) {
	db = createDb(username);
	setTimeout(loop, 1000);
	setInterval(scroll, 500);
}

function loop() {
	items = $(".js-stream-item")
		.not("[vacuumed=true]")
		.each(function() {
			var item = $(this);
			
			chrome.runtime.sendMessage({
				tweetId: item.attr("data-item-id"),
				date: parseInt(item.find(".js-short-timestamp").attr("data-time-ms"))
			});
			item.attr("vacuumed", true);
			item.hide();
	});
	
	setTimeout(loop, 1000);
}

var up;
function scroll() {
	if (up) {
		window.scrollTo(0,0);
	} else {
		window.scrollTo(0, document.body.scrollHeight);
	}
	up = !up;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == "stop") {
		db.close();
		window.close();
	}
	if (request.action == "start") {
		run(request.username);
	}
  });
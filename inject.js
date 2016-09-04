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
	var items = $(".js-stream-item").not("[vacuumed=true]");
	
	items.each(function() {
		var item = $(this);
		db.tweet.put({id: item.attr("data-item-id")}).catch(function (error) {
			log(error);
		});
		item.attr("vacuumed", true);
		console.log(item.attr("data-item-id"));
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
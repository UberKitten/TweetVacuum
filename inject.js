var loaded = false;
function loop() {
	if (loaded) {
		items = $(".js-stream-item")
			.not("[vacuumed=true]")
			.each(function() {
				var item = $(this);
				
				chrome.runtime.sendMessage({
					action: "add",
					data: {
						tweetId: item.attr("data-item-id"),
						date: parseInt(item.find(".js-short-timestamp").attr("data-time-ms"))
					}
				});
				item.attr("vacuumed", true);
				item.hide();
		});
	} else {
		if (window.jQuery) {
			loaded = true;
			
			$(".topbar").remove();
			$("#page-container").css("paddingTop", "0px");
			$(".AdaptiveFiltersBar").remove();
			$(".SidebarCommonModules").parent().remove();
			// We need this so that we can scroll to the bottom and trigger Twitter's infinite scroll code
			$("#page-container").append($("<div>", {
				style: "height: 10000px; width: 1px;"
			}));
			
			setInterval(scroll, 500);
		}
	}
	
	setTimeout(loop, 1000);
}

// Prefer to use setTimeout to not have multiple occurences of loop()
// running at the same time
setTimeout(loop, 1000);

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
    if (request.action == "stop") {
		db.close();
		window.close();
	}
  });
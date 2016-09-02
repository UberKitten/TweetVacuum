$(".topbar").remove();
$("#page-container").css("paddingTop", "0px");
$(".AdaptiveFiltersBar").remove();
//$(".SidebarCommonModules").parent().remove();

// http://stackoverflow.com/a/901144
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var query = getParameterByName("q");
var data = null;

chrome.storage.local.get(query, function(items) {
	if (items.length > 0) {
		data = items[0];
	} else {
		data = [];
	}
	
	setTimeout(run, 2000);
});

function run() {
	var items = $(".js-stream-item").not("[vacuumed=true]");
	
	items.each(function() {
		var item = $(this);
		data[item.attr("data-item-id")] = true;
		item.attr("vacuumed", true);
		console.log(item.attr("data-item-id"));
		item.hide();
	});
	
	//chrome.storage.local.set({query: data});
	
	window.scrollTo(0,0);
	window.scrollTo(0, document.body.scrollHeight);
	setTimeout(run, 250);
};

/*setInterval(function() {
}, 1000);*/
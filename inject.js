$(".topbar").remove();
$("#page-container").css("paddingTop", "0px");
$(".AdaptiveFiltersBar").remove();
$(".SidebarCommonModules").parent().remove();

setInterval(function() {
	window.scrollTo(0, document.body.scrollHeight);
}, 1000);
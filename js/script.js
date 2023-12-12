dayjs.extend(window.dayjs_plugin_advancedFormat);
$(document).ready(function () {
	var currentDay = $("#currentDay");
	var todaysDay = dayjs().format("dddd, MMMM Do YYYY");
	currentDay.text(todaysDay);
	console.log(todaysDay);
});

// jQuery Plugin to display the date formatted with suffix
dayjs.extend(window.dayjs_plugin_advancedFormat);

// Display the date of today formatted as day, months, date with suffix, year
$(document).ready(function () {
	var currentDay = $("#currentDay");
	var todaysDay = dayjs().format("dddd, MMMM Do YYYY");
	currentDay.text(todaysDay);
	console.log(todaysDay);
});

function updateHour() {
	// Display current hour
	var currentHour = parseInt(dayjs().format("H"));

	// Color-code each time-block based on past, present, and future when the time-block is viewed.
	$(".time-block").each(function () {
		var blockHour = parseInt($(this).attr("id").split("-")[1]);
		var $textarea = $(this).find(".description");

		if (blockHour < currentHour) {
			// Past hours(s)
			$(this).removeClass("present future").addClass("past");
			$textarea.removeClass("present future").addClass("past");
		} else if (blockHour === currentHour) {
			// Current hour
			$(this).removeClass("past future").addClass("present");
			$textarea.removeClass("past future").addClass("present");
		} else {
			// Future hour(s)
			$(this).removeClass("past present").addClass("future");
			$textarea.removeClass("past present").addClass("future");
		}
	});
}
updateHour();

$(".saveBtn").on("click", function () {
	var value = $(this).siblings(".description").val();
	var time = $(this).parent().attr("id");

	console.log("value:", value);
	console.log("time:", time);

	// Saving values into localStorage with a key based on selected day and time ID
	localStorage.setItem(time, value);
});

$(".time-block").each(function () {
	var hourId = $(this).attr("id");
	var storedValue = localStorage.getItem(hourId);
	$(this).find(".description").val(storedValue);
});
// Update hour ever 15 minutes
setInterval(function () {
	updateHour();
}, 15 * 60 * 1000);

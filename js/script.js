dayjs.extend(window.dayjs_plugin_advancedFormat);

// Display the date of today formatted as day, months, date with suffix, year
$(document).ready(function () {
	var currentDay = $("#currentDay");
	var todaysDay = dayjs().format("dddd, MMMM Do YYYY");
	currentDay.text(todaysDay);
	console.log(todaysDay);
	var selectedDay = null;

	function updateSelectedDayDisplay() {
		if (selectedDay) {
			currentDay.text(dayjs(selectedDay).format("dddd, Do MMMM YYYY"));
		}
	}

	// Load stored values for the selected day on page load
	$(".time-block").each(function () {
		var hourId = $(this).attr("id");
		var storedValue = localStorage.getItem(selectedDay + "_" + hourId);
		$(this).find(".description").val(storedValue);
	});

	// Handle day selection change
	$("#daySelector").on("change", function () {
		var selectedIndex = this.selectedIndex;

		if (selectedIndex === 0) {
			$("#scheduleContainer").hide();
		} else {
			$("#scheduleContainer").show();
		}

		// Set selectedDay based on the selected index
		if (selectedIndex === 0) {
			selectedDay = dayjs().format("YYYY-MM-DD"); // Today
		} else if (selectedIndex === 1) {
			selectedDay = dayjs().add(1, "day").format("YYYY-MM-DD"); // Tomorrow
		} else if (selectedIndex === 2) {
			selectedDay = dayjs().add(2, "day").format("YYYY-MM-DD"); // Day after tomorrow
		} else if (selectedIndex === 3) {
			selectedDay = dayjs().add(3, "day").format("YYYY-MM-DD"); // Day after tomorrow
		}

		// Retrieve and display stored values for the selected day
		$(".time-block").each(function () {
			var hourId = $(this).attr("id");
			var storedValue = localStorage.getItem(selectedDay + "_" + hourId);
			$(this).find(".description").val(storedValue);
		});

		updateDay();
		updateSelectedDayDisplay();
	});

	//note - Save button functionality
	$(".saveBtn").on("click", function () {
		// get value of textarea input by selected time and store in localstorage
		var value = $(this).siblings(".description").val();
		var time = $(this).parent().attr("id");

		Swal.fire({
			title: "Scheduler Item Added!",
			showClass: {
				popup: `
				animate__animated
				animate__fadeInUp
				animate__faster
			  `,
			},
			hideClass: {
				popup: `
				animate__animated
				animate__fadeOutDown
				animate__faster
			  `,
			},
		});

		console.log("value:", value);
		console.log("time:", time);
		// Saving values into localStorage timeId
		localStorage.setItem(selectedDay + "_" + time, value);
	});

	//note - Remove button functionality
	$(document).on("click", ".removeBtn", function () {
		var textAreaInputToRemove = $(this).parent();
		var hourContainer = textAreaInputToRemove.attr("id");

		// Confirm with the user before removing the value
		Swal.fire({
			title: "Delete?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#28a745",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, remove it!",
		}).then((result) => {
			if (result.isConfirmed) {
				// Remove the value(s) from localStorage
				localStorage.removeItem(selectedDay + "_" + hourContainer);

				// Clear the textarea value
				textAreaInputToRemove.find(".description").val("");

				// Provide feedback to the user
				Swal.fire({
					title: "Removed!",
					text: "Schedule item successfully deleted",
					icon: "success",
				});
			}
		});
	});

	function updateHour() {
		// Display current hour
		var currentHour = parseInt(dayjs().format("H"));

		// Color-code each time-block based on past, present, and future when the time-block is viewed.
		$(".time-block").each(function () {
			var blockHour = parseInt($(this).attr("id").split("-")[1]);
			var textareaInput = $(this).find(".description");

			if (blockHour < currentHour) {
				// Past hours(s)
				$(this).removeClass("present future").addClass("past");
				textareaInput.removeClass("present future").addClass("past");
			} else if (blockHour === currentHour) {
				// Current hour
				$(this).removeClass("past future").addClass("present");
				textareaInput.removeClass("past future").addClass("present");
			} else {
				// Future hour(s)
				$(this).removeClass("past present").addClass("future");
				textareaInput.removeClass("past present").addClass("future");
			}
		});
	}

	// Updates the day in the UI
	function updateDay() {
		$(".current-day").text(dayjs().format("dddd, Do MMMM YYYY"));
	}

	updateSelectedDayDisplay();
	updateHour();
	updateDay();

	// Update hour ever 15 minutes
	setInterval(function () {
		updateHour();
	}, 15 * 60 * 1000);

	// Populate the day selector with three days
	for (var i = 1; i <= 3; i++) {
		$("#daySelector").append(
			'<option value="day' + i + '">Day ' + i + "</option>"
		);
	}
});

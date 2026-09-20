const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");

const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");

const addEventBtn = document.querySelector(".add-event");
const addEventWrapper = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");

const addEventTitle = document.querySelector(".event-name");
const addEventFrom = document.querySelector(".event-time-from");
const addEventTo = document.querySelector(".event-time-to");
const addEventSubmit = document.querySelector(".add-event-btn");

const aiChatbot = document.querySelector(".ai_chatbot");
const aiFullscreen = document.querySelector(".ai_fullscreen");
const aiClose = document.querySelector(".ai_close");

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let activeDay = today.getDate();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const eventsArr = [];

function getEvents() {
    const savedEvents = localStorage.getItem("events");

    if (!savedEvents) {
        return;
    }

    try {
        const parsedEvents = JSON.parse(savedEvents);

        if (Array.isArray(parsedEvents)) {
            eventsArr.push(...parsedEvents);
        }
    } catch (error) {
        localStorage.removeItem("events");
    }
}

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const nextDays = 6 - lastDay.getDay();

    date.textContent = `${months[month]} ${year}`;

    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        days += `
            <div class="day prev-date">
                ${prevDays - x + 1}
            </div>
        `;
    }

    for (let i = 1; i <= lastDate; i++) {
        let hasEvent = false;

        eventsArr.forEach((event) => {
            if (
                event.day === i &&
                event.month === month + 1 &&
                event.year === year
            ) {
                hasEvent = true;
            }
        });

        const isToday =
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        const isActive = i === activeDay;

        let classes = "day";

        if (isToday) {
            classes += " today";
        }

        if (isActive) {
            classes += " active";
        }

        if (hasEvent) {
            classes += " event";
        }

        days += `
            <div class="${classes}">
                ${i}
            </div>
        `;
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `
            <div class="day next-date">
                ${j}
            </div>
        `;
    }

    daysContainer.innerHTML = days;

    addListener();

    if (activeDay > lastDate) {
        activeDay = lastDate;
    }

    getActiveDay(activeDay);
    updateEvents(activeDay);
}

function prevMonth() {
    month--;

    if (month < 0) {
        month = 11;
        year--;
    }

    activeDay = 1;
    initCalendar();
}

function nextMonth() {
    month++;

    if (month > 11) {
        month = 0;
        year++;
    }

    activeDay = 1;
    initCalendar();
}

function addListener() {
    const days = document.querySelectorAll(".day");

    days.forEach((dayElement) => {
        dayElement.addEventListener("click", () => {
            const selectedDay = Number(dayElement.textContent.trim());

            if (dayElement.classList.contains("prev-date")) {
                month--;

                if (month < 0) {
                    month = 11;
                    year--;
                }

                activeDay = selectedDay;
                initCalendar();
                return;
            }

            if (dayElement.classList.contains("next-date")) {
                month++;

                if (month > 11) {
                    month = 0;
                    year++;
                }

                activeDay = selectedDay;
                initCalendar();
                return;
            }

            activeDay = selectedDay;

            document.querySelectorAll(".day").forEach((day) => {
                day.classList.remove("active");
            });

            dayElement.classList.add("active");

            getActiveDay(activeDay);
            updateEvents(activeDay);
        });
    });
}

function getActiveDay(dayNumber) {
    const selectedDate = new Date(year, month, dayNumber);

    eventDay.textContent = selectedDate.toLocaleDateString("en-US", {
        weekday: "short"
    });

    eventDate.textContent =
        `${dayNumber} ${months[month]} ${year}`;
}

function updateEvents(dayNumber) {
    let events = "";

    eventsArr.forEach((event) => {
        if (
            event.day === dayNumber &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((task) => {
                events += `
                    <div class="event">
                        <div class="title">
                            <i class="fas fa-circle"></i>
                            <h3 class="event-title">
                                ${task.title}
                            </h3>
                        </div>

                        <div class="event-time">
                            <span>${task.time}</span>
                        </div>
                    </div>
                `;
            });
        }
    });

    if (events === "") {
        events = `
            <div class="no-event">
                <h3>No Tasks</h3>
            </div>
        `;
    }

    eventsContainer.innerHTML = events;
}

function gotoDate() {
    const dateArr = dateInput.value.split("/");

    if (dateArr.length !== 2) {
        alert("Invalid Date");
        return;
    }

    const enteredMonth = Number(dateArr[0]);
    const enteredYear = Number(dateArr[1]);

    if (
        enteredMonth < 1 ||
        enteredMonth > 12 ||
        dateArr[1].length !== 4 ||
        Number.isNaN(enteredYear)
    ) {
        alert("Invalid Date");
        return;
    }

    month = enteredMonth - 1;
    year = enteredYear;
    activeDay = 1;

    initCalendar();

    dateInput.value = "";
}

function convertTime(time) {
    const timeArr = time.split(":");

    let hour = Number(timeArr[0]);
    const minute = timeArr[1];

    const format = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${format}`;
}

getEvents();

initCalendar();

prev.addEventListener("click", prevMonth);

next.addEventListener("click", nextMonth);

todayBtn.addEventListener("click", () => {
    today = new Date();

    month = today.getMonth();
    year = today.getFullYear();
    activeDay = today.getDate();

    initCalendar();
});

gotoBtn.addEventListener("click", gotoDate);

dateInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        gotoDate();
    }
});

dateInput.addEventListener("input", () => {
    let value = dateInput.value.replace(/[^0-9]/g, "");

    if (value.length > 6) {
        value = value.slice(0, 6);
    }

    if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
    }

    dateInput.value = value;
});

addEventBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (event) => {
    if (
        !addEventBtn.contains(event.target) &&
        !addEventWrapper.contains(event.target)
    ) {
        addEventWrapper.classList.remove("active");
    }
});

addEventTitle.addEventListener("input", () => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
});

addEventFrom.addEventListener("input", () => {
    let value = addEventFrom.value.replace(/[^0-9]/g, "");

    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    if (value.length > 2) {
        value = value.slice(0, 2) + ":" + value.slice(2);
    }

    addEventFrom.value = value;
});

addEventTo.addEventListener("input", () => {
    let value = addEventTo.value.replace(/[^0-9]/g, "");

    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    if (value.length > 2) {
        value = value.slice(0, 2) + ":" + value.slice(2);
    }

    addEventTo.value = value;
});

addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value.trim();
    const eventTimeFrom = addEventFrom.value.trim();
    const eventTimeTo = addEventTo.value.trim();

    if (
        eventTitle === "" ||
        eventTimeFrom === "" ||
        eventTimeTo === ""
    ) {
        alert("Please fill all the fields");
        return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2
    ) {
        alert("Invalid Time Format");
        return;
    }

    const fromHour = Number(timeFromArr[0]);
    const fromMinute = Number(timeFromArr[1]);
    const toHour = Number(timeToArr[0]);
    const toMinute = Number(timeToArr[1]);

    if (
        fromHour < 0 ||
        fromHour > 23 ||
        fromMinute < 0 ||
        fromMinute > 59 ||
        toHour < 0 ||
        toHour > 23 ||
        toMinute < 0 ||
        toMinute > 59
    ) {
        alert("Invalid Time Format");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    let eventExists = false;

    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((task) => {
                if (
                    task.title.toLowerCase() ===
                    eventTitle.toLowerCase()
                ) {
                    eventExists = true;
                }
            });
        }
    });

    if (eventExists) {
        alert("Task already added");
        return;
    }

    const newEvent = {
        title: eventTitle,
        time: `${timeFrom} - ${timeTo}`
    };

    let eventAdded = false;

    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.push(newEvent);
            eventAdded = true;
        }
    });

    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent]
        });
    }

    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    addEventWrapper.classList.remove("active");

    saveEvents();
    initCalendar();
});

eventsContainer.addEventListener("click", (event) => {
    const eventElement = event.target.closest(".event");

    if (!eventElement) {
        return;
    }

    const titleElement =
        eventElement.querySelector(".event-title");

    if (!titleElement) {
        return;
    }

    const eventTitle =
        titleElement.textContent.trim();

    const shouldDelete =
        confirm("Are you sure you want to delete this task?");

    if (!shouldDelete) {
        return;
    }

    eventsArr.forEach((eventItem, eventIndex) => {
        if (
            eventItem.day === activeDay &&
            eventItem.month === month + 1 &&
            eventItem.year === year
        ) {
            eventItem.events = eventItem.events.filter(
                (task) => task.title !== eventTitle
            );

            if (eventItem.events.length === 0) {
                eventsArr.splice(eventIndex, 1);
            }
        }
    });

    saveEvents();
    initCalendar();
});

if (aiChatbot && aiFullscreen) {
    aiChatbot.addEventListener("click", () => {
        aiFullscreen.classList.add("active");
    });
}

if (aiClose && aiFullscreen) {
    aiClose.addEventListener("click", () => {
        aiFullscreen.classList.remove("active");
    });
}


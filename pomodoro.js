let timerDisplay = document.getElementById("timer") || document.querySelector(".timer");
let startButton = document.getElementById("start") || document.querySelector(".start");
let resetButton = document.getElementById("reset");
let pauseButton = document.getElementById("pause");

let workInput = document.getElementById("work-time");
let breakInput = document.getElementById("break-time");

let alarmSound = document.getElementById("beep-sound");

let isRunning = false;
let isWorkTime = true;
let timerInterval = null;
let timerRemaining = null;

let sessionCount = 0;
let completedSessions = 0;
let totalTime = 0;
let Totalstreaks = 0;

const completedSessionsDisplay = document.getElementById("completedSessions");
const TotaltimeDisplay = document.getElementById("Totaltime");
const TotalstreaksDisplay = document.getElementById("Totalstreaks");

function readStat(key, fallbackValue = 0) {
    try {
        const value = Number(localStorage.getItem(key));
        return Number.isFinite(value) ? value : fallbackValue;
    } catch (error) {
        return fallbackValue;
    }
}

function getCurrentDuration() {
    const minutes = isWorkTime ? Number(workInput.value || 25) : Number(breakInput.value || 5);
    return minutes * 60;
}

function addZoomEffect() {
    if (timerDisplay && timerDisplay.classList) {
        timerDisplay.classList.add("timer-zoom");
        setTimeout(() => timerDisplay.classList.remove("timer-zoom"), 200);
    }
}

workInput.addEventListener("input", () => {
    if (!isRunning) {
        isWorkTime = true;
        timerRemaining = Number(workInput.value || 25) * 60;
        updateDisplay(timerRemaining);
        toggleButtons();
    }
});

breakInput.addEventListener("input", () => {
    if (!isRunning) {
        isWorkTime = false;
        timerRemaining = Number(breakInput.value || 5) * 60;
        updateDisplay(timerRemaining);
        toggleButtons();
    }
});

function saveStats() {
    try {
        localStorage.setItem("completedSessions", String(completedSessions));
        localStorage.setItem("totalTime", String(totalTime));
        localStorage.setItem("Totalstreaks", String(Totalstreaks));
    } catch (error) {
        console.warn("Unable to save Pomodoro stats:", error);
    }
}

function loadStats() {
    completedSessions = readStat("completedSessions", 0);
    totalTime = readStat("totalTime", 0);
    Totalstreaks = readStat("Totalstreaks", 0);
}

function updateStats() {
    if (completedSessionsDisplay) {
        completedSessionsDisplay.textContent = completedSessions;
    }
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);

    if (TotaltimeDisplay) {
        TotaltimeDisplay.textContent = `${hours}h ${minutes}m`;
    }
    if (TotalstreaksDisplay) {
        TotalstreaksDisplay.textContent = Totalstreaks;
    }
}


function startTimer() {
    if (isRunning) return;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    if (timerRemaining === null || timerRemaining <= 0) {
        timerRemaining = getCurrentDuration();
    }

    isRunning = true;

    const sessionDuration = timerRemaining;

    timerInterval = setInterval(() => {
        if (timerRemaining <= 0) {
            if (alarmSound && typeof alarmSound.play === "function") {
                alarmSound.play();
            }
            clearInterval(timerInterval);
            isRunning = false;

            if (isWorkTime) {
                completedSessions++;
                totalTime += sessionDuration;
                Totalstreaks++;
                saveStats();

        
            }


            isWorkTime = !isWorkTime;
            timerRemaining = getCurrentDuration();
            updateStats();
            updateDisplay(timerRemaining);
            addZoomEffect();
            toggleButtons();
            return;
        }

        timerRemaining--;
        updateDisplay(timerRemaining);
        addZoomEffect();
    }, 1000);

    toggleButtons();
}

function pauseTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    toggleButtons();
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    isWorkTime = true;
    timerRemaining = Number(workInput.value || 25) * 60;
    updateDisplay(timerRemaining);
    if (timerDisplay && timerDisplay.style) {
        timerDisplay.style.color = "black";
    }
    toggleButtons();
}

function updateDisplay(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const sec = safeSeconds % 60;

    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }
}

function toggleButtons() {
    if (startButton) startButton.disabled = isRunning;
    if (pauseButton) pauseButton.disabled = !isRunning;
    if (resetButton) resetButton.disabled = timerRemaining === null || (!isRunning && timerRemaining === 0);
}

loadStats();
if (timerRemaining === null) {
    timerRemaining = Number(workInput.value || 25) * 60;
}
updateDisplay(timerRemaining);
updateStats();
toggleButtons();

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);





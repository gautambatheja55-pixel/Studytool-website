let timerDisplay = document.getElementById("timer") || document.querySelector(".timer");
let startButton = document.getElementById("start") || document.querySelector(".start");
let resetButton = document.getElementById("reset");
let pauseButton = document.getElementById("pause");
let workInput = document.getElementById("work-time");
let breakInput = document.getElementById("break-time");
let roundInput = document.getElementById("round-count");
let alarmSound = document.getElementById("beep-sound");

const timerModeDisplay = document.getElementById("timer-mode");
const completedSessionsDisplay = document.getElementById("completedSessions");
const TotaltimeDisplay = document.getElementById("Totaltime");
const TotalstreaksDisplay = document.getElementById("Totalstreaks");

let isRunning = false;
let isWorkTime = true;
let timerInterval = null;
let timerRemaining = null;
let completedSessions = 0;
let totalTime = 0;
let Totalstreaks = 0;
let totalRounds = 1;
let currentRoundCount = 0;

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
    return Math.max(1, minutes) * 60;
}

function getRoundLimit() {
    return Math.max(1, Number(roundInput?.value || 1));
}

function addZoomEffect() {
    if (timerDisplay && timerDisplay.classList) {
        timerDisplay.classList.add("timer-zoom");
        setTimeout(() => timerDisplay.classList.remove("timer-zoom"), 200);
    }
}

function updateModeText() {
    if (!timerModeDisplay) return;

    if (isWorkTime) {
        timerModeDisplay.textContent = "Work Mode";
        timerModeDisplay.style.color = "#ff9800";
    } else {
        timerModeDisplay.textContent = "Rest Mode";
        timerModeDisplay.style.color = "#4caf50";
    }
}

workInput.addEventListener("input", () => {
    if (!isRunning) {
        isWorkTime = true;
        timerRemaining = Number(workInput.value || 25) * 60;
        updateModeText();
        updateDisplay(timerRemaining);
        toggleButtons();
    }
});

breakInput.addEventListener("input", () => {
    if (!isRunning) {
        isWorkTime = false;
        timerRemaining = Number(breakInput.value || 5) * 60;
        updateModeText();
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

    totalRounds = getRoundLimit();

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (timerRemaining === null || timerRemaining <= 0) {
        timerRemaining = getCurrentDuration();
    }

    isRunning = true;
    const sessionDuration = timerRemaining;

    timerInterval = setInterval(() => {
        if (timerRemaining <= 1) {
            clearInterval(timerInterval);
            timerInterval = null;

            if (alarmSound && typeof alarmSound.play === "function") {
                alarmSound.play();
            }

            if (isWorkTime) {
                completedSessions++;
                totalTime += sessionDuration;
                Totalstreaks++;
                currentRoundCount++;
                saveStats();
            }

            if (isWorkTime && currentRoundCount >= totalRounds) {
                isWorkTime = true;
                currentRoundCount = 0;
                timerRemaining = Number(workInput.value || 25) * 60;
                updateModeText();
                updateStats();
                updateDisplay(timerRemaining);
                if (timerDisplay && timerDisplay.style) {
                    timerDisplay.style.color = "black";
                }
                isRunning = false;
                toggleButtons();
                return;
            }

            isWorkTime = !isWorkTime;
            timerRemaining = getCurrentDuration();
            updateModeText();
            if (timerDisplay && timerDisplay.style) {
                timerDisplay.style.color = isWorkTime ? "black" : "#4caf50";
            }
            updateStats();
            updateDisplay(timerRemaining);
            addZoomEffect();
            isRunning = false;
            toggleButtons();
            startTimer();
            return;
        }

        timerRemaining -= 1;
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
    currentRoundCount = 0;
    timerRemaining = Number(workInput.value || 25) * 60;
    updateDisplay(timerRemaining);
    if (timerDisplay && timerDisplay.style) {
        timerDisplay.style.color = "black";
    }
    updateModeText();
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
updateModeText();
updateDisplay(timerRemaining);
updateStats();
toggleButtons();

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);


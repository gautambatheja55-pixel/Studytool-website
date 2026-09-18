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

function startTimer() {
    if (isRunning) return;

    if (timerRemaining === null || timerRemaining <= 0) {
        timerRemaining = getCurrentDuration();
    }

    isRunning = true;
    timerInterval = setInterval(() => {
        if (timerRemaining <= 0) {
            if (alarmSound && typeof alarmSound.play === "function") {
                alarmSound.play();
            }
            clearInterval(timerInterval);
            isRunning = false;
            isWorkTime = !isWorkTime;
            timerRemaining = getCurrentDuration();
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
    toggleButtons();
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
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

if (timerRemaining === null) {
    timerRemaining = Number(workInput.value || 25) * 60;
}
updateDisplay(timerRemaining);
toggleButtons();

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);



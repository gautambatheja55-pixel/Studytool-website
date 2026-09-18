const timer = document.getElementById('timer');
const start = document.getElementById('start');
const reset = document.getElementById('reset');
const pause = document.getElementById('pause');


let time = 25 * 60;
let interval;

start.addEventListener('click', () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timer.innerHTML = 
`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

});

const StartTimer = () => {
    interval = setInterval(() => {
        time--;
        updateTimer();

        if (time === 0) {
            clearInterval(interval);
            alert("Time's up! Take a break.");
            time = 25 * 60;
            updateTimer();

        }
    }, 1000);

}

const PauseTimer = () => clearInterval(interval);

const ResetTimer = () => {
    clearInterval(interval);
    time = 25 * 60;

};



start.addEventListener("click", StartTimer);
pause.addEventListener("click", PauseTimer);
reset.addEventListener("click", ResetTimer);





    





    
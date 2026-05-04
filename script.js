const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");


// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <=9) {
        time = '0' + time;
    }
    return time;
}


// Run a standard minute/second/hundredths timer:
var timer = [0, 0, 0, 0];
var timerInterval;
var timerRunning = false;

function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerText = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60); // minutes
    timer[1] = Math.floor(timer[3] / 100) - (timer[0] * 60); // seconds
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000)); // hundredths
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    var input = testArea.value;
    if(input === originText) {
        clearInterval(timerInterval);
        timerRunning = false;
        testWrapper.style.borderColor = "green";
    }
    else if(input === originText.substring(0, input.length)) {
        testWrapper.style.borderColor = "blue";
    }
    else {
        testWrapper.style.borderColor = "red";
    }
}


// Start the timer:
function startTimer() {
    if(!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset() {
    clearInterval(timerInterval);
    timerRunning = false;
    timer = [0, 0, 0, 0];
    theTimer.innerHTML = "00:00:00";
    testArea.value = "";
    testWrapper.style.borderColor = "grey";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keyup", startTimer);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);


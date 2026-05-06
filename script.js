const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
let originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var textArr = [
    "The quick brown fox jumps over the lazy dog.",
    "When life is slow, put your head down and work.",
    "If you love your job, you'll never have to work a day in your life.",
    "It's not about the destination, it's about the journey.",
    "The sun always shines brightest after the rain."
];

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <= 9) {
        time = '0' + time;
    }
    return time;
}

var errorCount = 0;
var isError = false;

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

    let totalSeconds = timer[3] / 100;

    if (totalSeconds > 0) {
        let wpm = (testArea.value.length / 5) / (totalSeconds / 60);
        document.querySelector("#wpm").innerText = Math.round(wpm);
    }
}


// Match the text entered with the provided text on the page:
function spellCheck() {
    var input = testArea.value;


    // update color of border based on progress/state of typing, change error state
    if (input === originText) {
        clearInterval(timerInterval);
        timerRunning = false;
        testWrapper.style.borderColor = "green";
        saveScore();
        isError = false;
    }
    else if (input === originText.substring(0, input.length)) {
        testWrapper.style.borderColor = "blue";
        isError = false;
    }
    else {
        testWrapper.style.borderColor = "red";

        // error logic only when not finished
        if (isError === false) {
            errorCount++;
            document.querySelector("#error-counter").innerText = errorCount;
            isError = true;
        }
    }
}

function saveScore() {
    var savedScoresStr = localStorage.getItem('typingScores');
    var savedScoresArr;

    if (savedScoresStr === null) {
        savedScoresArr = [];
    }
    else {
        savedScoresArr = JSON.parse(savedScoresStr);
    }
    let currentScore = {
        timeString: theTimer.innerText,
        rawTime: timer[3]
    };

    savedScoresArr.push(currentScore);
    savedScoresArr.sort(function (a, b) {
        if (a.rawTime < b.rawTime) {
            return -1;
        }
        else if (a.rawTime > b.rawTime) {
            return 1;
        }
        else {
            return 0;
        }
    });

    savedScoresArr = savedScoresArr.slice(0, 3);
    localStorage.setItem('typingScores', JSON.stringify(savedScoresArr));

    displayScores();
}

function displayScores() {
    const topScoresList = document.getElementById("top-scores");
    var savedScoresString = localStorage.getItem('typingScores');
    var savedScoresArr;

    if (savedScoresString === null) {
        savedScoresArr = [];
    }
    else {
        savedScoresArr = JSON.parse(savedScoresString);
    }
    topScoresList.innerHTML = "";

    savedScoresArr.forEach(function (score) {
        let li = document.createElement('li');
        li.innerText = score.timeString;
        topScoresList.appendChild(li);
    });
}


// Start the timer:
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(runTimer, 10);
    }
}

// shuffle thru array of texts to display
function typingText() {
    var randomIndex = Math.floor(Math.random() * textArr.length);
    var newText = textArr[randomIndex];

    document.querySelector("#origin-text p").innerHTML = newText;
    originText = newText;

}

// Reset everything:
function reset() {
    clearInterval(timerInterval);
    timerRunning = false;
    timer = [0, 0, 0, 0]; // reset timer
    theTimer.innerHTML = "00:00:00";
    testArea.value = ""; // clear textbox
    testWrapper.style.borderColor = "grey"; // reset border
    typingText();

    errorCount = 0;
    isError = false;
    document.querySelector("#error-counter").innerText = "0";
    document.querySelector("#wpm").innerText = "0";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keyup", startTimer);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);

displayScores();
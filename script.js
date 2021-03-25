// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const maxLength = 8;
const min = 1;
const max = 5;
// Sound Synthesis Functions

//Global Variables
let clueHoldTime = null; //how long to hold each clue's light/sound
var timeLeft = null; // need to set at 15s
let pattern = [];
let progress = null;
let gamePlaying = false;
let guessCounter = null;
let tonePlaying = false;
let volume = 0.5; //must be between 0.0 and 1.0
let playerMistakes = null;
let guessWrong = false;

//Page Initialization

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playSound(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  timeLeft = 15;
  document.getElementById("countdown").innerHTML = timeLeft;

  let delay = nextClueWaitTime; //set delay to initial wait time

  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    clueHoldTime -= 25;
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }

  /*for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far

    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue

    if (progress === guessCounter && progress > 0) {
      clueHoldTime -= 25;
      delay += clueHoldTime;
      delay += cluePauseTime;
    }
  }
  */

  // could not get the timer to work correctly
  /*let timers = setTimeout(function guessTimer() {
    let range = setInterval(function() {
      if (timeLeft <= 0) {
        document.getElementById("countdown").innerHTML = 0;
        clearInterval(range);

        
      } else {
        console.log("inside:" + delay);
        console.log("inside:" + timeLeft);
        document.getElementById("countdown").innerHTML = timeLeft;
      }
      timeLeft -= 1;
    }, 1000);
  }, delay);*/
}

function playSound(btn) {
  let audio = new Audio(document.getElementById("button" + btn + "_audio").src);
  audio.play();
  tonePlaying = true;
}

function pauseSound(btn) {
  let audio = new Audio(document.getElementById("button" + btn + "_audio").src);
  audio.pause();
  tonePlaying = false;
}
function startGame() {
  //initialize game variables
  clueHoldTime = 1000;
  progress = 0;
  playerMistakes = 0;
  gamePlaying = true;
  fillPatternArray();
  document.getElementById("guesses").innerHTML = playerMistakes;

  // swap the Start and Stop buttons
  document.getElementById("startButton").classList.add("hidden");
  document.getElementById("stopButton").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  //set game variables to end game state
  gamePlaying = false;
  pattern = [];
  document.getElementById("guesses").innerHTML = 0;
  document.getElementById("countdown").innerHTML = 15;
  // swap the Start and Stop buttons
  document.getElementById("startButton").classList.remove("hidden");
  document.getElementById("stopButton").classList.add("hidden");
}

function loseGame() {
  stopGame();
  let audio = new Audio(document.getElementById("error_audio").src);
  audio.play();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won, traveler!");
}

function guess(btn) {
  //console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  // add game logic here
  if (btn === pattern[guessCounter]) {
    if (guessCounter < progress) {
      guessCounter++;
    } else {
      if (guessCounter < pattern.length - 1) {
        progress++;
        playClueSequence();
      } else {
        winGame();
      }
    }
  } else {
    if (playerMistakes < 2) {
      ++playerMistakes;
      document.getElementById("guesses").innerHTML = playerMistakes;

      document.querySelector("body").classList.add("game-over");
      setTimeout(function() {
        document.querySelector("body").classList.remove("game-over"), 3000;
        let audio = new Audio(document.getElementById("error_audio").src);
        audio.play();
      });

      if (guessCounter < pattern.length - 1) {
        playClueSequence();
      }
    } else {
      loseGame();
    }
  }
}

// from Mozilla Developer Network on Random Numbers
function fillPatternArray() {
  for (let i = 0; i < maxLength; i++) {
    pattern.push(Math.floor(Math.random() * (max - min + 1) + min));
  }
}

// older code
// Sound Synthesis Functions
/*const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
};

// Init Sound Synthesizer
/*
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
*/

/*function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}*/

/*function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}*/

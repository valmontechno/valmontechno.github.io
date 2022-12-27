window.addEventListener("beforeunload", function (e) {
  e.returnValue = '\o/';
  return '\o/';
});

const playerDisplay = document.getElementById('player');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const restartButton = document.getElementById('restart');
const fullscreenButton = document.getElementById('fullscreen');
const spinnerCircle = document.getElementById('spinner-circle');
const spinnerProgressBar = spinnerCircle.lastElementChild;

spinnerCircle.parentNode.addEventListener('click', start);
spinnerCircle.parentNode.addEventListener('contextmenu', start);
startButton.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
restartButton.addEventListener('click', restart);
fullscreenButton.addEventListener('click', fullscreen);

const LAP_DURATION = 60;
let players = [];
let lap = 0;
let time = 0;
let paused = true;
let timeout;

const alarmSound = new Audio('sounds/not-kiddin.mp3');
alarmSound.loop = true;
const finishSound = new Audio('sounds/done-for-you.mp3');
spinnerProgressBar.style.animationDuration = LAP_DURATION + 's';

function addSecond() {
    time--;
    timeDisplay.textContent = time;
	if(time > 0) {
		if(time <= LAP_DURATION / 2)
			startButton.className = 'icon-hourglass-half';
		else
			startButton.className = 'icon-hourglass';
		timeout = setTimeout(addSecond, 1000);
	} else {
		startButton.className = 'icon-hourglass-end';
		pauseButton.className = 'icon-mute';
		alarmSound.currentTime = 0;
		alarmSound.play();
		spinnerCircle.setAttribute('class', 'finish');
	}
}

function start(e) {
	e.preventDefault();
	alarmSound.pause();
	finishSound.currentTime = 0;
	finishSound.play();
	spinnerCircle.setAttribute('class', 'not-animed');
	setTimeout(function() {
		spinnerCircle.setAttribute('class', 'animed');
	}, 0);
	spinnerProgressBar.removeAttribute('class');
	timeDisplay.removeAttribute('class');
	startButton.className = 'animated-hourglass';
	restartButton.removeAttribute('disabled');
	pauseButton.removeAttribute('disabled');
	pauseButton.className = 'icon-pause';
	paused = false;
	lap++;
	time = LAP_DURATION;
    playerDisplay.textContent = players[(lap-1) % players.length];
	timeDisplay.textContent = time;
	clearTimeout(timeout);
	timeout = setTimeout(addSecond, 1000);
}

function pause() {
	if(time == 0) {
		alarmSound.pause();
		pauseButton.setAttribute('disabled', '');
	} else {
		paused = !paused;
		if(paused) {
			clearTimeout(timeout);
			pauseButton.className = 'icon-start';
			spinnerCircle.removeAttribute('class');
		} else {
			timeout = setTimeout(addSecond, 1000);
			pauseButton.className = 'icon-pause';
			restartButton.removeAttribute('disabled');
			spinnerCircle.setAttribute('class', 'animed');
		}
	}
}

function restart() {
	alarmSound.pause();
	restartButton.setAttribute('disabled', '');
	pauseButton.className = 'icon-start';
	pauseButton.removeAttribute('disabled');
	startButton.className = 'animated-hourglass';
	spinnerCircle.setAttribute('class', 'not-animed');
	spinnerProgressBar.style.strokeDashoffset = 0;
	setTimeout(function() {
		startButton.className = 'icon-hourglass';
	}, 1000);
	paused = true;
	clearTimeout(timeout);
	time = LAP_DURATION;
    timeDisplay.textContent = time;
}

function fullscreen() {
	if(!document.fullscreenElement)
		document.documentElement.requestFullscreen();
	else if (document.exitFullscreen)
		document.exitFullscreen();

}

function editFullscreenButton() {
	if(!document.fullscreenElement)
		fullscreenButton.className = 'icon-expand';
	else if (document.exitFullscreen)
		fullscreenButton.className = 'icon-compress';
}

document.documentElement.addEventListener('fullscreenchange', editFullscreenButton);
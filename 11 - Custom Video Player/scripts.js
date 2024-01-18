const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const controls = player.querySelector('.player__controls');
const progressBar = controls.querySelector('.progress');
const progressBarFilled = progressBar.querySelector('.progress__filled');
const playBtn = controls.querySelector('.player__button');
const sliders = controls.querySelectorAll('input[type="range"]');
const skipBtns = controls.querySelectorAll('[data-skip]');
const fullscreen = controls.querySelector('[data-function="fullscreen"]');

const updateProgressBar = e => {
	const percent = (video.currentTime / video.duration) * 100;
  progressBarFilled.style.flexBasis = `${percent}%`;
};

const togglePlay = e => {
	if (video.paused) {
		video.play();
		playBtn.textContent = "\u23F8";
	}
	else {
		video.pause();
		playBtn.textContent = "\u23F5"
	}
};

const handleSliderChange = e => {
 video[e.target.name] = e.target.value;
};

const skip = e => {
	const interval = parseInt(e.target.getAttribute('data-skip'));
	const inRange = video.currentTime + interval >= 0 || 
		video.currentTime + interval < video.duration;

	if (inRange) {
		video.currentTime += interval;
	} else {
		video.currentTime = (interval > 0) ? video.duration : 0;
	}
};

const seek = e => {
	video.currentTime = (video.duration / progressBar.offsetWidth) * e.offsetX;
	updateProgressBar(null);
};

const toggleFullscreen = e => {
	console.dir(video);
	video.webkitEnterFullscreen();
}

let dragging = false;
progressBar.addEventListener('click', seek);
progressBar.addEventListener('mousemove', (e) => dragging && seek(e));
progressBar.addEventListener('mousedown', () => dragging = true);
progressBar.addEventListener('mouseup', () => dragging = false);
video.addEventListener('play', updateProgressBar);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgressBar);
playBtn.addEventListener('click', togglePlay);
sliders.forEach(range => range.addEventListener('change', handleSliderChange));
skipBtns.forEach(btn => btn.addEventListener('click', skip));
fullscreen.addEventListener('click', () => {
	if (video.requestFullscreen) video.requestFullscreen();
	else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
	else if (video.msRequestFullScreen) video.msRequestFullScreen(); 
	else console.warn('Fullscreen not supported in this browser.')
});
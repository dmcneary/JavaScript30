const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const controls = player.querySelector('.player__controls');
const progressBar = controls.querySelector('.progress');
const progressBarFilled = progressBar.querySelector('.progress__filled');
const playBtn = controls.querySelector('.player__button');
const volumeCtl = controls.querySelector('input[name="volume"]');
const rateCtl = controls.querySelector('input[name="playbackRate"]');
const skipBackBtn = controls.querySelector('button[data-skip="-10"]');
const skipForwardBtn = controls.querySelector('button[data-skip="25"]');

const updateProgressBar = e => {
	const percent = (video.currentTime / video.duration) * 100;
  progressBarFilled.style.flexBasis = `${percent}%`;
};

const togglePlay = e => {
	if (video.paused) {
		video.play();
		playBtn.textContent = "||";
	}
	else {
		video.pause();
		playBtn.textContent = "►"
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

let dragging = false;
progressBar.addEventListener('click', seek);
progressBar.addEventListener('mousemove', (e) => dragging && seek(e));
progressBar.addEventListener('mousedown', () => dragging = true);
progressBar.addEventListener('mouseup', () => dragging = false);
video.addEventListener('play', updateProgressBar);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgressBar);
playBtn.addEventListener('click', togglePlay);
volumeCtl.addEventListener('change', handleSliderChange);
rateCtl.addEventListener('change', handleSliderChange);
skipBackBtn.addEventListener('click', skip);
skipForwardBtn.addEventListener('click', skip);
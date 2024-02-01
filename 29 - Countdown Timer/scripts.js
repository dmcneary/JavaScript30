const controls = document.querySelectorAll('button.timer__button');
const minutesForm = document.querySelector('#custom');
const timer = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
let countdownInterval;

const countdownEnd = end => {
	end.style.color = 'red';
	end.style.transform = 'scale(2)';
	end.style.transition = 'transform 0.5s ease-in-out';
}

const parseTime = time => {
	const hrs = time >= 3600 ? ~~(time / 3600) : 0;
	const mins = time - (3600 * hrs) >= 60 ? ~~((time - hrs) / 60) : 0;
	const secs = time - (3600 * hrs) - (60 * mins);
	return [hrs, mins, secs];
}

const setReturnTime = time => {
	const hrs = time.getHours() > 12 ? time.getHours() - 12: time.getHours();
	const mins = time.getMinutes();
	endTime.textContent = `Be back at ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

const setCountdownTimer = time => {
	clearInterval(countdownInterval);
	let [hrs, mins, secs] = time;

	const tick = () => {
		if (secs > 0) {
			secs--;
		} else if (secs === 0 && mins > 0) {
			secs = 59;
			mins--;
		} else if (hrs > 0) {
			secs = mins = 59;
			hrs--;
		} else {
			clearInterval(countdownInterval);
			countdownEnd(endTime);
		}

		timer.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	countdownInterval = setInterval(() => tick(), 1000)
}

const setTimer = time => {
	document.querySelector('h2.notice').style.display = 'none';
	const countdown = parseTime(time);
	const deadline = new Date(Date.now() + (time * 1000));

	setCountdownTimer(countdown);
	setReturnTime(deadline);
}

const setCustomTimer = e => {
	e.preventDefault();

	const minutes = ~~(+e.target.minutes.value);
	setTimer(minutes * 60);

	e.target.reset();
}

controls.forEach(control => control.addEventListener('click', e => setTimer(e.target.dataset.time)))
minutesForm.addEventListener('submit', setCustomTimer)
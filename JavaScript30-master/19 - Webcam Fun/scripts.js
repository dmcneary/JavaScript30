const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const controls = document.querySelector('.controls');
const rgbRanges = controls.querySelectorAll('.rgb input');
const alphaRange = controls.querySelector('.alphaLayer input');

let width, height;

const getWebcam = async () => {
	let stream = null;

	try {
		stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video.srcObject = stream;
		video.play();
	} catch (err) {
		console.error(err);
	}
};

const redEffect = pixels => {
	const { data } = pixels;
	for (let i = 0; i < data.length; i += 4) {
		data[i] += 100;
		data[i + 1] -= 50;
		data[i + 2] *= 0.5; 
	}

	return pixels;
};

const rgbSplit = pixels => {
	const { data } = pixels;
	for (let i = 0; i < data.length; i += 4) {
		data[i - 150] = data[i];
		data[i + 100] = data[i + 1];
		data[i - 50] = data[i + 2]; 
	}

	return pixels;
};

const greenScreen = pixels => {
	const levels = {};
	const { data } = pixels;

	rgbRanges.forEach(input => levels[input.name] = input.value);
	for (let i = 0; i < data.length; i += 4) {
		const red = data[i + 0],
    	green = data[i + 1],
    	blue = data[i + 2];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // console.log('take it out');
      data[i + 3] = 0;
    }
	}
}

const alphaAdjust = () => {
	if (modes.alphaAdjust.state) ctx.globalAlpha = alphaRange.value;
}

const modes = {
	redEffect: {
		state: false,
		func: redEffect
	},
	rgbSplit: {
		state: false,
		func: rgbSplit
	},
	greenScreen : {
		state: false,
		func: greenScreen
	},
	alphaAdjust: {
		state: false,
		func: alphaAdjust
	}
}

const toggleRedEffect = () => modes.redEffect.state = !modes.redEffect.state;
const toggleRgbSplit = () => modes.rgbSplit.state = !modes.rgbSplit.state;
const toggleGreenScreen = () => modes.greenScreen.state = !modes.greenScreen.state;
const toggleAlphaEffect = () => modes.alphaAdjust.state = !modes.alphaAdjust.state;

const paintToCanvas = () => {
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		let pixels = ctx.getImageData(0, 0, width, height);

		for (const [mode, settings] of Object.entries(modes)) {
			if (settings.state) settings.func(pixels);
		}
		if (!modes.alphaAdjust.state) ctx.globalAlpha = 1;
		ctx.putImageData(pixels, 0, 0);
	}, 16);
};

const takePhoto = () => {
	snap.currentTime = 0;
	snap.play();

	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'Photo Booth Image');
	link.innerHTML = `<img src="${data}" alt="Photo Booth Image" />`;
	strip.insertBefore(link, strip.firstChild);
}

video.addEventListener('canplay', () => {
	width = video.videoWidth;
	height = video.videoHeight;
	paintToCanvas();
});

getWebcam();
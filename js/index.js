document.addEventListener('DOMContentLoaded', function () {
	var ajaxReader = new GameboyJS.RomAjaxReader();
	var canvas = document.getElementById('gameboy-screen');

	var gameboy = new GameboyJS.Gameboy(canvas, {
		romReaders: [ajaxReader]
	});

	ajaxReader.loadFromUrl('/roms/off-orbit.gb');

	document.getElementById('mute').addEventListener('change', function (e) {
		if (this.checked) {
			gameboy.cpu.apu.disconnect();
		} else {
			gameboy.cpu.apu.connect();
		}
	});

	// Prevent the default action for space and arrow keys to stop scrolling while playing
	window.addEventListener('keydown', function(e) {
		if ([32, 37, 38, 39, 40].indexOf(e.keyCode) >= 0) {
			e.preventDefault();
		}
	}, false);

	var keys = {
		START: false,
		SELECT: false,
		B: false,
		A: false,
		DOWN: false,
		UP: false,
		LEFT: false,
		RIGHT: false
	};

	function createButtonListener(key) {
		var id = 'button-' + key.toLowerCase();
		var buttonEl = document.getElementById(id);

		buttonEl.addEventListener('mousedown', function () {
			if (keys[key]) {
				return;
			}

			keys[key] = true;
			gameboy.input.pressKey(key);
			buttonEl.classList.add('gameboy-button__pulse');

			setTimeout(function () {
				buttonEl.classList.remove('gameboy-button__pulse');
				gameboy.input.releaseKey(key);
				keys[key] = false;
			}, 50);
		});
	}

	var keysKeys = Object.keys(keys);
	for (var i = 0; i < keysKeys.length; i++) {
		createButtonListener(keysKeys[i]);
	}
});
/* Mouse over button effects*/
document.addEventListener('DOMContentLoaded', function() {

	var socialButton = document.getElementsByClassName('social-button');
		for(var i = 0; i < socialButton.length; i++) {
			socialButton[i].onmouseover = function() {
				this.style.opacity = '1';
			}
			socialButton[i].onmouseout = function() {
				this.style.opacity = '0.7';
			}
		}
			
});


/* Bitrate switcher*/
document.addEventListener('DOMContentLoaded', function() {

	var parent = document.getElementById('bitrate-switcher');
	var bitrateButton = document.getElementsByClassName('bitrate-button');
				for (var i = 0; i < bitrateButton.length; i++) {
					bitrateButton[i].onclick = function() {
						this.setAttribute('class', 'active');
					}
				}
});

/* Play-stop button*/
function togglePlayer() {
	var playButton = document.getElementById('play-stop');
	  if (playButton.className == 'stopped') {
	   playButton.className = 'played';}

	  else if(playButton.className == 'played') {
	   playButton.className = 'stopped';}
}



/* Volume slider */
$(function() {

	var slider = $('#slider');
	var	tooltip = $('.tooltip');

	tooltip.hide();

	slider.slider({
		range: "min",
		min: 1,
		value: 35,

		start: function(event,ui) {
		  tooltip.fadeIn('fast');
		},

		slide: function(event, ui) {

			var value = slider.slider('value'),
				volume = $('.volume');

			tooltip.css('left', value).text(ui.value);

			if(value <= 5) {
				volume.css('background-position', '0 0');
			}
			else if (value <= 25) {
				volume.css('background-position', '0 -25px');
			}
			else if (value <= 75) {
				volume.css('background-position', '0 -50px');
			}
			else {
				volume.css('background-position', '0 -75px');
			};

		},

		stop: function(event,ui) {
		  tooltip.fadeOut('fast');
		},
	});

});
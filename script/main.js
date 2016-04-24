document.addEventListener('DOMContentLoaded', function() {
	
	var links = document.getElementsByTagName('a');
	var i;
	for (i = 0; i < links.length; ++i) {
		links[i].onmouseover = function() {
			this.setAttribute('class', 'uppercase');
		}
		links[i].onmouseout = function() {
			this.removeAttribute('class', 'uppercase');
		}
	}

});

/* VOLUME SLIDER */

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
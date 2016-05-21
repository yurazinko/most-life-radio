/* Mouseover button effects*/
document.addEventListener('DOMContentLoaded', function() {

    var socialButton = document.getElementsByClassName('hover');
    for (var i = 0; i < socialButton.length; i++) {
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
    var bitrateButton = document.getElementsByClassName('bitrate-button');
    for (var i = 0; i < bitrateButton.length; i++) {
        bitrateButton[i].onclick = function() {
            /* write function here */
        }
    }
});

/* Play-stop button*/
function togglePlayer() {
    var playButton = document.getElementById('play-stop');
    if (playButton.className == 'stopped') {
        playButton.className = 'played';
    } else if (playButton.className == 'played') {
        playButton.className = 'stopped';
    }
}

/* Left pop-up window */
function togglePopUpLeft() {
    var popUpButton = document.getElementById('left-popup');

    if (popUpButton.className == 'popup-hidden') {
        popUpButton.classList.remove('popup-hidden');
        popUpButton.classList.add('popup-visible');
    } else if (popUpButton.className == 'popup-visible') {
        popUpButton.classList.remove('popup-visible');
        popUpButton.classList.add('popup-hidden');
    }
}

/* Right pop-up windows */
function togglePopUpFb() {
    var fbWindow = document.getElementById('fb-popup');
    var vkWindow = document.getElementById('vk-popup');

    if (fbWindow.className == 'popup-hidden') {
        vkWindow.classList.remove('popup-visible');
        vkWindow.classList.add('popup-hidden');
        fbWindow.classList.remove('popup-hidden');
        fbWindow.classList.add('popup-visible');
    } else if (fbWindow.className == 'popup-visible') {
        fbWindow.classList.remove('popup-visible');
        fbWindow.classList.add('popup-hidden');
    }
}

function togglePopUpVk() {
    var fbWindow = document.getElementById('fb-popup');
    var vkWindow = document.getElementById('vk-popup');

    if (vkWindow.className == 'popup-hidden') {
        fbWindow.classList.remove('popup-visible');
        fbWindow.classList.add('popup-hidden');
        vkWindow.classList.remove('popup-hidden');
        vkWindow.classList.add('popup-visible');
    } else if (vkWindow.className == 'popup-visible') {
        vkWindow.classList.remove('popup-visible');
        vkWindow.classList.add('popup-hidden');
    }
}

/*On-air description switcher*/
document.addEventListener('DOMContentLoaded', function() {
    var generalDate = new Date();
    var dayOfWeek = generalDate.getDay();
    var hour = generalDate.getHours();
    var minute = generalDate.getMinutes();
    var specificTime = dayOfWeek.toString() + ',' + hour.toString();
    console.info('Current day and hour is: ' + specificTime);
    console.info('Current minute is: ' + minute);
    var currentProgTitle = document.getElementById('program-title');
    var currentProgAuthor = document.getElementById('program-author');
    var currentProgDesc = document.getElementById('program-description');

    switch (specificTime) {
        case '1,12':
        case '3,12':
            if (minute >= 30) {
                currentProgTitle.innerHTML = 'Музичний Мармеляд';
                currentProgAuthor.innerHTML = 'Стефцьо і Ромцьо';
            }
            break;
            
        case '1,16':
        case '3,16':
	        currentProgTitle.innerHTML = 'Вільна Кава';
	        currentProgAuthor.innerHTML = 'Наталя';
	        break;
	    case '1,18':
		    currentProgTitle.innerHTML = 'Мостиські Набутки';
		    currentProgAuthor.innerHTML = 'Олег Макар';
		    break;
		case '2,16':
			currentProgTitle.innerHTML = 'Теорія Успіху';
			currentProgAuthor.innerHTML = 'Павло Тарчанин';
			break;
		case '2,17':
			currentProgTitle.innerHTML = 'Психологія';
			currentProgramAuthor.innerHTML = 'Уляна Кубара';
			break;	        
    }

})


/* Volume slider */
$(function() {

    var slider = $('#slider');
    var tooltip = $('.tooltip');

    tooltip.hide();

    slider.slider({
        range: "min",
        min: 1,
        value: 35,

        start: function(event, ui) {
            tooltip.fadeIn('fast');
        },

        slide: function(event, ui) {

            var value = slider.slider('value'),
                volume = $('.volume');

            tooltip.css('left', value).text(ui.value);

            if (value <= 5) {
                volume.css('background-position', '0 0');
            } else if (value <= 25) {
                volume.css('background-position', '0 -25px');
            } else if (value <= 75) {
                volume.css('background-position', '0 -50px');
            } else {
                volume.css('background-position', '0 -75px');
            };

        },

        stop: function(event, ui) {
            tooltip.fadeOut('fast');
        },
    });

});

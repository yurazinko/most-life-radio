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
    if (playButton.className == 'played') {
        playButton.className = 'stopped';
    } else if (playButton.className == 'stopped') {
        playButton.className = 'played';
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

document.addEventListener('DOMContentLoaded', function() {
    var regularPlayer = document.getElementById('controls');
    var altPlayer = document.getElementById('alternative-player');
    var switcher = document.getElementById('player-changer');
    switcher.onclick = function() {
        if (regularPlayer.className == 'player-visible') {
            regularPlayer.classList.remove('player-visible');
            regularPlayer.classList.add('player-hidden');
            altPlayer.classList.remove('player-hidden');
            altPlayer.classList.add('player-visible');
        } else if (regularPlayer.className == 'player-hidden') {
           regularPlayer.classList.remove('player-hidden');
           regularPlayer.classList.add('player-visible');
           altPlayer.classList.remove('player-visible');
           altPlayer.classList.add('player-hidden');
        }
    }

});

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
        case '1,13':
        case '3,12':
        case '3,13':
            currentProgTitle.innerHTML = 'Музичний Мармеляд';
            currentProgAuthor.innerHTML = 'Стефцьо і Ромцьо';
            currentProgDesc.innerHTML = 'Цікаві музичні історії, огляд шоу-бізу та інтерв\'ю з відомими виконавцями міста та району. Все це у розважальній програмі Стефця і Ромця "Музичний мармеляд". Кожного понеділка та середи о 12:30.';
            break;
        case '5,17':
	        currentProgTitle.innerHTML = 'Вільна Кава';
	        currentProgAuthor.innerHTML = 'Наталя';
	        break;
	    case '1,18':
		    currentProgTitle.innerHTML = 'Мостиські Набутки';
		    currentProgAuthor.innerHTML = 'Олег Макар';
		    currentProgDesc.innerHTML = 'Про актуальне, резонансне, невідоме та цікаве в житті нашого міста, влади, мешканців, громадських ініціатив і всіх добрих людиск. Щопонеділка о 18:00 з Олегом Макаром';
		    break;
		case '2,16':
			currentProgTitle.innerHTML = 'Теорія Успіху';
			currentProgAuthor.innerHTML = 'Павло Тарчанин';
			currentProgDesc.innerHTML = 'Що таке успіх? Як його досягнути? Та як це зробили інші? Історії відомих людей, великих брендів, цікаві інтерв\'ю з успішними людьми та тими, хто свій шлях тільки шукає. Про це та багато іншого говоримо у програмі "Теорія успіху". Слухайте нас на Most Live Radio щовівторка та щочетверга о 16:00.';
			break;
		case '2,18':
			currentProgTitle.innerHTML = 'Маленькі Люди';
			currentProgramAuthor.innerHTML = 'Уляна Кубара';
			currentProgDesc.innerHTML = 'Усім тим, хто має вдома непосидька або просто цікавиться вихованням дітей. Навіть якщо у Вас ще не має дітей, не забувайте - Ви чиясь дитина :)';
			break;
		case '3,17':
			currentProgTitle.innerHTML = 'Катрусин Кінозал';
			currentProgramAuthor.innerHTML = 'Катя Гнатовська';
			currentProgDesc.innerHTML = 'Для усіх кіноманів пропонуємо огляд відомих фільмів. Слухайте нас кожної середи та неділі о 17:00.';
			break;
		default: 
			currentProgTitle.innerHTML = 'Non-stop music';
			currentProgAuthor.innerHTML = '';
			currentProgDesc.innerHTML = '';		        
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

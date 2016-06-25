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

    function loadDoc(source) {
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                currentProgTitle.innerHTML = xhttp.responseText;
            }
        };
        xhttp.open('POST', source, true);
        //xhttp.setRequestHeader('Content-type', 'text/html');
        xhttp.send();
    }

    switch (specificTime) {
        case '1,12':
        case '1,13':
        case '3,12':
        case '3,13':
            currentProgTitle.innerHTML = 'Музичний Мармеляд';
            break;
        case '5,17':
	        currentProgTitle.innerHTML = 'Вільна Кава';
	        break;
	    case '1,17':
		    currentProgTitle.innerHTML = 'Мостиські Набутки';
		    break;
		case '2,16':
			currentProgTitle.innerHTML = 'Теорія Успіху';
			break;
		case '2,18':
			currentProgTitle.innerHTML = 'Маленькі Люди';
			break;
		case '3,17':
			currentProgTitle.innerHTML = 'Катрусин Кінозал';
			break;
        case '6,10':
        case '6,11':
        case '6,12':
            loadDoc('programs/test.txt');
            break;
		default: 
			currentProgTitle.innerHTML = 'Non-stop music';		        
    }
})

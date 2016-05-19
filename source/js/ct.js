function dumpObj(obj, parent) {
	for (var i in obj) {
		var str;

		if (parent) {
			str = parent + '.' + 'i' + "\n" + obj[i];
		} else {
			str = i + "\n" + obj[i];
		}

		if (!confirm(str)) {
			return;
		}

		if (typeof obj[i] == "object") {
			if (parent) {
				dumpObj(obj[i], parent + '.' + i);
			} else {
				dumpObj(obj[i], i);
			}
		}
	}
}


Event = Object.extend(Event, {
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
	KEY_BACKSPACE: 8,
	KEY_DELETE: 46,
	KEY_ESC: 27,
	KEY_RETURN: 13,
	KEY_SPACE: 32,

	KEY_ALT: 18,
	KEY_TAB: 9,
	KEY_WINDOWS: 91,
	KEY_CONTEXTMENU: 93,
	KEY_F1: 112,
	KEY_F2: 113,
	KEY_F3: 114,
	KEY_F4: 115,
	KEY_F5: 116,
	KEY_F6: 117,
	KEY_F7: 118,
	KEY_F8: 119,
	KEY_F9: 120,
	KEY_F10: 121,
	KEY_F11: 122,
	KEY_F12: 123,
	KEY_SHIFT: 16,
	KEY_CTRL: 17,

	KEY_HOME: 36,
	KEY_END: 35,
	KEY_PAGEUP: 33,
	KEY_PAGEDOWN: 34,
	KEY_INSERT: 45,
	wheel: function (event) {
		var delta, element, customEvent;
		// normalize the delta
		if (event.wheelDelta) { // IE & Opera
			delta = event.wheelDelta / 120;
		} else {
			if (event.detail) { // W3C
				delta = - event.detail / 3;
			}
		}
		if (delta) {
			delta = Math.round(delta); //Safari Round
			element = event.findElement();
			customEvent = element.fire('mouse:wheel', {delta: delta});
			if (customEvent.stopped) {
				Event.stop(event);
				return false;
			}
		}
	}
});

document.observe('mousewheel', Event.wheel);
document.observe('DOMMouseScroll', Event.wheel);

document.getScrollbarWidth = function() {
	var body = $(document.body);
	var tmpElement = new Element('div');
	body.insert(tmpElement);
	var w1 = tmpElement.getWidth();
	body.setStyle({'overflow': 'hidden'});
	var w2 = tmpElement.getWidth();
	body.setStyle({'overflow': 'auto'});
	var scrollBarWidth = w2 - w1;
	tmpElement.remove();

	return scrollBarWidth;
};

document.setCookie = function(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
};

document.getCookie = function(name) {
    var prefix = name + "=";
    var cookieStartIndex = document.cookie.indexOf(prefix);
    if (cookieStartIndex == -1) {
        return null;
    }
    var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
    if (cookieEndIndex == -1) {
        cookieEndIndex = document.cookie.length;
    }
    return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
};

document.delCookie = function(name, path, domain) {
    if (document.getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "" ) +
            ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
};

Element.addMethods({
	enable: function(element) {
		element.removeClassName('disabled');
	},
	disable: function(element) {
		element.addClassName('disabled');
	},
	offsetRelatedBody: function(element) {
		var layout = element.getLayout();
  		var valueT = 0, valueL = 0;
		do {
			valueT += element.offsetTop  || 0;
			valueL += element.offsetLeft || 0;
			element = element.offsetParent;
			if (element) {
				if (element.nodeName.toUpperCase() === 'BODY') {
					break;
				}
			}
		} while (element);
		valueL -= layout.get('margin-top');
		valueT -= layout.get('margin-left');
		return new Element.Offset(valueL, valueT);
	}
});


function playRadio(radio, bitrate) {
	window.radioWindow = window.open('radio/player#' + radio + '/' + bitrate, 'MostyskaFM', 'width=511,height=116,toolbar=0,resizable=0,scrollbars=0,status=0,location=0');
}
document.setCookie('ct_referer', document.location.href);


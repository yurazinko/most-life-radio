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

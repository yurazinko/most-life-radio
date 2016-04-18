document.addEventListener('DOMContentLoaded', function() {
	
	alert('Hooray! Working! Move cursor to the navigation links and see result!')

	var links = document.getElementsByClassName('navlink');
	var i;
	for (i = 0; i < links.length; ++i) {
		links[i].onmouseover = function() {
			this.setAttribute('class', 'uppercase');
		}
		links[i].onmouseout = function() {
			this.removeAttribute('class', 'uppercase');
		}
	}

}
);

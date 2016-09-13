Ct_Page.windowLoaded(function () {
	var counterElement = $('redirectCounter');
	if (!Object.isElement(counterElement)) {
		return;
	}
	var counterLimit = 0;
	try {
		counterLimit = counterElement.innerHTML.evalJSON(true);
	} catch (ex) {
	}

	var redirectPath = '/';
	try {
		redirectPath = $('redirectLink').readAttribute('href');
	} catch (ex) {
	}

	new PeriodicalExecuter(function (pe) {
		if (counterLimit <= 0) {
			pe.stop();
			document.location.href = redirectPath;
		}
		counterElement.update(counterLimit--);
	}, 1);
});

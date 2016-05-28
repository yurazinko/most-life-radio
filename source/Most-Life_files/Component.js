var Ct_Component_Abstract = Class.create({

	element: null,
	_namespace: null,
	_namespaceEvent: null,

	initialize: function() {
		var methods = [];
		var properties = [];
		if (!Object.isFunction(this.__construct)) {
			methods.push('__construct()');
		}
		if (!Object.isFunction(this._setNamespace)) {
			methods.push('_setNamespace()');
		}
		if (!Object.isFunction(this.refresh)) {
			methods.push('refresh()');
		}
		//		if (Object.isUndefined(this._namespace)) {
		//			properties.push('namespace');
		//		}
		var exceptions = [];
		if (methods.length == 1) {
			exceptions.push('Abstract method ' + methods[0] + ' must be implemented');
		} else {
			if (methods.length > 1) {
				exceptions.push('Abstract methods [' + methods.length + ']: ' + methods.join(', ') + ' must be implemented');
			}
		}
		if (properties.length == 1) {
			exceptions.push('Abstract property ' + properties[0] + ' must be defined');
		} else {
			if (properties.length > 1) {
				exceptions.push('Abstract properties [' + properties.length + ']: ' + properties.join(', ') + ' must be defined');
			}
		}
		if (exceptions.length > 0) {
			throw exceptions.join('. ');
		}

		this.element = $(document.body);
		this._setNamespace();

		this.__construct();
	},

	isOwner: function(ident) {
		return Object.isElement(this.element.down('#' + ident + '.' + this._namespace));
	},

	_makeConfig: function(element, isSave) {
		var configElement, config, tdModifier;

		if (!Object.isElement(element)) {
			throw this._namespace + ': _makeConfig - invalid Element';
		}

		config = {};
		tdModifier = element.tagName.toLowerCase() == 'tr' ? 'td > ' : '';
		configElement = element.down('> ' + tdModifier + '.ctConfig');
		if (!Object.isElement(configElement)) {
			return config;
		}

		try {
			config = configElement.innerHTML.evalJSON(true);
			if (!isSave) {
				Element.remove(configElement);
			}
		} catch (ex) {
		}

		return config;
	},

	_markAsAssembled: function(element, childInvoke) {
		childInvoke = childInvoke || '';
		element.store(this._namespace + '-isAssembled' + childInvoke, true);
	},

	isAssembled: function(element, childInvoke) {
		childInvoke = childInvoke || '';
		return (element.retrieve(this._namespace + '-isAssembled' + childInvoke, false) !== false);
	},

	x:null
});


var Ct_Component_Default = Class.create(Ct_Component_Abstract, {

	__construct: function() {
	},

	_setNamespace: function() {
		this._namespace = 'ctDefault';
	},

	refresh: function(ident, response) {
		var element = $(ident);
		if (Object.isElement(element) && response.html && response.html.length) {
			element.update(response.html);
		}
	}

});
Ct_Page.registerScript("Ct_Component_Default");
Ct_Page.registerComponent("Ct_Component_Default");


var Ct_Component_Loader = Class.create({

	element: null,
	x: null,
	y: null,
	mousePositionTracker: null,
	loaderPositionUpdater: null,

	initialize: function() {
		this.element = new Element('div', {className: 'ctComponent-loader'}).hide().update(new Element('span'));
		this.x = 0;
		this.y = 0;
		this.mousePositionTracker = null;
		this.loaderPositionUpdater = null;

		$(document.body).insert(this.element);
		this.mousePositionTracker = Event.on(document, 'mousemove', null, function(event) {
			this.x = event.clientX;
			this.y = event.clientY;
		}.bindAsEventListener(this));
		this.loaderPositionUpdater = new Event.Handler(document, 'mousemove', null, function(event) {
			this.refreshPosition();
		}.bindAsEventListener(this));
	},

	refreshPosition: function() {
		this.element.setStyle({left: this.x + 'px', top: this.y + 'px'});
	},

	show: function(x, y, trackMouse) {

		this.x = Object.isNumber(x) ? x : this.x;
		this.y = Object.isNumber(y) ? y : this.y;

		if (trackMouse === false) {
			this.element.setStyle('position: absolute;');
		} else {
			this.element.setStyle('position: fixed;');
			this.loaderPositionUpdater.start();
		}

		this.refreshPosition();
		this.element.show();
	},

	hide: function() {
		this.element.hide();
		this.loaderPositionUpdater.stop();
	}

});
Ct_Page.registerScript("Ct_Component_Loader");
Ct_Page.registerComponent("Ct_Component_Loader");


var Ct_Component_Shade = Class.create({
	_calledShadeCount: 0,
	_durationShow: 0.2,
	_durationHide: 0.2,
	_opacity: 0.6,
	_baseClassName: 'ctComponentShade',

	element: null,

	initialize: function() {
		this.element = new Element('div', {className: this._baseClassName, style: 'display: none;'});
		$(document.body).insert(this.element);
	},

	setOpacity: function(opacity) {
		this._opacity = opacity;
	},

	show: function(afterShowCallback, additionalClassName) {
		new Effect.Opacity(this.element, {
			to: this._opacity,
			from: 0,
			duration: this._durationShow,
			queue: {position: 'end', scope: 'Ct_Component_Shade'},
			beforeSetup: function() {
				this._calledShadeCount++;
				this.element.writeAttribute('class', this._baseClassName);
				if (additionalClassName) {
					this.element.addClassName(additionalClassName);
				}
				this.element.show();
			}.bind(this),
			afterFinish: function() {
				if (Object.isFunction(afterShowCallback)) {
					afterShowCallback();
				}
			}.bind(this)
		});
	},

	hide: function(afterHideCallback) {
		this._calledShadeCount--;
		if (this._calledShadeCount > 0) {
			return;
		}


		new Effect.Opacity(this.element, {
			to: 0,
			from: this._opacity,
			duration: this._durationShow,
			queue: {position: 'end', scope: 'Ct_Component_Shade'},
			afterFinish: function() {
				this.element.hide();
				if (Object.isFunction(afterHideCallback)) {
					afterHideCallback();
				}
			}.bind(this)
		});
	},

	x: null
});
Ct_Page.registerScript("Ct_Component_Shade");
Ct_Page.registerComponent("Ct_Component_Shade");

var Ct_Component_Message = Class.create({

	element: null,
	_timer: null,
	_wrapperElement: null,
	_rawTextElement: null,

	initialize: function() {
		this.element = null;
		this._wrapperElement = null;
		this._timer = null
	},

	update: function(content) {
		if (!Object.isElement(this.element)) {
			this._build();
		}

		this._wrapperElement.update(content);

		this.element.removeClassName('error');
		this.element.removeClassName('warning');
		this.element.removeClassName('info');

		if (this.hasErrors()) {
			this.element.addClassName('error');
		} else {
			if (this.hasWarnings()) {
				this.element.addClassName('warning');
			} else {
				if (this.hasInfos()) {
					this.element.addClassName('info');
				}
			}
		}

	},

	error: function(message, rawText) {
		if (!Object.isElement(this.element)) {
			this._build();
		}
		if (rawText) {
			this._rawTextElement.update(rawText).show();
		}
		this.show('<p class="error">' + message + '</p>');
	},

	info: function(message, rawText) {
		if (!Object.isElement(this.element)) {
			this._build();
		}
		if (rawText) {
			this._rawTextElement.update(rawText).show();
		}
		this.show('<p class="info">' + message + '</p>');
	},

	show: function(content) {
		if (!Object.isString(content)) {
			return;
		}
		this.update(content);
		this._show();
	},

	reset: function() {
		if (!Object.isElement(this.element)) {
			this._build();
		}
		this._wrapperElement.update('');
		this.element.removeClassName('error');
		this.element.removeClassName('warning');
		this.element.removeClassName('info');

		this._hide();
	},

	hide: function() {
		if (Object.isElement(this.element)) {
			this._hide();
		}
	},

	_show: function() {
		if (this.element.visible()) {
			return;
		}

		Effect.Queues.get(this.element.identify()).effects.each(function(ef) {
			ef.cancel()
		});
		if (this._timer != null) {
			window.clearTimeout(this._timer);
			this._timer = null;
		}

		//		this.element.show();
		//		var layout = new Element.Layout(this.element);
		//		this.element.setStyle({top: -layout.get('margin-box-height') + 'px'});
		//
		//		new Effect.Morph(this.element, {
		//			duration: 0.5,
		//			style: 'top: 0',
		//			queue: {position: 'end', scope: this.element.identify()}
		//		});
		//
		//		new Effect.Highlight(this.element, {
		//			delay: 0.3,
		//			duration: 0.4,
		//			afterFinish: function() {
		//				if (!this.hasErrors() && !this.hasWarnings()) {
		//					this._timer = window.setTimeout(function() {
		//						this.hide();
		//					}.bind(this), 1000);
		//				}
		//			}.bind(this),
		//			queue: {position: 'end', scope: this.element.identify()}
		//		});

		this.element.setOpacity(0);
		this.element.show();
		new Effect.Opacity(this.element, {
			duration: 0.6,
			to: 1,
			afterFinish: function() {
				if (!this.hasErrors() && !this.hasWarnings()) {
					this._timer = window.setTimeout(function() {
						this.hide();
					}.bind(this), 9000);
				}
			}.bind(this),
			queue: {position: 'end', scope: this.element.identify()}
		});

	},

	_hide: function() {
		Effect.Queues.get(this.element.identify()).effects.each(function(ef) {
			ef.cancel()
		});
		if (this._timer != null) {
			window.clearTimeout(this._timer);
			this._timer = null;
		}

		new Effect.Opacity(this.element, {
			duration: 0.2,
			to: 0,
			afterFinish: function() {
				this.element.hide();
				this._rawTextElement.hide();
			}.bind(this),
			queue: {position: 'end', scope: this.element.identify()}
		});

		//		var layout = new Element.Layout(this.element);
		//		new Effect.Morph(this.element, {
		//			duration: 0.2,
		//			style: 'top: ' + (-layout.get('margin-box-height')) + 'px',
		//			afterFinish: function() {
		//				this.element.hide()
		//			}.bind(this),
		//			queue: {position: 'end', scope: this.element.identify()}
		//		});
	},

	_build: function() {
		this.element = new Element('div', {className: 'ctComponent-message', style: 'display: none'});

		this._wrapperElement = new Element('div', {className: 'wrapper'});
		this._rawTextElement = new Element('div', {className: 'rawText'}).hide();
		this.element.insert(this._wrapperElement);
		this.element.insert(this._rawTextElement);
		this.element.insert(new Element('a', {href: 'javascript:void(0)', className: 'closeButton'}));
		$(document.body).insert(this.element);

		this.element.on('click', '.closeButton', function(event) {
			Event.stop(event);
			this.hide();
		}.bindAsEventListener(this));
	},

	hasErrors: function() {
		if (Object.isElement(this._wrapperElement)) {
			return Object.isElement(this._wrapperElement.down('.error'));
		} else {
			return false;
		}
	},

	hasWarnings: function() {
		if (Object.isElement(this._wrapperElement)) {
			return Object.isElement(this._wrapperElement.down('.warning'));
		} else {
			return false;
		}
	},

	hasInfos: function() {
		if (Object.isElement(this._wrapperElement)) {
			return Object.isElement(this._wrapperElement.down('.info'));
		} else {
			return false;
		}
	}

});

Ct_Page.registerScript("Ct_Component_Message");
Ct_Page.registerComponent("Ct_Component_Message");

Ct_Page.loadComponentStyle('Ct_Component');
Ct_Page.registerScript("Ct_Component");
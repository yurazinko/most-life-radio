var Ct_Request_Adapter = Class.create({

	_processResponse: function(responseText) {
		var tmpDiv = new Element('div').update(responseText);
		var redirectPath = null;
		var redirectPathForced = null;
		var responseError = true;

		try {
			Ct_Page.getComponent('Ct_Component_Message').show(tmpDiv.down('div.messages').innerHTML.unescapeHTML());
			responseError = false;
		} catch (ex) {
		}

		try {
			redirectPathForced = tmpDiv.down('div.forceRedirect').innerHTML.unescapeHTML();
			if (redirectPathForced !== null && !Ct_Page.getComponent('Ct_Component_Message').hasErrors()) {
				document.location.href = redirectPathForced;
				return;
			}
		} catch (ex) {
		}

		try {
			redirectPath = tmpDiv.down('div.redirect').innerHTML.unescapeHTML();
		} catch (ex) {
		}

		try {
			tmpDiv.down('div.js').innerHTML.evalJSON().each(Ct_Page.loadJs);
			//			response.set('js', tmpDiv.down('div.js').innerHTML.evalJSON());
		} catch (ex) {
		}
		try {
			tmpDiv.down('div.css').innerHTML.evalJSON().each(Ct_Page.loadCss);
			//			response.set('css', tmpDiv.down('div.css').innerHTML.evalJSON());
		} catch (ex) {
		}

		var response = new Hash;
		tmpDiv.select('div.content').each(function(contentElement) {
			var ident = contentElement.readAttribute('title');
			var html = '';
			var json = {};
			try {
				html = contentElement.down('div.html').innerHTML.unescapeHTML();
			} catch (ex) {
			}
			try {
				json = contentElement.down('div.json').innerHTML.evalJSON();
			} catch (ex) {
			}
			if (ident.length == 0) {
				json.redirectPath = redirectPath;
				ident = this.ident;
			}
			response.set(ident, {html: html, json: json});
			responseError = false;

		}.bind(this));

		if (responseError) {
			Ct_Page.getComponent('Ct_Component_Message').error('Application error', responseText);
		}

		return response;
	},

	_failureHandler: function() {
		Ct_Page.getComponent('Ct_Component_Message').error('Error. Check your internet connection');
	},

	_successHandler: function(transport) {
		this.callback(this._processResponse(transport.responseText));
	},

	forceSuccess: function(responseText) {
		this.callback(this._processResponse(responseText));
	}

});
var Ct_Request_Adapter_Ajax = Class.create(Ct_Request_Adapter, {

	callback: null,
	ident: null,

	options: {},
	url: null,
	method: null,
	form: null,

	initialize: function(ident, callback) {
		this.callback = callback;
		this.ident = ident;
		this.url = '';
		this.options = {};
		this.method = 'POST';
		this.form = null;
	},

	send: function() {
		var optionsDefault = {
			onCreate: function() {
				Ct_Page.getComponent('Ct_Component_Loader').show();
			},
			onComplete: function() {
				Ct_Page.getComponent('Ct_Component_Loader').hide();
			}
		};

		this.options = Object.extend(optionsDefault, this.options);

		if (this.url == '' && this.form == null) {
			throw "CtRequest error: cannot send request without URL or FORM";
		}

		if (this.options.parameters && this.form != null) {
			throw "CtRequest error: both OPTION PARAMETERS and FORM are set. Specify either OPTION PARAMETERS or FORM";
		}

		if (this.form) {
			this.options.parameters = Form.serialize(this.form);
			this.url = this.form.readAttribute('action');
		}

		if (!this.url) {
			throw 'Ct_Request_Adapter_Ajax' + ': url undefined';
		}

		this.options.onSuccess = this._successHandler.bind(this);
		this.options.onFailure = this._failureHandler.bind(this);
		this.options.method = this.method;
		new Ajax.Request(this.url, this.options);
		Ct_Page.getComponent('Ct_Component_Message').reset();
		return true;
	},

	setParams: function(params) {
		this.options.parameters = params || {};
	},

	x: null
});

var Ct_Request_Adapter_Iframe = Class.create(Ct_Request_Adapter, {

	callback: null,
	ident: null,

	options: {},
	url: null,
	form: null,

	iframe: null,

	initialize: function(ident, callback) {
		this.callback = callback;
		this.ident = ident;
		this.url = '';
		this.options = {};
		this.form = null;

		this.iframe = new Element('iframe', {className: 'hidden', src: 'about:blank'});
		this.iframe.writeAttribute('name', this.iframe.identify());
		$(document.body).insert(this.iframe);

		// Hack for IE
		try {
			window.frames[this.iframe.identify()].name = this.iframe.identify();
			window.frames[this.iframe.identify()].id = this.iframe.identify();
		} catch (e) {}

		this.iframe.on('load', null, function(event) {
			Ct_Page.getComponent('Ct_Component_Loader').hide();
			var iframe = Event.findElement(event, 'iframe');
			var response = iframe.contentWindow.document.body.innerHTML;
			if (response.length > 0) {
				this._successHandler({responseText: response});
			}
		}.bindAsEventListener(this));
	},

	send: function() {
		if (this.form == null || !Object.isElement(this.form)) {
			throw "CtRequest error: cannot send request without FORM";
		}
		/**
		 * TODO: Если форма не задана, то надо создать временную, напхать в нее хидден-инпутов со значениями из this.options.parameters, а в action - this.url
		 */
		//		if (this.url == '' && this.form == null) {
		//			throw "CtRequest error: cannot send request without URL or FORM";
		//		}
		//		if (this.options.parameters && this.form != null) {
		//			throw "CtRequest error: both OPTION PARAMETERS and FORM are set. Specify either OPTION PARAMETERS or FORM";
		//		}
		//		if (this.form == null) {
		//			this.form = new Element('form', {method: 'post', action: this.url, target: this.iframe.readAttribute('name')});
		//
		//		}

		this.form.writeAttribute('target', this.iframe.readAttribute('name'));
		this.form.submit();

		Ct_Page.getComponent('Ct_Component_Loader').show();

		//		if (this.form) {
		//			this.options.parameters = Form.serialize(this.form);
		//			this.url = this.form.readAttribute('action');
		//		}

		//		this.options.onSuccess = this._successHandler.bind(this);
		//		this.options.onFailure = this._failureHandler.bind(this);
		//		this.options.onCreate = function() {
		//			Ct_Page.getComponent('Ct_Component_Loader').show();
		//		};
		//		this.options.onComplete = function() {
		//			Ct_Page.getComponent('Ct_Component_Loader').hide();
		//		};
		//
		//		new Ajax.Request(this.url, this.options);

		Ct_Page.getComponent('Ct_Component_Message').reset();
		return true;
	}
});

var Ct_Request = Class.create({

	adapters: {},

	initialize: function() {
		this.adapters = {};
	},

	get: function(ident, requestType, callback) {

		var adapter = null;
		switch (requestType) {
			case 'ajax':
				adapter = new Ct_Request_Adapter_Ajax(ident, this._responseHandler.bind(this, ident, callback));
				break;

			case 'iframe':
				adapter = new Ct_Request_Adapter_Iframe(ident, this._responseHandler.bind(this, ident, callback));
				break;

			default:
				throw 'Request type for component ' + ident + ' is not defined';
				break;
		}

		this.adapters[ident] = adapter;
		return adapter;
	},

	send: function(ident) {
		this.adapters[ident].send();
	},

	_responseHandler: function(ident, callback, response) {
		var isFunction = Object.isFunction(callback);

		response.each(function(pair) {
				if (isFunction
				&& pair.key === ident
			) {
				callback(pair.value);
			} else {
				Ct_Page.refreshComponent(pair.key, pair.value);
			}
		}.bind(this));
	}
});

Ct_Page.registerScript("Ct_Request");

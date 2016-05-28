var Ct_Page = new (Class.create({

	_baseUrl: '',

	_scripts: null,
	_scriptDelegates: null,
	_components: null,
	_componentsTmp: null,
	_componentDelegates: null,
	_packages: null,
	_request: null,

	_domLoaded: null,
	_domLoadedDelegates: null,
	_windowLoaded: null,
	_windowLoadedDelegates: null,

	initialize: function() {
		this._scripts = new Hash();
		this._scriptDelegates = new Hash();
		this._components = new Hash();
		this._componentsTmp = new Hash();
		this._componentDelegates = new Hash();
		this._packages = new Array();
		this._request = null;

		this._domLoaded = false;
		this._domLoadedDelegates = new Array();

		this._windowLoaded = false;
		this._windowLoadedDelegates = new Array();

		if (Ct_Page_Config) {
			if ('baseUrl' in Ct_Page_Config) {
				this._baseUrl = Ct_Page_Config.baseUrl;
			}
		}

		this.loadComponentScript('Ct_Component');
		this.registerComponent('Ct_Request');
		this.componentIsReady('Ct_Request', function() {
			this._request = this.getComponent('Ct_Request');
		}.bind(this));

		Event.observe(document, 'dom:loaded', function() {
			this._registerDomLoaded();
		}.bindAsEventListener(this));

		Event.observe(window, 'load', function() {
			this._registerWindowLoaded();
		}.bindAsEventListener(this));
	},

	_registerWindowLoaded: function() {
		this._windowLoaded = true;

		if (Object.isArray(this._windowLoadedDelegates)) {
			this._windowLoadedDelegates.each(function(delegate) {
				delegate();
			});
			delete this._windowLoadedDelegates;
			this._windowLoadedDelegates = new Array;
		}

	},

	windowLoaded: function(delegate) {
		if (Object.isFunction(delegate)) {
			if (this._windowLoaded === true) {
				delegate();
			} else {
				this._windowLoadedDelegates.push(delegate);
			}
		}
	},

	_registerDomLoaded: function() {
		this._domLoaded = true;

		if (Object.isArray(this._domLoadedDelegates)) {
			this._domLoadedDelegates.each(function(delegate) {
				delegate();
			});
			delete this._domLoadedDelegates;
			this._domLoadedDelegates = new Array;
		}

	},

	domLoaded: function(delegate) {
		if (Object.isFunction(delegate)) {
			if (this._domLoaded === true) {
				delegate();
			} else {
				this._domLoadedDelegates.push(delegate);
			}
		}
	},

	getComponent: function(componentName) {
		if (!!this._components.get(componentName)) {
			return this._components.get(componentName);
		} else {
			return null;
		}
	},

	registerScript: function(scriptName) {
		this._scripts.set(scriptName, true);
		this._processPackageList();

		if (Object.isArray(this._scriptDelegates.get(scriptName))) {
			this._scriptDelegates.get(scriptName).each(function(delegate) {
				delegate();
			});
			this._scriptDelegates.unset(scriptName)
		}
	},

	scriptIsReady: function(scriptName, delegate) {
		if (Object.isFunction(delegate)) {
			if (this._scripts.get(scriptName) === true) {
				delegate();
			} else {
				if (!Object.isArray(this._scriptDelegates.get(scriptName))) {
					this._scriptDelegates.set(scriptName, new Array);
				}
				this._scriptDelegates.get(scriptName).push(delegate);
			}
		}

		return (this._scripts.get(scriptName) === true);
	},

	registerComponent: function(componentName) {
		if (!!!this._componentsTmp.get(componentName)) {
			this._componentsTmp.set(componentName, true);

			if (this._scripts.get(componentName) !== true) {
				this.scriptIsReady('Ct_Component', function() {
					this.loadComponentScript(componentName);
				}.bindAsEventListener(this));
			}

			this.domLoaded(function(componentName1) {
				this.scriptIsReady(componentName1, function(componentName2) {
					var newComponent = eval('new ' + componentName2);
					this._processPackageList();
					this._components.set(componentName2, newComponent);
					if (Object.isArray(this._componentDelegates.get(componentName2))) {
						this._componentDelegates.get(componentName2).each(function(delegate) {
							delegate(newComponent);
						});
						this._componentDelegates.unset(componentName2)
					}
				}.bind(this, componentName1));
			}.bind(this, componentName));
		}
	},

	componentIsReady: function(componentName, delegate) {
		var component = this._components.get(componentName);

		if (Object.isFunction(delegate)) {
			if (!!component) {
				delegate(component);
			} else {
				if (!Object.isArray(this._componentDelegates.get(componentName))) {
					this._componentDelegates.set(componentName, new Array);
				}
				this._componentDelegates.get(componentName).push(delegate);
			}
		}
		return (!!component);
	},

	getRequest: function(ident, requestType, callback) {
		if (this._request == null) {
			throw 'Component Ct_Request is not registered';
		}
		return this._request.get(ident, requestType, callback);
	},

	refreshComponent: function(ident, response) {
		var element = $(ident);
		if (!Object.isElement(element)) {
			return;
		}
		var component = Ct_Page.getComponent('Ct_Component_Default');
		this._components.each(function(pair) {
			if (Object.isFunction(pair.value.isOwner) && pair.value.isOwner(ident)) {
				component = pair.value;
			}
		});
		component.refresh(ident, response);
		element.fire('Ct_Page:refresh');
	},

	loadComponentScript: function(componentName) {
		var fileName = this._baseUrl + 'js/' + componentName.gsub('_', '/') + '.js';
		this.loadJs(fileName);
	},

	loadComponentStyle: function(componentName) {
		var fileName = this._baseUrl + 'js/' + componentName.gsub('_', '/') + '/style.css';
		this.loadCss(fileName);
	},

	loadJs: function(src, params, isAutoRegister) {
		isAutoRegister = Object.isUndefined(isAutoRegister) ? true : isAutoRegister;

		if (!src.startsWith('http')) {
			src = this.getBaseUrl() + src;
		}

		this.domLoaded(function() {
			var head = $$('head')[0];
			if (head.select('script[src*="' + src + '"]').length == 0) {
				var scriptElement = new Element('script', {type: "text/javascript", src: src});

				if (!!params) {
					$H(params).each(function(scriptElementBinded, item) {
						scriptElementBinded.writeAttribute(item.key, item.value);
					}.bind(this, scriptElement));
				}

				scriptElement.onload = function() {
					if (isAutoRegister) {
						Ct_Page.registerScript(src);
					}
				}.bind(this);

				scriptElement.onreadystatechange = function(scr) {
					if (scr.readyState == 'loaded' || scr.readyState == 'complete') {
						if (isAutoRegister) {
							Ct_Page.registerScript(src);
						}
					}
				}.bind(this, scriptElement);
				head.insert(scriptElement);
			} else {
				if (isAutoRegister) {
					Ct_Page.registerScript(src);
				}
			}
		}.bind(this));
	},

	loadCss: function(src) {
		this.domLoaded(function(srcBinded) {
			var head = $$('head')[0];
			if (head.select('link[href*="' + srcBinded + '"]').length == 0) {
				var style = new Element('link', {type: 'text/css', rel: 'stylesheet', media: "screen", href: src});
				head.insert(style);
			}
		}.bind(this, src));
	},

	getBaseUrl: function () {
		return this._baseUrl;
	},

	setBaseUrl: function (url) {
		this._baseUrl = url;
	},

	packegeIsReady: function(packages) {

		packages.style = packages.style || [];
		packages.style.each(function(style) {
			if (style.startsWith('Ct_')) {
				this.loadComponentStyle(style)
			}
		}.bind(this));
		if ((packages = this._processPackage(packages)) !== false) {
			this._packages.push(packages);
		} else {
			return;
		}

		packages.script = packages.script || [];
		packages.script.each(function(script) {
		if (script.startsWith('Ct_')) {
				this.loadComponentScript(script)
			} else {
				this.loadJs(script);
			}
		}.bind(this));

		packages.component = packages.component || [];
		packages.component.each(function(component) {
			this.registerComponent(component);
		}.bind(this));
	},

	_processPackage: function(packages) {
		var cummulatedCount = 0;

		packages.script = packages.script || [];
		packages.script.each(function(script) {
			if (this._scripts.get(script) === true) {
				packages.script = packages.script.without(script);
			}
		}.bind(this));
		cummulatedCount += packages.script.length;

		packages.component = packages.component || [];
		packages.component.each(function(component) {
			if (!!this._components.get(component)) {
				packages.component = packages.component.without(component);
			}
		}.bind(this));
		cummulatedCount += packages.component.length;

		if (cummulatedCount == 0) {
			packages.delegate();
			this._packages = this._packages.without(packages);
			return false;
		} else {
			return packages;
		}
	},

	_processPackageList: function() {
		var pa = this._packages;
		this._packages.each(function(package) {
			if (this._processPackage(package) === false) {
				pa = pa.without(package);
			}
		}.bind(this))
	},

	x: null

}));



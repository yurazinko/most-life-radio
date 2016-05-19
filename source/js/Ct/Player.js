Ct_Page.loadJs('js/jw/jwplayer.js');
Ct_Page.loadJs('js/effects/dragdrop.js');
Ct_Page.loadComponentStyle('Ct_Player');

var Ct_Player = Class.create(Ct_Component_Abstract, {

	_setNamespace: function() {
		this._namespace = 'ctPlayer';
		this._namespaceEvent = 'Ct_Player';
	},

	__construct: function() {
		Ct_Page.domLoaded(this._assemble.bind(this));

		this.element.on('click', '.' + this._namespace + ' ' + '.' + this._namespace + '-btn-play', this.onPlayClick.bindAsEventListener(this));
		this.element.on('click', '.' + this._namespace + ' ' + '.' + this._namespace + '-btn-volume', this.onVolumeClick.bindAsEventListener(this));
		this.element.on('mouseover', '.' + this._namespace + ' ' + '.' + this._namespace + '-volume', this.showVolumeSlider.bindAsEventListener(this));
		this.element.on('mouseout', '.' + this._namespace + ' ' + '.' + this._namespace + '-volume', this.hideVolumeSlider.bindAsEventListener(this));
		this.element.on('click', '.' + this._namespace + ' ' + '.' + this._namespace + '-volume-slider-inner', this.onVolumeSliderClick.bindAsEventListener(this));
		this.element.on('click', '.' + this._namespace + ' ' + '.' + this._namespace + '-btn-station-prev', this.prevStation.bindAsEventListener(this));
		this.element.on('click', '.' + this._namespace + ' ' + '.' + this._namespace + '-btn-station-next', this.nextStation.bindAsEventListener(this));
		this.element.on('click', '.' + this._namespace + ' ' + '.' + this._namespace + '-btn-bitrate', this.changeBitrate.bindAsEventListener(this));

		this.element.on(this._namespaceEvent + ':radioChanged', '.' + this._namespace, this.hashChange.bindAsEventListener(this));
	},

	_assemble: function() {
		$$('.' + this._namespace).each(function(element) {
			var config;

			if (this.isAssembled(element)) {
				return;
			}
			this._markAsAssembled(element);
			config = this._makeConfig(element);

			var radioList = [];

			if ('radio' in config) {
				config.radio.each(function(radio) {
					if (!('channel' in radio) || radio.channel.length < 1) {
						return;
					}

					var radioItem = {
						name: ('name' in radio) ? radio.name : 'Unknown',
						channel: []
					};

					radio.channel.each(function(channel) {
						if (!('url' in channel)) {
							return;
						}

						radioItem.channel.push({
							bitrate: ('bitrate' in channel) ? channel.bitrate : '---',
							url: channel.url
						});
					}.bind(this));

					if (radioItem.channel.length > 0) {
						radioList.push(radioItem);
					}
				}.bind(this));

				config.radio = radioList;
			}

			if (radioList.length > 0) {
				var hash = document.location.hash.substr(1).split('/');
				if (hash.length == 2) {
					var hashRadio = null;
					var hashChannel = null;

					radioList.each(function(radio) {
						if (radio.name == hash[0]) {
							hashRadio = radio;
							radio.channel.each(function(channel) {
								if (channel.bitrate == hash[1]) {
									hashChannel = channel;
									return;
								}
							});
							return;
						}
					}.bind(this));
				}
				if (!hashRadio) {
					hashRadio = radioList.first();
					hashChannel = null;
				}
				this.loadRadio(element, hashRadio, hashChannel);
			}

			element.store('config', config);


		}.bind(this));
	},

	onPlayClick: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		jw.play();
	},

	onVolumeClick: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		jw.setMute();
	},

	onVolumeSliderClick: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || Object.isElement(event.findElement('.' + this._namespace + '-volume-slider-handler')) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		var x = event.clientX - element.down('.' + this._namespace + '-volume-slider-inner').viewportOffset().left;
		if (x < 0) {
			x = 0;
		}
		if (x > 60) {
			x = 60;
		}
		jw.setVolume(x * 100 / 60);
	},

	showVolumeSlider: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		var slider = element.down('.' + this._namespace + '-volume-slider');
		Effect.Queues.get(element.identify()).invoke('cancel');
		slider.appear({duration: 0.2, queue: {scope: element.identify()}});
	},

	hideVolumeSlider: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		if (!element.retrieve('dragged')) {
			var slider = element.down('.' + this._namespace + '-volume-slider');
			Effect.Queues.get(element.identify()).invoke('cancel');
			slider.fade({duration: 0.2, queue: {scope: element.identify()}});
		}
	},

	prevStation: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		var radioList = element.retrieve('config').radio;
		var currentRadio = element.retrieve('currentRadio');
		var prevRadio = null;

		if (!currentRadio) {
			prevRadio = radioList.first();
		} else {
			var index = radioList.indexOf(currentRadio);
			if (index == 0) {
				prevRadio = radioList.last();
			} else {
				prevRadio = radioList[index - 1];
			}
		}

		if (prevRadio) {
			this.loadRadio(element, prevRadio);
		}
	},

	nextStation: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		var radioList = element.retrieve('config').radio;
		var currentRadio = element.retrieve('currentRadio');
		var nextRadio = null;

		if (!currentRadio) {
			nextRadio = radioList.first();
		} else {
			var index = radioList.indexOf(currentRadio);
			if (index + 1 == radioList.length) {
				nextRadio = radioList.first();
			} else {
				nextRadio = radioList[index + 1];
			}
		}

		if (nextRadio) {
			this.loadRadio(element, nextRadio);
		}
	},

	changeBitrate: function(event) {
		var element = event.findElement('.' + this._namespace);
		var clickedBitrate = event.findElement('.' + this._namespace + '-btn-bitrate');
		var jw;

		if (!Object.isElement(element) || !Object.isElement(clickedBitrate) || clickedBitrate.hasClassName('active') || !(jw = element.retrieve('jw', false))) {
			return;
		}

		var currentRadio = element.retrieve('currentRadio');
		var bitrateList = element.select('.' + this._namespace + '-btn-bitrate');

		var index = bitrateList.indexOf(clickedBitrate);
		if (index == -1 || currentRadio.channel.length <= index) {
			return;
		}

		this.loadBitrate(element, currentRadio.channel[index]);
	},

	hashChange: function(event) {
		var element = event.findElement('.' + this._namespace);
		var jw;

		if (!Object.isElement(element) || !(jw = element.retrieve('jw', false))) {
			return;
		}

		var hash = document.location.hash.substr(1).split('/');
		if (hash.length != 2) {
			return;
		}
		var hashRadio = null;
		var hashChannel = null;

		element.retrieve('config').radio.each(function(radio) {
			if (radio.name == hash[0]) {
				hashRadio = radio;
				radio.channel.each(function(channel) {
					if (channel.bitrate == hash[1]) {
						hashChannel = channel;
						return;
					}
				});
				return;
			}
		}.bind(this));

		if (hashRadio && hashChannel) {
			this.loadRadio(element, hashRadio, hashChannel);
		}
	},

	loadRadio: function(element, radio, channel) {
		var jw = element.retrieve('jw');

		var updateInfo = function() {
			element.store('currentRadio', radio);

			var bitrateList = element.select('.' + this._namespace + '-btn-bitrate');
			bitrateList.each(function(bitrate, i) {
				if (radio.channel.length > i) {
					bitrate.update(radio.channel[i].bitrate);
				} else {
					bitrate.update('');
					bitrate.removeClassName('active');
				}
			});

			if (!channel) {
				var activeBitrate = element.down('.' + this._namespace + '-btn-bitrate.active');
				if (Object.isElement(activeBitrate)) {
					channel = radio.channel[bitrateList.indexOf(activeBitrate)];
				} else {
					channel = radio.channel.last();
				}
			}

			this.loadBitrate(element, channel);
		}.bind(this);

		if (!jw) {
			var id = element.down('.' + this._namespace + '-player').identify();

			if (!channel) {
				channel = radio.channel.last();
			}

			jwplayer(id).setup({
				id: id,
				width: 1,
				height: 1,
				provider: 'sound',
				file: channel.url,
				volume: (document.getCookie('ctPlayer-volume') ? document.getCookie('ctPlayer-volume') : 70),
				autostart: true,
				modes: [
					{type: 'flash', src: 'js/jw/player.swf'},
					{type: 'html5'}
				],
				events: {
					onReady: function() {
						if (jw.getMute()) {
							element.addClassName(this._namespace + '-mute');
						}
						element.down('.' + this._namespace + '-volume-slider-value').setStyle({left: (jw.getVolume() * 60 / 100 - 60) + 'px'});

						var volumeSlider = element.down('.' + this._namespace + '-volume-slider-value');
						new Draggable(volumeSlider, {
							handle: volumeSlider.down('.' + this._namespace + '-volume-slider-handler'),
							starteffect: Prototype.emptyFunction,
							endeffect: Prototype.emptyFunction,
							snap: function(x, y) {
								if (x <= -60) {
									x = -60;
								} else if (x > 0) {
									x = 0;
								}

								jw.setVolume((x + 60) * 100 / 60);

								return [x, y];
							}.bind(this),
							constraint: 'horizontal',
							onStart: function() {
								element.store('dragged', true);
							},
							onEnd: function() {
								element.store('dragged', false);
							}
						});

						updateInfo();
					}.bind(this),
					onPlay: function() {
						element.addClassName(this._namespace + '-status-play');
					}.bind(this),
					onBuffer: function() {
						element.addClassName(this._namespace + '-status-play');
					}.bind(this),
					onPause: function() {
						element.removeClassName(this._namespace + '-status-play');
					}.bind(this),
					onIdle: function() {
						element.removeClassName(this._namespace + '-status-play');
					}.bind(this),
					onMute: function(event) {
						if (event.mute) {
							element.addClassName(this._namespace + '-mute');
						} else {
							element.removeClassName(this._namespace + '-mute');
						}
					}.bind(this),
					onVolume: function(event) {
						if (!element.retrieve('dragged')) {
							element.down('.' + this._namespace + '-volume-slider-value').setStyle({left: (event.volume * 60 / 100 - 60) + 'px'});
						}

						var exdate = new Date();
						exdate.setDate(exdate.getDate() + 5);
						document.setCookie('ctPlayer-volume', event.volume, exdate, '/');
					}.bind(this),
					onMeta: function(event) {
//						console.log('Meta', event);
					}.bind(this),
					onError: function(event) {
//						console.log('Error', event);
					}.bind(this)
				}
			});

			jw = jwplayer(id);

			element.store('jw', jw);
		} else {
			updateInfo();
		}

		element.down('.' + this._namespace + '-station-title').update(radio.name.split(' ', 2).join('<br/>'));
	},

	loadBitrate: function(element, bitrate) {
		var currentRadio = element.retrieve('currentRadio');
		var currentIndex = currentRadio.channel.indexOf(bitrate);

		element.select('.' + this._namespace + '-btn-bitrate').each(function(bitrateElement, i) {
			if (currentIndex == i) {
				bitrateElement.addClassName('active');
			} else {
				bitrateElement.removeClassName('active');
			}
		});

		document.location.hash = '#' + currentRadio.name + '/' + bitrate.bitrate;

		if (element.retrieve('skipLoad', true)) {
			element.store('skipLoad', false);
			return;
		}

		var jw = element.retrieve('jw');
		var prevState = jw.getState();

		jw.load(bitrate.url);
		if (prevState == 'PLAYING' || prevState == 'BUFFERING') {
			jw.play(true);
		}
	},

	refresh: function(ident, response) {},

	x:null

});


Ct_Page.scriptIsReady('js/jw/jwplayer.js', function() {
	Ct_Page.scriptIsReady('js/effects/dragdrop.js', function() {
		Ct_Page.registerScript('Ct_Player');
		Ct_Page.registerComponent('Ct_Player');
	});
});


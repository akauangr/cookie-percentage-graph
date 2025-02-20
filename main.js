if (PercentageMod === undefined) var PercentageMod = {};
PercentageMod.name = 'Percentage Graph Mod';
PercentageMod.ID = 'percentage graph mod';
PercentageMod.version = '4.0';
PercentageMod.GameVersion = '2.052';

PercentageMod.launch = function () {

	PercentageMod.defaultConfig = function () {
		return {
			show_graph: 1,
			show_synergy: 1,
			swap_order: 0,
			position: 'top-right',
			positionBtns: {
				'position_top_left': 0,
				'position_top_right': 1,
				'position_bottom_left': 0,
				'position_bottom_right': 0,
			},
			brightness: 1,
			brightnessBtns: {
				'brightness_0': 0,
				'brightness_1': 1,
				'brightness_2': 0,
				'brightness_3': 0,
				'brightness_4': 0,
				'brightness_5': 0,
				'brightness_50': 0
			},
			fontSize: 13,
			fontSizeBtns: {
				'fontSize_0': 0,
				'fontSize_1': 0,
				'fontSize_2': 1,
				'fontSize_3': 0,
				'fontSize_4': 0,
			},
			color: {
				'r': 0,
				'g': 0,
				'b': 0
			}
		}
	}

	PercentageMod.init = function () {
		PercentageMod.isLoaded = 1;
		PercentageMod.dir = CCSE.GetModPath(PercentageMod.ID);

		PercentageMod.ReplaceGameMenu();
		PercentageMod.insertGraphs();

		//hooks.
		Game.registerHook('logic', function () {
			if (Game.T % 10 == 0) {
				PercentageMod.updatePercentages();
			}
		});
	}


	//***********************************
	//    Menu Replacer
	//***********************************

	PercentageMod.ReplaceGameMenu = function () {
		Game.customOptionsMenu.push(function () {
			CCSE.AppendCollapsibleOptionsMenu(PercentageMod.name, PercentageMod.getMenuString());
		});

		Game.customStatsMenu.push(function () {
			CCSE.AppendStatsVersionNumber(PercentageMod.name, PercentageMod.version);
		});

		var stylesheet = document.styleSheets[0];
		stylesheet.insertRule(".percentageModColorListing > .smallFancyButton { width: auto !important}", 0);
		stylesheet.insertRule(".percentageModFontSizeListing > .smallFancyButton { width: auto !important}", 0);
	}

	PercentageMod.getMenuString = function () {
		let m = CCSE.MenuHelper;
		var str = '';

		try {
			str += m.Header('Mod Position');
			str += '' +
				'<div class="listing">' +
				m.ToggleButton(PercentageMod.config.positionBtns, 'position_top_left', 'PercentageMod_PositionTopLeft', 'Top left (selected)', 'Top left', "PercentageMod.ChangePosition") +
				m.ToggleButton(PercentageMod.config.positionBtns, 'position_top_right', 'PercentageMod_PositionTopRight', 'Top right (selected)', 'Top right', "PercentageMod.ChangePosition") +
				'</div>';
			str += '' +
				'<div class="listing">' +
				m.ToggleButton(PercentageMod.config.positionBtns, 'position_bottom_left', 'PercentageMod_PositionBottomLeft', 'Bottom left (selected)', 'Bottom left', "PercentageMod.ChangePosition") +
				m.ToggleButton(PercentageMod.config.positionBtns, 'position_bottom_right', 'PercentageMod_PositionBottomRight', 'Bottom right (selected)', 'Bottom right', "PercentageMod.ChangePosition") +
				'</div>';

			str += '<br/>';
			str += m.Header('Graph');
			str += '' +
				'<div class="listing">' +
				m.ToggleButton(PercentageMod.config, 'show_graph', 'PercentageMod_Graph', 'Show Graph ON', 'Show Graph OFF', "PercentageMod.Toggle") +
				'</div>';

			str += '<br/>';
			str += m.Header('Synergy');
			str += '' +
				'<div class="listing">' +
				m.ToggleButton(PercentageMod.config, 'show_synergy', 'PercentageMod_Synergy', 'Show Synergy ON', 'Show Synergy OFF', "PercentageMod.Toggle") +
				'</div>';

			str += '<br/>';
			str += m.Header('Order');
			str += '' +
				'<div class="listing">' +
				m.ToggleButton(PercentageMod.config, 'swap_order', 'PercentageMod_SwapOrder', 'Swap Graph Order ON', 'Swap Graph Order OFF', "PercentageMod.Toggle") +
				'</div>';

			str += '<br/>';
			str += m.Header('Brightness');
			str += '' +
				'<div class="listing percentageModColorListing">' +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_0', 'PercentageMod_Brightness_0', 'Black', 'Black', "PercentageMod.ChangeBrightness") +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_1', 'PercentageMod_Brightness_1', 'Default', 'Default', "PercentageMod.ChangeBrightness") +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_2', 'PercentageMod_Brightness_2', 'Bright', 'Bright', "PercentageMod.ChangeBrightness") +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_3', 'PercentageMod_Brightness_3', 'Brighter', 'Brighter', "PercentageMod.ChangeBrightness") +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_4', 'PercentageMod_Brightness_4', 'Brighter+', 'Brighter+', "PercentageMod.ChangeBrightness") +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_5', 'PercentageMod_Brightness_5', 'Neon', 'Neon', "PercentageMod.ChangeBrightness") +
				m.ToggleButton(PercentageMod.config.brightnessBtns, 'brightness_50', 'PercentageMod_Brightness_50', 'White', 'White', "PercentageMod.ChangeBrightness") +
				'</div>';

			str += '<br/>';
			str += m.Header('Font Size');
			str += '' +
				'<div class="listing percentageModFontSizeListing">' +
				m.ToggleButton(PercentageMod.config.fontSizeBtns, 'fontSize_0', 'PercentageMod_FontSize_0', 'XSmall', 'XSmall', "PercentageMod.ChangeFontSize") +
				m.ToggleButton(PercentageMod.config.fontSizeBtns, 'fontSize_1', 'PercentageMod_FontSize_1', 'Small', 'Small', "PercentageMod.ChangeFontSize") +
				m.ToggleButton(PercentageMod.config.fontSizeBtns, 'fontSize_2', 'PercentageMod_FontSize_2', 'Default', 'Default', "PercentageMod.ChangeFontSize") +
				m.ToggleButton(PercentageMod.config.fontSizeBtns, 'fontSize_3', 'PercentageMod_FontSize_3', 'Big', 'Big', "PercentageMod.ChangeFontSize") +
				m.ToggleButton(PercentageMod.config.fontSizeBtns, 'fontSize_4', 'PercentageMod_FontSize_4', 'Bigger', 'Bigger', "PercentageMod.ChangeFontSize") +
				'</div>';

			str += '<br/>';

			str += m.Header('Default');
			str += '' +
				'<div class="listing">' +
				m.ActionButton("PercentageMod.restoreDefaultConfig(); PercentageMod.resetGraphs(); Game.UpdateMenu();", 'Restore Default Config') +
				'</div>';

			str += '<br/>';

		} catch (error) {
			console.log(error);
			PercentageMod.restoreDefaultConfig()
			str = PercentageMod.getMenuString()
		}

		return str;
	}

	PercentageMod.Toggle = function (prefName, button, on, off, invert) {
		if (PercentageMod.config[prefName]) {
			l(button).innerHTML = off;
			PercentageMod.config[prefName] = 0;
		}
		else {
			l(button).innerHTML = on;
			PercentageMod.config[prefName] = 1;
		}
		l(button).className = 'smallFancyButton prefButton option' + ((PercentageMod.config[prefName] ^ invert) ? '' : ' off');

		var resetGraphButtons = [
			'show_graph',
			'swap_order'
		];

		if (resetGraphButtons.includes(prefName)) {
			PercentageMod.resetGraphs();
		}
	}

	PercentageMod.ToggleInList = function (prefName, button, on, off, list, config) {
		list.forEach((btn) => {
			if (prefName == btn.pref) {
				PercentageMod.config[config] = btn.name;
				l(button).innerHTML = on;
				PercentageMod.config[config + "Btns"][btn.pref] = 1;
			} else {
				l(button).innerHTML = off;
				PercentageMod.config[config + "Btns"][btn.pref] = 0;
			}
		});
		Game.UpdateMenu();
	}

	PercentageMod.ChangePosition = function (prefName, button, on, off, invert) {
		var positions = [
			{ pref: 'position_top_left', name: 'top-left' },
			{ pref: 'position_top_right', name: 'top-right' },
			{ pref: 'position_bottom_left', name: 'bottom-left' },
			{ pref: 'position_bottom_right', name: 'bottom-right' }
		]
		PercentageMod.ToggleInList(prefName, button, on, off, positions, 'position')
		PercentageMod.resetGraphs();
	}

	PercentageMod.ChangeBrightness = function (prefName, button, on, off, invert) {
		var brightnessBtns = [
			{ pref: 'brightness_0', name: '0' },
			{ pref: 'brightness_1', name: '1' },
			{ pref: 'brightness_2', name: '2' },
			{ pref: 'brightness_3', name: '3' },
			{ pref: 'brightness_4', name: '4' },
			{ pref: 'brightness_5', name: '5' },
			{ pref: 'brightness_50', name: '50' }
		]
		PercentageMod.ToggleInList(prefName, button, on, off, brightnessBtns, "brightness")
		PercentageMod.resetGraphs();
	}

	PercentageMod.ChangeFontSize = function (prefName, button, on, off, invert) {
		var fontSizeBtns = [
			{ pref: 'fontSize_0', name: '8' },
			{ pref: 'fontSize_1', name: '10' },
			{ pref: 'fontSize_2', name: '13' },
			{ pref: 'fontSize_3', name: '15' },
			{ pref: 'fontSize_4', name: '20' }
		]
		PercentageMod.ToggleInList(prefName, button, on, off, fontSizeBtns, "fontSize")
		PercentageMod.resetGraphs();
	}


	PercentageMod.save = function () {
		return JSON.stringify(PercentageMod.config);
	}

	PercentageMod.load = function (str) {
		PercentageMod.config = PercentageMod.defaultConfig();
		var config = JSON.parse(str);
		if (config) {
			PercentageMod.config = config;
		}
		PercentageMod.resetGraphs();
	}


	PercentageMod.restoreDefaultConfig = function () {
		PercentageMod.config = PercentageMod.defaultConfig();
	}


	PercentageMod.insertGraphs = function () {
		if (!(PercentageMod.config)) {
			PercentageMod.restoreDefaultConfig();
		}

		var percentageContainer = '<span class="percentage" style="vertical-align: top;">0%</span>';

		var graphContainer = '' +
			'<span class="graph" ' +
			'style="' +
			'filter: brightness(' + (PercentageMod.config.brightness || 1) + ')' +
			'"></span>';

		var modDiv = '' +
			'<div class="percentageMod" style="position: absolute; font-size: ' + PercentageMod.config.fontSize + 'px;' +
			(PercentageMod.config.position == 'top-left' ? 'top: 0px;left: 0px;' : '') +
			(PercentageMod.config.position == 'top-right' ? 'top: 0px;right: 0px;' : '') +
			(PercentageMod.config.position == 'bottom-left' ? 'bottom: 0px;left: 0px;' : '') +
			(PercentageMod.config.position == 'bottom-right' ? 'bottom: 0px;right: 0px;' : '') +
			'">' +
			(PercentageMod.config.swap_order ? graphContainer : '') +
			percentageContainer +
			(PercentageMod.config.swap_order ? '' : graphContainer)
		'</div>';

		Game.ObjectsById.forEach(obj => {
			obj
				.l.getElementsByClassName("content")[0]
				.insertAdjacentHTML('beforeend', modDiv);
		});
	}

	PercentageMod.removeGraphs = function () {
		Game.ObjectsById.forEach(obj => {
			obj
				.l.getElementsByClassName("percentageMod")[0].remove()

		});
	}

	PercentageMod.resetGraphs = function () {
		PercentageMod.removeGraphs();
		PercentageMod.insertGraphs();
	}

	PercentageMod.updatePercentages = function () {
		Game.ObjectsById.forEach(obj => {
			var perc = PercentageMod.getTotalPercentage(obj);
			var percSynergy = PercentageMod.getSynergyPercentage(obj);
			var percDiv = obj.l.getElementsByClassName("content")[0].getElementsByClassName("percentage")[0];
			var graphDiv = obj.l.getElementsByClassName("content")[0].getElementsByClassName("graph")[0];

			var cpsStr = Beautify(perc, 1);
			var synergyStr = Beautify(percSynergy, 1);

			percDiv.innerHTML = '<b>' +
				cpsStr + '% ' + (perc > 0 ? '<span style="font-size: smaller">' +
					(PercentageMod.config.show_synergy ? '(+' + synergyStr + '%)' : '') +
					'</span></b>' : '');

			graphDiv.innerHTML = PercentageMod.config.show_graph ? PercentageMod.graphByPerc(perc) : '';
		});
	}

	PercentageMod.getTotalPercentage = function (me) {
		var percCPS = Game.cookiesPs > 0 ? ((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100) : 0;
		return percCPS;
	}

	PercentageMod.getSynergyPercentage = function (me) {
		if (me.amount > 0) {
			var synergiesWith = {};
			var synergyBoost = 0;

			if (me.name == 'Grandma') {
				for (var i in Game.GrandmaSynergies) {
					if (Game.Has(Game.GrandmaSynergies[i])) {
						var other = Game.Upgrades[Game.GrandmaSynergies[i]].buildingTie;
						var mult = me.amount * 0.01 * (1 / (other.id - 1));
						var boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + mult);
						synergyBoost += boost;
						if (!synergiesWith[other.plural]) synergiesWith[other.plural] = 0;
						synergiesWith[other.plural] += mult;
					}
				}
			}
			else if (me.name == 'Portal' && Game.Has('Elder Pact')) {
				var other = Game.Objects['Grandma'];
				var boost = (me.amount * 0.05 * other.amount) * Game.globalCpsMult;
				synergyBoost += boost;
				if (!synergiesWith[other.plural]) synergiesWith[other.plural] = 0;
				synergiesWith[other.plural] += boost / (other.storedTotalCps * Game.globalCpsMult);
			}

			for (var i in me.synergies) {
				var it = me.synergies[i];
				if (Game.Has(it.name)) {
					var weight = 0.05;
					var other = it.buildingTie1;
					if (me == it.buildingTie1) { weight = 0.001; other = it.buildingTie2; }
					var boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + me.amount * weight);
					synergyBoost += boost;
					if (!synergiesWith[other.plural]) synergiesWith[other.plural] = 0;
					synergiesWith[other.plural] += me.amount * weight;
				}
			}
		}
		return (synergyBoost / Game.cookiesPs) * 100
	}

	PercentageMod.graphByPerc = function (perc) {
		return "<div style='" +
			"margin: 0px 2px;" +
			"display: inline-block;" +
			"width: 14px;" +
			"height: 14px;" +
			"border-radius: 50%;" +
			"border: 1px solid #05658E;" +
			"background-image: conic-gradient(from 0deg at 50% 50%, #083959  0%, #083959 " + perc + "%, #00000000 " + (perc + 0.1) + "%)" +
			"'></div>"
	}


	if (CCSE.ConfirmGameVersion(PercentageMod.name, PercentageMod.version, PercentageMod.GameVersion)) {
		Game.registerMod(PercentageMod.name, PercentageMod)
	}; // PercentageMod.init();
}


if (!PercentageMod.isLoaded) {
	if (CCSE && CCSE.isLoaded) {
		PercentageMod.launch();
	}
	else {
		if (!CCSE) var CCSE = {};
		if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(PercentageMod.launch);
	}
}
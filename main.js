if (PercentageMod === undefined) var PercentageMod = {};
PercentageMod.name = 'Percentage Graph Mod';
PercentageMod.ID = 'percentage graph mod';
PercentageMod.version = '3.0';
PercentageMod.GameVersion = '2.048';

PercentageMod.launch = function () {

	PercentageMod.defaultConfig = function () {
		return {
			position: 'top-right',
			show_synergy: 1,
			swap_order: 0,
			buttons: {
				'position_top_left': 0,
				'position_top_right': 1,
				'position_bottom_left': 0,
				'position_bottom_right': 0,
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
	}

	PercentageMod.getMenuString = function () {
		let m = CCSE.MenuHelper;
		var str = '';

		str += m.Header('Mod Position');
		str += '' +
			'<div class="listing">' +
			m.ToggleButton(PercentageMod.config.buttons, 'position_top_left', 'PercentageMod_PositionTopLeft', 'Top left (selected)', 'Top left', "PercentageMod.ChangePosition") +
			m.ToggleButton(PercentageMod.config.buttons, 'position_top_right', 'PercentageMod_PositionTopRight', 'Top right (selected)', 'Top right', "PercentageMod.ChangePosition") +
			'</div>';
		str += '' +
			'<div class="listing">' +
			m.ToggleButton(PercentageMod.config.buttons, 'position_bottom_left', 'PercentageMod_PositionBottomLeft', 'Bottom left (selected)', 'Bottom left', "PercentageMod.ChangePosition") +
			m.ToggleButton(PercentageMod.config.buttons, 'position_bottom_right', 'PercentageMod_PositionBottomRight', 'Bottom right (selected)', 'Bottom right', "PercentageMod.ChangePosition") +
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
		str += m.Header('Default');
		str += '' +
			'<div class="listing">' +
			m.ActionButton("PercentageMod.restoreDefaultConfig(); PercentageMod.resetGraphs(); Game.UpdateMenu();", 'Restore Default Config') +
			'</div>';

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
			'swap_order'
		];

		if (resetGraphButtons.includes(prefName)) {
			PercentageMod.resetGraphs();
		}
	}

	PercentageMod.ChangePosition = function (prefName, button, on, off, invert) {
		var positions = [
			{ pref: 'position_top_left', name: 'top-left' },
			{ pref: 'position_top_right', name: 'top-right' },
			{ pref: 'position_bottom_left', name: 'bottom-left' },
			{ pref: 'position_bottom_right', name: 'bottom-right' }
		]

		positions.forEach((pos) => {
			if (prefName == pos.pref) {
				PercentageMod.config.position = pos.name;
				l(button).innerHTML = on;
				PercentageMod.config.buttons[pos.pref] = 1;
			} else {
				l(button).innerHTML = off;
				PercentageMod.config.buttons[pos.pref] = 0;
			}
		});

		Game.UpdateMenu();
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

		var modDiv = '' +
			'<div class="percentageMod" style="position: absolute;' +
			(PercentageMod.config.position == 'top-left' ? 'top: 0px;left: 0px;' : '') +
			(PercentageMod.config.position == 'top-right' ? 'top: 0px;right: 0px;' : '') +
			(PercentageMod.config.position == 'bottom-left' ? 'bottom: 0px;left: 0px;' : '') +
			(PercentageMod.config.position == 'bottom-right' ? 'bottom: 0px;right: 0px;' : '') +
			'">' +
			(PercentageMod.config.swap_order ? '<span class="graph"></span>' : '') +
			'<span class="percentage" style="vertical-align: top;">0%</span>' +
			(PercentageMod.config.swap_order ? '' : '<span class="graph"></span>') +
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

			percDiv.innerHTML = '<b>' +
				Beautify(perc, 1) + '% ' + (perc > 0 ? '<span style="font-size: smaller">' +
					(PercentageMod.config.show_synergy ? '(+' + Beautify(percSynergy, 1) + '%)' : '') +
					'</span></b>' : '');
			graphDiv.innerHTML = PercentageMod.graphByPerc(perc);
		});
	}

	PercentageMod.getTotalPercentage = function (me) {
		var percCPS = Game.cookiesPs > 0 ? ((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100) : 0;
		return percCPS;
	}

	PercentageMod.getSynergyPercentage = function (me) {
		if (me.amount > 0) {
			var synergyesWith = {};
			var synergyBoost = 0;

			if (me.name == 'Grandma') {
				for (var i in Game.GrandmaSynergyes) {
					if (Game.Has(Game.GrandmaSynergyes[i])) {
						var other = Game.Upgrades[Game.GrandmaSynergyes[i]].buildingTie;
						var mult = me.amount * 0.01 * (1 / (other.id - 1));
						var boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + mult);
						synergyBoost += boost;
						if (!synergyesWith[other.plural]) synergyesWith[other.plural] = 0;
						synergyesWith[other.plural] += mult;
					}
				}
			}
			else if (me.name == 'Portal' && Game.Has('Elder Pact')) {
				var other = Game.Objects['Grandma'];
				var boost = (me.amount * 0.05 * other.amount) * Game.globalCpsMult;
				synergyBoost += boost;
				if (!synergyesWith[other.plural]) synergyesWith[other.plural] = 0;
				synergyesWith[other.plural] += boost / (other.storedTotalCps * Game.globalCpsMult);
			}

			for (var i in me.synergyes) {
				var it = me.synergyes[i];
				if (Game.Has(it.name)) {
					var weight = 0.05;
					var other = it.buildingTie1;
					if (me == it.buildingTie1) { weight = 0.001; other = it.buildingTie2; }
					var boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + me.amount * weight);
					synergyBoost += boost;
					if (!synergyesWith[other.plural]) synergyesWith[other.plural] = 0;
					synergyesWith[other.plural] += me.amount * weight;
				}
			}
		}
		return (synergyBoost / Game.cookiesPs) * 100
	}

	PercentageMod.graphByPerc = function (perc) {
		var graphNumber = 0;
		var graphNumberList = [100, 90, 80, 75, 65, 60, 50, 40, 30, 25, 20, 10, 5, 1];
		graphNumberList.forEach(n => {
			if (perc <= n) {
				graphNumber = n;
			}
		});

		return "<img src='" + PercentageMod.dir + "/graph/" + graphNumber + ".png' />"

		// if (Game.dir) {
		// 	return "<img src='../graph/" + graphNumber + ".png' />"
		// } else {
		// 	return "";
		// }
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
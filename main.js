Game.registerMod("percentage graph mod", {
	init: function () {
		//this function is called as soon as the mod is registered
		this.insertGraphs();

		let MOD = this;

		//declare hooks here
		Game.registerHook('logic', function () {
			MOD.updatePercentages();
		});

		//note: this mod does nothing but show a notification at the bottom of the screen once it's loaded
		Game.Notify(`Percentage Graph mod loaded!`, '', [16, 5]);
	},
	save: function () {
		//use this to store persistent data associated with your mod
		return ''
	},
	load: function (str) {
		//do stuff with the string data you saved previously
	},
	insertGraphs: function () {
		Game.ObjectsById.forEach(obj => {
			obj
				.l.getElementsByClassName("content")[0]
				.insertAdjacentHTML('beforeend', '<div class="percentageMod" style="position: absolute;top: 0px;right: 0px;"><span class="percentage" style="vertical-align: top;">0%</span><span class="graph"></span></div>');
		});
	},
	updatePercentages: function () {
		Game.ObjectsById.forEach(obj => {
			var perc = this.getTotalPercentage(obj);
			var percDiv = obj.l.getElementsByClassName("content")[0].getElementsByClassName("percentage")[0];
			var graphDiv = obj.l.getElementsByClassName("content")[0].getElementsByClassName("graph")[0];

			percDiv.innerHTML = '<b>' + Beautify(perc, 1) + '%</b>';
			graphDiv.innerHTML = this.graphByPerc(perc);
		});
	},
	getTotalPercentage: function (me) {
		var percCPS = Game.cookiesPs > 0 ? ((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100) : 0;
		return percCPS;
	},
	graphByPerc: function (perc) {
		var graphNumber = 0;
		var graphNumberList = [100, 90, 80, 75, 65, 60, 50, 40, 30, 25, 20, 10, 5, 1];
		graphNumberList.forEach(n => {
			if (perc <= n) {
				graphNumber = n;
			}
		});

		if (this.dir) {
			return "<img src='" + this.dir + "/graph/" + graphNumber + ".png' />"
		} else {
			return "<img src='img/money.png' />";
		}
	}
});

/*

Breakdown of info.txt:
	"Name": "Sample Mod",
		the visibly displayed name of your mod
	"ID": "sample mod",
		the text id of your mod (alphanumeric characters and spaces only), used as its key when saving or loading data
		also used as identifiers in other mods' dependencies
		this id must be the same as the first parameter used in your Game.registerMod(id,hooks)
	"Author": "Orteil",
		your name here!
	"Description": "A bare-bones sample mod.",
		a description of your mod
	"ModVersion": 1,
		a number value for your mod's version
	"GameVersion": 2.031,
		the last version of Cookie Clicker this mod was confirmed to run on
	"Date": "13/08/2021",
		the date your mod was released or last updated
	"Dependencies": [],
		optional; an array of IDs of other mods that must be loaded before this one, ie. ["cool mod preloader","extra stuff"]
	"LanguagePacks": ["lang.js"],
		optional; an array of local files containing localization data (ie. changing game text, adding translations etc)
	"Disabled": 1,
		optional; if set to 1, this mod will be disabled by default
	"AllowSteamAchievs":1,
		optional; by default, mods (unless they only consist of language files) block the unlocking of Steam achievements while enabled; set this to 1 if this is a good honest mod that does not incredibly unbalance the game

*/
Game.registerMod("percentage graph mod", {
	init: function () {
		this.insertGraphs();
		let MOD = this;

		//hooks.
		Game.registerHook('logic', function () {
			MOD.updatePercentages();
		});
	},
	save: function () {
		return ''
	},
	load: function (str) {
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
			var percSynergy = this.getSynergyPercentage(obj);
			var percDiv = obj.l.getElementsByClassName("content")[0].getElementsByClassName("percentage")[0];
			var graphDiv = obj.l.getElementsByClassName("content")[0].getElementsByClassName("graph")[0];

			percDiv.innerHTML = '<b>' + Beautify(perc, 1) + '% <span style="font-size: smaller">(+' + Beautify(percSynergy, 1) + '%)</span></b>';
			graphDiv.innerHTML = this.graphByPerc(perc);
		});
	},
	getTotalPercentage: function (me) {
		var percCPS = Game.cookiesPs > 0 ? ((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100) : 0;
		return percCPS;
	},
	getSynergyPercentage: function (me){
		if (me.amount>0)
		{
			var synergiesWith={};
			var synergyBoost=0;
			
			if (me.name=='Grandma')
			{
				for (var i in Game.GrandmaSynergies)
				{
					if (Game.Has(Game.GrandmaSynergies[i]))
					{
						var other=Game.Upgrades[Game.GrandmaSynergies[i]].buildingTie;
						var mult=me.amount*0.01*(1/(other.id-1));
						var boost=(other.storedTotalCps*Game.globalCpsMult)-(other.storedTotalCps*Game.globalCpsMult)/(1+mult);
						synergyBoost+=boost;
						if (!synergiesWith[other.plural]) synergiesWith[other.plural]=0;
						synergiesWith[other.plural]+=mult;
					}
				}
			}
			else if (me.name=='Portal' && Game.Has('Elder Pact'))
			{
				var other=Game.Objects['Grandma'];
				var boost=(me.amount*0.05*other.amount)*Game.globalCpsMult;
				synergyBoost+=boost;
				if (!synergiesWith[other.plural]) synergiesWith[other.plural]=0;
				synergiesWith[other.plural]+=boost/(other.storedTotalCps*Game.globalCpsMult);
			}
			
			for (var i in me.synergies)
			{
				var it=me.synergies[i];
				if (Game.Has(it.name))
				{
					var weight=0.05;
					var other=it.buildingTie1;
					if (me==it.buildingTie1) {weight=0.001;other=it.buildingTie2;}
					var boost=(other.storedTotalCps*Game.globalCpsMult)-(other.storedTotalCps*Game.globalCpsMult)/(1+me.amount*weight);
					synergyBoost+=boost;
					if (!synergiesWith[other.plural]) synergiesWith[other.plural]=0;
					synergiesWith[other.plural]+=me.amount*weight;
				}
			}
		}
		return (synergyBoost/Game.cookiesPs)*100
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
			return "";
		}
	}
});
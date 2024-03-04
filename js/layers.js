addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
     rows: new EN(0),
     nextRow: new EN(1e10),
    }},
    color: "#0019fc",
    requires: new EN(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade('p', 23)) mult = mult.times(upgradeEffect("p",23))
        if (hasUpgrade('p', 32)) mult = mult.times(upgradeEffect("p",32))
        if (hasUpgrade('m', 11)) mult = mult.times(upgradeEffect("m",11))
        if (hasUpgrade('ma', 11)) mult = mult.times(upgradeEffect("ma",11))
        if (player.p.points.gte(1e18)) mult = mult.div(16)
        if (player.p.points.gte(1e33)) mult = mult.root(9)
        if (player.b.unlocked) mult = mult.times(tmp.b.effect);
        if (player.up.unlocked) mult = mult.times(tmp.up.effect);
        if (inChallenge("up", 12)) mult = mult.div(challengeNerf("up", 12));
         if (hasUpgrade('p', 24)) mult = mult.times(upgradeEffect("p",24))
         if (hasUpgrade("g",22)) mult = mult.times(50);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
       if (hasUpgrade('p', 13)) exp = exp.add(1)
       if (hasUpgrade('m', 15)) exp = exp.add(0.5)
       return exp;
    },
    rowGain() { return OmegaNum.pow(tmp.p.dirBase).times(1) },
    nextrowGain() { return OmegaNum.pow(tmp.p.dirBase).times(1) },
    passiveGeneration() { return (hasMilestone("m", 1))?1:0 },
    update(diff) {
        if (player.m.unlocked) player.p.rows = new EN(1); player.p.nextRow = new EN(1.789478e34)
        if (player.up.unlocked) player.p.rows = new EN(2); player.p.nextRow = new EN(7.64899e117)
    },
    dirBase() { return player.p.points.times(1.0002) },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("m", 0)) keep.push("upgrades")
        if (hasMilestone("m", 0)) keep.push("milestones")
        if (hasMilestone("up", 1)) keep.push("upgrades")
        if (hasMilestone("up", 2)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: ["blank",
    ["display-text",
        function() {return '<h3>You are currently in the </h3><h2 class="currentRow"> Row ' + formatWhole(player.p.rows) + '</h2> <h3>and the next Row summits at <h2 class="currentRow"> '  + formatWhole(player.p.nextRow) + '</H2><h3> Points</h3>'},
            {}],
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You currently have approxmatilly ' + formatWhole(player.p.points) + ' Prestige Points'},
					{}],
			"resource-display",
			"blank",
			"milestones", "blank", "blank", "upgrades"],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Generator I",
            description: "Start gaining points.",
            cost: new EN(1),
           
        },
       
        12: {
            title: "Generator II",
            description: "Double the points gain.",
            cost: new EN(5),
            unlocked() { return hasUpgrade("p",11)},
        },
        13: {
            title: "Generator III",
            description: "Add 1 to the Prestige's exponent",
            cost: new EN(25),
            unlocked() { return hasUpgrade("p",12)},
        },
        14: {
            title: "Generator IV",
            description: "Add 0.5 to the Machintruc's exponent",
            cost: new EN(1e108),
            unlocked() { return hasUpgrade("p",13) && hasUpgrade("pw",12)},
        },
        21: {
            title: "Booster I",
            description: "Multiply points gain based on your Prestige Points.<br>Formula is [prestige points (1^0.5)×points]",
            cost: new EN(5),
            effect() {
                if (inChallenge("up", 21)) return new OmegaNum(1);

                let eff = player.p.points.add(1).pow(0.5)
                if (hasUpgrade('p', 33)) eff = eff.times(1.4)
                if (eff.gte(player.pe.softcap1)) eff = eff.div(100).log10().plus(player.pe.softcap1)
                if (hasUpgrade('m', 14)) eff = eff.times(upgradeEffect("m",14))
                     if (hasUpgrade('p', 44)) eff = eff.pow(1.2)
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("p", 21)) },
            unlocked() { return hasUpgrade("p",11)},
        },
        22: {
            title: "Booster II",
            description: "Points gain is multipled by itself<br>Formula is [points (1^0.1)×points]",
            cost: new EN(25),
            effect() {
                let eff = player.points.add(1).pow(0.1)
                if (hasUpgrade('p', 33)) eff = eff.times(1.4)
                if (hasUpgrade('ma', 25)) eff = eff.pow(upgradeEffect("ma",25))
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("p", 22)) },
            unlocked() { return hasUpgrade("p",21)},
        },
        23: {
            title: "Booster III",
            description: "Points gain multiply Prestige Points gain<br>Formula is [points (1^0.01)×prestige points]",
            cost: new EN(500),
            effect() {
                let eff = player.points.add(1).pow(0.01)
                if (hasUpgrade('p', 33)) eff = eff.times(1.4)
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("p", 23)) },
            unlocked() { return hasUpgrade("p",22)},
        },
        24: {
            title: "Booster IV",
            description: "Power Stations boost Prestige Point gain, also unlocks Machintruc Robot. <br>Formula is [power stations (1^0.01)×prestige points]",
            cost: new EN(1e110),
            effect() {
                let eff = player.points.add(1).pow(0.011)
            
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("p", 24)) },
            unlocked() { return hasUpgrade("p",23) && hasUpgrade("pw",12)},
        },
        31: {
            title: "Exponentator I",
            description: "Multiply points gains based on your Upgrades brought. <br>Formula is [prestige upgrades (1.2^upgrades)×points]",
            cost: new EN(2500),
            effect() {
                let eff = OmegaNum.pow(1.2, player.p.upgrades.length);
                if (hasUpgrade('p', 33)) eff = eff.times(1.4)
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("p", 31)) },
            unlocked() { return hasUpgrade("p",23)},
        },
        32: {
            title: "Exponentator II",
            description: "Prestige points is multipled by itself.<br>Formula is [prestige points (1^0.05)×prestige points]",
            cost: new EN(17500),
            effect() {
                let eff = player.p.points.add(1).pow(0.05)
                if (hasUpgrade('p', 33)) eff = eff.times(1.4)
                           if (hasUpgrade('p', 34)) eff = eff.times(1.4)
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("p", 32)) },
            unlocked() { return hasUpgrade("p",31)},
        },
        33: {
            title: "Exponentator III",
            description: "All previous upgrades are 5% stronger.",
            cost: new EN(100000),

            unlocked() { return hasUpgrade("p",32)},
        },
          34: {
            title: "Exponentator IV",
            description: "The <b>Exponentator II</b> upgrade is 5% stronger. Also unlocks Powerly Robot and get 1 free level to Powerly Machintruc.",
            cost: new EN(1e112),

                       unlocked() { return hasUpgrade("p",33) && hasUpgrade("pw",12)},
        },
        41: {
            title: "Tetrator I",
            description: "Prestige Points divide Matter requirement. <br>Formula is [prestige points (1^0.05)÷matter req]",
            cost: new EN(1e10),
            effect() {
                let eff = player.p.points.add(1).pow(0.05)
             
                return eff;
            },
            effectDisplay() { return "÷"+format(upgradeEffect("p", 41)) },
            unlocked() { return hasUpgrade("p",33) && player.m.unlocked},
        },
        42: {
            title: "Tetrator II",
            description: "Add 1 to the Matter's effect",
            cost: new EN(1e11),
          
            unlocked() { return hasUpgrade("p",41)},
        },
        43: {
            title: "Tetrator III",
            description: "Make the <b>Booster I</b> softcap start at 60,000.",
            cost: new EN(8e11),
           onPurchase() {if (!player.ma.unlocked) player.pe.softcap1 = new EN(60000);},
            unlocked() { return hasUpgrade("p",42)},
        },
         44: {
            title: "Tetrator IV",
            description: "Booster I's effect is raised ^1.2. Also unlocks a new buyable and 5 free levesl to Machintruc Power.",
            cost: new EN(1e113),
          
      unlocked() { return hasUpgrade("p",43) && hasUpgrade("pw",12)},
        },
        51: {
            title: "Pentrator I",
            description: "Make the <b>Booster I</b> softcap start at 100,000",
            cost: new EN(1e19),
           onPurchase() {if (!player.up.unlocked) player.pe.softcap1 = new EN(100000);},
            unlocked() { return hasUpgrade("p",43) && hasUpgrade("m",14)},
        },
        52: {
            title: "Pentrator II",
            description: "Make the Matter harsh gain start at 9 matters.",
            cost: new EN(1e20),
           onPurchase() {player.pe.harshStrong = new EN(9);},
            unlocked() { return hasUpgrade("p",51)},
        },
        53: {
            title: "Pentrator III",
            description: "Unlock a new type of layer.",
            cost: new EN(5e26),
       
            unlocked() { return hasUpgrade("p",52)},
        },
          54: {
            title: "Pentrator IV",
            description: "There's a new layer. Also unlocks 2 new buyables and an Teslalic Robot.",
            cost: new EN(1e190),
       
       unlocked() { return hasUpgrade("p",53) && hasUpgrade("pw",12)},
        },
    },
    milestones: {
        0: {
            requirementDescription: "1e37 Prestige Points",
            done() { return player.p.points.gte(1e37) && hasUpgrade("ma",23) },
            unlocked() { return hasUpgrade("ma",23)},
            effectDescription: "There is a new layer.",
        },
        1: {
            requirementDescription: "1e95 Prestige Points",
            done() { return player.p.points.gte(1e95) && player.up.points.gte(3) && hasMilestone("p",0)},
            unlocked() { return player.up.points.gte(3)},
            effectDescription: "There is 2 new layers.",
        },
       
    },
})

addLayer("m", {
    name: "matter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
auto: false,
divide: new EN(0),
    }},
    color: "#ffffff",
    requires: new EN(1e10), // Can be a function that takes requirement increases into account
    resource: "matter", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade('p', 41)) mult = mult.div(upgradeEffect("p",41))
        if (player.m.points.gte(player.pe.harshWeak)) mult = mult.add(2000)
        if (player.m.points.gte(player.pe.harshStrong)) mult = mult.times(1e20)
        if (player.b.unlocked) mult = mult.div(tmp.b.effect2);
        if (player.up.unlocked) mult = mult.div(tmp.up.effect2);
        if (player.m.points.gte(player.pe.harshStronger)) mult = mult.times(1e100)
        if (hasChallenge("up", 11)) mult = mult.div(challengeEffect("up", 11));
        if (inChallenge("up", 11)) mult = mult.times(challengeNerf("up", 11));
      
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
   
       return exp;
    },
    automate() {},
	autoPrestige() { return (hasUpgrade("pw", 11) && player.m.auto) },
    addToBase() {
        let base = new EN(0);
        if (hasUpgrade('p', 42)) base = base.add(1)
        if (hasUpgrade('m', 12)) base = base.add(upgradeEffect("m",12))
        if (hasUpgrade('m', 13)) base = base.add(upgradeEffect("m",13))
        if (hasUpgrade('ma', 14)) base = base.add(upgradeEffect("ma",14))
        if (tmp.m.effect.gte(1e35)) base = base.div(tmp.ma.powerEff);
        return base;
    },
    effBase2() {
        let base = new EN(2);
        
        // ADD
        
        
        // MULTIPLY
        
        
        return base;
    },
    powerEff() {
      
        return player.m.divide.plus(1).pow(this.powerExp());
    },
    powerExp() {
        let exp = new EN(10);
      
        return exp;
    },
    effect2() {
    
        return ExpantaNum.pow(this.effBase2(), player.m.points.plus()).sub(1).max(0);
        
       
    },
  
    update(diff) {
        if (tmp.m.effect.gte(1e35)) player.m.divide = player.m.divide.plus(tmp.m.effect2.times(diff));
    },
    effectBase() {
        let base = new EN(2);
        
        // ADD
        base = base.plus(tmp.m.addToBase);
        
        // MULTIPLY
        
        
        return base.pow(tmp.m.power);
    },
    power() {
        let power = new EN(1);
        
        return power;
    },
    effect() {
        
        return ExpantaNum.pow(tmp.m.effectBase, player.m.points);
    },
    doReset(resettingLayer) {
        let keep = [];
      
        if (hasMilestone("up", 2)) keep.push("milestones")
        if (hasMilestone("pw", 0)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("m", keep)
    },
    effectDescription() {
        return "which are multiplying the Points gain by "+"×"+format(tmp.m.effect)
    },
    tabFormat: ["blank",
  
        "main-display",
			"prestige-button",
			"blank",
			"blank",
			"resource-display",
			"blank",
          
			"milestones", "blank", "blank", "upgrades"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
 
    layerShown(){return player.p.unlocked},
 branches: ["p"],
 milestones: {
    0: {
        requirementDescription: "2 Matters",
        done() { return player.m.best.gte(2) },
        effectDescription: "Matters don't reset Prestige Upgrades",
    },
    1: {
        requirementDescription: "5 Matters",
        done() { return player.m.best.gte(5) },
        effectDescription: "Gain 100% of Prestige Points/sec",
    },
    2: {
        requirementDescription: "14 Matters",
        done() { return player.m.best.gte(14) && player.pa.unlocked },
        unlocked() { return player.pa.unlocked },
        effectDescription: "Paradox upgrades are permanently kept on resets.",
    },
},
upgrades: {
    11: {
        title: "Boosterator I",
        description: "Current Matter boost Prestige Point gain. <br>Formula is [matter (1^0.5)×prestige points]",
        cost: new EN(2),
        effect() {
            let eff = player.m.points.add(1).pow(0.5)
          
            return eff;
        },
        effectDisplay() { return "×"+format(upgradeEffect("m", 11)) },
    },
    12: {
        title: "Boosterator II",
        description: "Matter add to its effect. <br>Formula is [matter (1^0.5)+matter effect]",
        cost: new EN(3),
        effect() {
            let eff = player.m.points.add(1).pow(0.5)
          
            return eff;
        },
        effectDisplay() { return "+"+format(upgradeEffect("m", 12)) },
        unlocked() { return hasUpgrade("m",11)},
    },
    13: {
        title: "Boosterator III",
        description: "Points add to the Matter's effect <br>Formula is [points (1^0.02)+matter effect]",
        cost: new EN(5),
        effect() {
            let eff = player.points.add(1).pow(0.02)
          
            return eff;
        },
        effectDisplay() { return "+"+format(upgradeEffect("m", 13)) },
        unlocked() { return hasUpgrade("m",12)},
    },
    14: {
        title: "Boosterator IV",
        description: "Multiply the <b>Booster I</b> upgrade based on your current Matter  <br>Formula is [matter (1^0.2)+prestige upgrade 21]",
        cost: new EN(7),
        effect() {
            let eff = player.m.points.add(1).pow(0.2)
          
            return eff;
        },
        effectDisplay() { return "×"+format(upgradeEffect("m", 14)) },
        unlocked() { return hasUpgrade("m",13)},
    },
    15: {
        title: "Boosterator V",
        description: "Add 0.5 to the Prestige's exponent",
        cost: new EN(9),
        unlocked() { return hasUpgrade("m",14)},
    },
    21: {
        title: "Boosterator VI",
        description: "Matter add to the 1st Booster's effect <br>Formula is [matter (1^0.2)+booster 1st effect]",
        cost: new EN(9),
       
        effect() {
            let eff = player.m.points.add(1).pow(0.2)
          
            return eff;
        },
        effectDisplay() { return "+"+format(upgradeEffect("m", 21)) },
        unlocked() { return (player.b.points.gte(9))},
    },
    22: {
        title: "Boosterator VII",
        description: "Make the Matter fast gain start at amount of your Harsh Matter gain start  <br>Formula is [harshWeak = harshStrong]",
        cost: new EN(9),
       onPurchase() {player.pe.harshWeak = new EN(player.pe.harshStrong);},
        unlocked() { return hasUpgrade("m",21)},
        effectDisplay() { return "Starts at "+format(player.pe.harshStrong) },
    },
    23: {
        title: "Boosterator VIII",
        description: "Make the Harsh Matter gain start at 11",
        cost: new EN(9),
       onPurchase() {if (!player.up.unlocked) player.pe.harshStrong = new EN(11);},
        unlocked() { return hasUpgrade("m",21)},
     
    },
    24: {
        title: "Boosterator IX",
        description: "<b>Turbo Booster</b> softcap start at 100,000 effect and Boosters divide the Ultra prestige requirement. <br>Formula is [booster (1^0.3)÷ultra prestige req]",
        cost: new EN(11),
       onPurchase() {player.pe.softcap3 = new EN(100000);},
       effect() {
        let eff = player.b.points.add(1).pow(0.3)
      
        return eff;
    },
    effectDisplay() { return "÷"+format(upgradeEffect("m", 24)) },
        unlocked() { return hasUpgrade("m",23) && player.up.unlocked},
     
    },
    25: {
        title: "Boosterator X",
        description: "Add 1.5 to the 1st Ultra Prestige's effect",
        cost: new EN(14),
       
        unlocked() { return hasUpgrade("m",24) && player.up.points.gte(3)},
     
    },
}

})

addLayer("b", {
    name: "booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
        auto: false,
    }},
    color: "#ffff00",
    requires: new EN(1e38), // Can be a function that takes requirement increases into account
    resource: "booster", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (player.b.points.gte(player.m.points)) mult = mult.times(1e25)
        if (player.b.points.gte(player.pe.harshStronger)) mult = mult.times(1e150)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
   
       return exp;
    },
    addToBase() {
        let base = new EN(0);
        if (hasUpgrade('m', 21)) base = base.add(upgradeEffect("m",21))
      
        return base;
    },
    addToBase2() {
        let base = new EN(0);
      
        return base;
    },
    effectBase() {
        let base = new EN(1.25);
        
        // ADD
        base = base.plus(tmp.b.addToBase);
        
        // MULTIPLY
        
        
        return base.pow(tmp.b.power);
    },
    effectBase2() {
        let base = new EN(1.1);
        
        // ADD
        base = base.plus(tmp.b.addToBase2);
        
        // MULTIPLY
        
        
        return base.pow(tmp.b.power2);
    },
    power() {
        let power = new EN(1);
    
        return power;
    },
    automate() {},
	autoPrestige() { return (hasUpgrade("pw", 12) && player.b.auto) },
    power2() {
        let power = new EN(1);
        
        return power;
    },
    effect() {
        
        return ExpantaNum.pow(tmp.b.effectBase, player.b.points);
    },
    effect2() {
        
        return ExpantaNum.pow(tmp.b.effectBase2, player.b.points);
    },
    effectDescription() {
        return "which are multiplying the Prestige Points gain by "+"×"+format(tmp.b.effect)+" and diving the Matter requirement by ÷"+format(tmp.b.effect2)+""
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
 
    layerShown(){return hasMilestone("p",0)},
 branches: ["p"],
 


})
addLayer("g", {
    name: "generator", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
power: new EN(0),
    }},
    color: "lime",
    requires: new EN(1500), // Can be a function that takes requirement increases into account
    resource: "generators", // Name of prestige currency
    baseResource: "paradoxes", // Name of resource prestige is based on
    baseAmount() {return player.pa.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (player.g.points.gte(5)) mult = mult.times(player.g.power)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
   
       return exp;
    },
  base: 2,
    
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update(diff) {
        if (player.g.unlocked) player.g.power = player.g.power.plus(tmp.g.effect.times(diff));
    },
    layerShown(){return hasChallenge("up",22)},
 branches: ["pa",["p",2]],
 effBase() {
    let base = new OmegaNum(2);
    
    // ADD
   
    
    // MULTIPLY
    
    
    return base;
},
effect() {

    let eff = OmegaNum.pow(this.effBase(), player.g.points.plus(1)).sub(1).max(0);
  
    return eff;
},
powerExp() {
    let exp = new OmegaNum(1/6);
   
    return exp;
},
powerEff() {

    return player.g.power.plus(1).pow(this.powerExp());
},
effectDescription() {
    return "which are generating "+format(tmp.g.effect)+" Generator Power/sec."
},
doReset(resettingLayer) {
    let keep = [];
    player.g.power = new EN(0);
   
    if (layers[resettingLayer].row > this.row) layerDataReset("g", keep)
},
 milestones: {
    0: {
        requirementDescription: "1 Ultra Prestige-Point",
        done() { return player.up.best.gte(1) },
        effectDescription: "Change the current row.",
    },
    1: {
        requirementDescription: "2 Ultra Prestige-Points",
        done() { return player.up.best.gte(2) },
        effectDescription: "Permanently keep Prestige Upgrades.",
    },
    2: {
        requirementDescription: "3 Ultra Prestige-Points",
        done() { return player.up.best.gte(3) },
        effectDescription: "Permanently keep Matter and Prestige milestones",
        unlocked() { return hasMilestone("up",1) },
    },
},
upgrades: {
    11: {
        title: "Generator Tree 11",
        description: "Power Stations gain is increased by 20x.",
        cost: new EN(5),
        unlocked() { return player.g.unlocked},
    },
    21: {
        title: "Generator Tree 21",
        description: "Points gain is increased by 50x.",
        cost: new EN(5),
        branches: 11,
        unlocked() { return player.g.unlocked},
       canAfford() { return hasUpgrade("g",11)&&player.g.points.gte(5)},
    },
    22: {
        title: "Generator Tree 22",
        description: "Prestige Points gain is increased by 50x.",
        cost: new EN(5),
        branches: 11,
        unlocked() { return player.g.unlocked},
       canAfford() { return hasUpgrade("g",11)&&player.g.points.gte(5)},
    },
    31: {
        title: "Generator Tree 31",
        description: "Prestige Points gain is increased by 50x.",
        cost: new EN(6),
        branches: 21,
        unlocked() { return player.g.unlocked},
       canAfford() { return hasUpgrade("g",21)&&player.g.points.gte(5)},
    },
},
tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.g.power) + ' Generator Power, which boosts Paradox gain by '+format(tmp.g.powerEff)+'x'},
					{}],
			"blank",
			["display-text",
				function() {return 'Your best Generators is ' + formatWhole(player.g.best) + '<br>You have made a total of '+formatWhole(player.g.total)+" Generators."},
            ],
                "blank",
              
                "blank",
                "upgrades",

],


})
addLayer("pe", {
	startData() { return {                  // startData is a function that returns default data for a layer. 
		unlocked: true,
        points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
        softcap1: new EN(50000),
        softcap2: new EN(1e18),
        softcap3: new EN(25000),
        harshWeak: new EN(5),
        harshStrong: new EN(8),
        harshStronger: new EN(14),
	            // "points" is the internal name for the main resource of the layer.
    }},
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Penalties")
    },
        symbol: "PE", // This appears on the layer's node. Default is the id with the first letter capitalized
        
    color: "gray",                       // The color for this layer, which affects many elements.
          // The name of this layer's main prestige resource.
   row: "side",                               // The row this layer is on (0 is the first row).
  softcapzzzz() {
        
    return ExpantaNum.pow(tmp.m.effect);
},

                  // Determines the formula used for calculating prestige currency.
   
                  tabFormat: ["blank",
                  ["display-text",
                      function() {return 'Booster I upgrade is softcapped when the effect reaches at least '+formatWhole(player.pe.softcap1)+'.'},
                          {}],
                          "blank",
                          ["display-text",
                          function() {return 'Prestige Points gain scale slower after 1e18.'},
                              {}],
                              "blank",
                              ["display-text",
                              function() {return 'Points gain is slower after 1e25.'},
                                  {}],
                                  "blank",
                                  ["display-text",
                                  function() {return (player.m.unlocked?'The Matter cost requirement would be added by 2,000 if exceeds '+formatWhole(player.pe.harshWeak)+', would eventually scale harsher after '+formatWhole(player.pe.harshStrong)+'.':'')+(player.up.unlocked?' Though it will scale even more harsher after'+formatWhole(player.pe.harshStronger)+' Matter. This also affects at Booster requirement, but the increaseness is only 1e150.':'')},
                                      {}],
                                      "blank",
                                  ["display-text",
                                  function() {return (hasUpgrade("m",14)?'Tetrator I upgrade would be softcapped when the effect reaches at least 500.':'')},
                                      {}],
                                     
                                          "blank",
                                          ["display-text",
                                          function() {return (hasUpgrade("ma",14)?'Prestige points gain is brought to the 9th root after 1e33':'')},
                                              {}],
                                              "blank",
                                              ["display-text",
                                              function() {return (hasUpgrade("ma",14)?'Turbo booster would be softcapped when the effect reaches at least '+formatWhole(player.pe.softcap3)+'.':'')},
                                                  {}],
                                                  "blank",
                                              ["display-text",
                                              function() {return (player.b.unlocked?'Boosters requirement would scale harsher after '+formatWhole(player.m.points)+' Boosters. Matter however makes the harsh scale start later.':'')},
                                                  {}],
                                                  "blank",
                                                  ["display-text",
                                                  function() {return (player.pa.unlocked?'When Paradox is unlocked, the first upgrade would get hardcapped when the effect reaches at least 25.':'')},
                                                      {}],
                                                      "blank",
                                                      ["display-text",
                                                      function() {return (player.pa.unlocked?'The True Cog Booster upgrade is hardcapped when the effect reaches about 250.':'')},
                                                          {}],
                                                          "blank",
                                                      ["display-text",
                                                      function() {return (player.g.unlocked?'After reaching 5 generators, its cost requirement would be increased based on its power.':'')},
                                                          {}],
                                                          "blank",
                                                          ["display-text",
                                                          function() {return (player.g.unlocked?'The gain for Paradox is hardcapped after 8,000 points or gaining 8,000 of them.':'')},
                                                              {}],
                          ],
   
   
	 
})
addLayer("ma", {
    name: "machintruc", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
divide: new EN(0),
autoMp: true,
autoPm: true,
    }},
    color: "gray",
    requires: new EN(1e28), // Can be a function that takes requirement increases into account
    resource: "machintruc systems", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based ons
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade('ma', 12)) mult = mult.times(upgradeEffect("m",12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
       if (hasUpgrade('ma', 22)) exp = exp.times(upgradeEffect("ma",22))
           if (hasUpgrade('p', 14)) exp = exp.add(0.5)
       return exp;
    },
    passiveGeneration() { return (hasUpgrade("ma", 24))?0.01:0 },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
 
    layerShown(){return hasUpgrade("p",53)},
 branches: ["p","pa"],
 doReset(resettingLayer) {
    let keep = [];
  

    if (hasMilestone("pw", 0)) keep.push("upgrades")
    if (layers[resettingLayer].row > this.row) layerDataReset("ma", keep)
},
effBase() {
    let base = new EN(2);
    
    // ADD
    
    
    // MULTIPLY
    
    
    return base;
},
powerEff() {
  
    return player.ma.divide.plus(1).pow(this.powerExp());
},
powerExp() {
    let exp = new EN(10);
  
    return exp;
},
effect() {

    return ExpantaNum.pow(this.effBase(), player.ma.points.plus()).sub(1).max(0);
    
   
},

update(diff) {
    if (player.ma.autoMp && hasUpgrade("p", 24)) this.buyables[11].buyMax();
    if (player.ma.autoPm && hasUpgrade("p", 34)) this.buyables[12].buyMax();
},
upgrades: {
    11: {
        title: "Cog Generator",
        description: "Multiply Prestige Points gain based on your Machintruc. <br>Formula is [machintruc (1^0.2)×prestige points]",
        cost: new EN(1),
        effect() {
            let eff = player.ma.points.add(1).pow(0.2)
          
            return eff;
        },
        effectDisplay() { return "×"+format(upgradeEffect("ma", 11)) },
    },
    12: {
        title: "Cog Booster",
        description: "Machintruc's gain is multipled by your Matter.<br>Formula is [matter (1^0.2)×machintruc]",
        cost: new EN(5),
        effect() {
            let eff = player.m.points.add(1).pow(0.2)
          
            return eff;
        },
        effectDisplay() { return "×"+format(upgradeEffect("ma", 12)) },
        unlocked() { return hasUpgrade("ma",11)},
    },
    13: {
        title: "Turbo Booster",
        description: "Machintruc boost Points gain. <br>Formula is [machintruc (1^2)×points]",
        cost: new EN(10),
        effect() {
            let eff = player.ma.points.add(1).pow(2)
            if (eff.gte(25000)) eff = eff.div(100).log10().plus(25000)
            return eff;
        },
        effectDisplay() { return "×"+format(upgradeEffect("ma", 13)) },
        unlocked() { return hasUpgrade("ma",11)},
    },
    14: {
        title: "True Cog Booster",
        description: "Machintruc add to the Matter's effect. <br>Formula is [machintruc (1^0.05)×matter effect]",
        cost: new EN(40),
        effect() {
            let eff = player.ma.points.add(1).pow(0.05)
            if (eff.gte(250)) eff = eff.div(1e100).log10().plus(250)
            return eff;
        },
        effectDisplay() { return "+"+format(upgradeEffect("ma", 14)) },
        unlocked() { return hasUpgrade("ma",13)},
    },
    15: {
        title: "Cog in the Cog",
        description: "Unlock a buyable for it and make the Booster I softcap start at 1,000,000",
        cost: new EN(100000),
      
        unlocked() { return hasUpgrade("ma",14)},
        onPurchase() {player.pe.softcap1 = new EN(1e6);},
    },
    21: {
        title: "Legendary Exponent",
        description: "Get 1 free Machintruc Power",
        cost: new EN(1000000),
      
        unlocked() { return hasUpgrade("ma",15)},

    },
    22: {
        title: "Mythical Exponent",
        description: "Points add to the Machintruc's exponent",
        cost: new EN(10000000),
        effect() {
            let eff = player.points.add(1).pow(0.002)
          
            return eff;
        },
        effectDisplay() { return "+"+format(upgradeEffect("ma", 22)) },
        unlocked() { return hasUpgrade("ma",21)},

    },
    23: {
        title: "Ultra Exponent",
        description: "Unlock a milestone for Prestige",
        cost: new EN(1e9),
      
        unlocked() { return hasUpgrade("ma",22)},

    },
    24: {
        title: "Choatic Cog",
        description: "Gain 1% of your Machintruc per second.",
        cost: new EN(1e10),
      
        unlocked() { return hasUpgrade("ma",23)},

    },
    25: {
        title: "Bioshock",
        description: "Raise the <b>Booster II</b> upgrade based on your Matters. <br>Formula is [matter (1^0.05)^prestige upgrade 22]",
        cost: new EN(1e11),
        effect() {
            let eff = player.m.points.add(1).pow(0.05)
          
            return eff;
        },
        effectDisplay() { return "^"+format(upgradeEffect("ma", 25)) },
        unlocked() { return hasUpgrade("ma",24)},

    },
},
buyables: {
    11: {
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            if (x.gte(2)) x = x.pow(1).div(1.5)
            let cost = OmegaNum.pow(4, x.pow(2))
            return cost.floor()
        },
        free() {
            let free = OmegaNum(0);
            if (hasUpgrade("ma", 21)) free = free.plus(1);
            if (hasUpgrade("p", 44)) free = free.plus(5);
            return free;
        },
    
        title() { return "Machintruc Power" },

        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " machintruc\n\
            Amount: " + player[this.layer].buyables[this.id] + "+" + player[this.layer].buyables[this.id].free + "\n\
           Multiply the points gain by ×" + format(data.effect.first) + "<br>Formula is [buyable amount (1^1.1 (x^1.5)+free)×points]"
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            let eff = {}
            if (x.gte(0)) eff.first = OmegaNum.pow(1.1, x.pow(1.5)).plus(tmp.ma.buyables[this.id].free)
            else eff.first = OmegaNum.pow(1/30, x.times(-1).pow(1.2)).plus(tmp.ma.buyables[this.id].free)
 
            if (x.gte(0)) eff.second = x.pow(0.8).plus(tmp.ma.buyables[this.id].free)
            else eff.second = x.times(-1).pow(0.8).times(-1)
            return eff;
        },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMax() {
            let tempBuy = player[this.layer].points.max(1).log10().root(1.5)
           
            let target = tempBuy.plus(1).floor();
            return player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
        },
        unlocked() { return hasUpgrade("ma",15)},
        autoed() { return player.m.autoMp && hasUpgrade("p", 24) },
    },
    12: {
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            if (x.gte(2)) x = x.pow(2).div(4)
            let cost = OmegaNum.pow(7, x.pow(2))
            return cost.floor()
        },
        free() {
            let free = OmegaNum(0);
            if (hasUpgrade("p", 34)) free = free.plus(1);
         
            return free;
        },
        title() { return "Powerly Machintruc" },

        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " machintruc\n\
            Amount: " + player[this.layer].buyables[this.id] + "+" + player[this.layer].buyables.free + "\n\
           Multiply the Power Station gain by ×" + format(data.effect.first) + "<br>Formula is [buyable amount (1^1.1 (x^1.5)+free)×power station]"
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            let eff = {}
            if (x.gte(0)) eff.first = OmegaNum.pow(1.1, x.pow(1.5)).plus(tmp.ma.buyables[this.id].free)
            else eff.first = OmegaNum.pow(1/25, x.times(-1).pow(1.4)).plus(tmp.ma.buyables[this.id].free)
        
            if (x.gte(0)) eff.second = x.pow(0.8).plus(tmp.ma.buyables[this.id].free)
            else eff.second = x.times(-1).pow(0.8).times(-1)
            return eff;
        },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMax() {
            let tempBuy = player[this.layer].points.max(1).log10().root(2.25)
           
            let target = tempBuy.plus(1).floor();
            return player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
        },
        unlocked() { return player.pw.unlocked},
        autoed() { return player.m.autoPm && hasUpgrade("p", 34) },
    },
    13: {
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            if (x.gte(2)) x = x.pow(2).div(4)
            let cost = OmegaNum.pow(10, x.pow(2.5))
            return cost.floor()
        },
        free() {
            let free = OmegaNum(0);
   
         
            return free;
        },
        title() { return "Teslalic Power" },

        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " machintruc\n\
            Amount: " + player[this.layer].buyables[this.id] + "+" + player[this.layer].buyables.free + "\n\
          Raise the points gain to ^" + format(data.effect.first) + ". <br>Formula is [buyable amount (1^1.01 (x^1.01)+free)^points]"
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            let eff = {}
            if (x.gte(0)) eff.first = OmegaNum.pow(1.01, x.pow(1.01)).plus(tmp.ma.buyables[this.id].free)
            else eff.first = OmegaNum.pow(1/45, x.times(-1).pow(1.25)).plus(tmp.ma.buyables[this.id].free)
        
            if (x.gte(0)) eff.second = x.pow(0.8).plus(tmp.ma.buyables[this.id].free)
            else eff.second = x.times(-1).pow(0.8).times(-1)
            return eff;
        },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
       
        unlocked() { return hasUpgrade("p",44)},
  
    },
},

})

addLayer("up", {
    name: "ultra prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "UP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),

    }},
    color: "cyan",
    requires: new EN(12), // Can be a function that takes requirement increases into account
    resource: "ultra prestige points", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade('m', 24)) mult = mult.div(upgradeEffect("m",24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
   
       return exp;
    },
    addToBase() {
        let base = new EN(0);
        if (hasUpgrade('m', 25)) base = base.add(1)
        return base;
    },
    addToBase2() {
        let base = new EN(0);
     
        return base;
    },
    effectBase() {
        let base = new EN(4);
        
        // ADD
        base = base.plus(tmp.up.addToBase);
        
        // MULTIPLY
        
        
        return base.pow(tmp.up.power);
    },
    effectBase2() {
        let base = new EN(4);
        
        // ADD
        base = base.plus(tmp.up.addToBase2);
        
        // MULTIPLY
        
        
        return base.pow(tmp.up.power2);
    },
 
    power() {
        let power = new EN(1);
        
        return power;
    },
    power2() {
        let power = new EN(1);
        
        return power;
    },
   
    effect() {
        
        return ExpantaNum.pow(tmp.up.effectBase, player.up.points);
    },
    effect2() {
        
        return ExpantaNum.pow(tmp.up.effectBase2, player.up.points);
    },
    effectDescription() {
        return "which are multiplying the Points, Prestige Points gain by "+"×"+format(tmp.up.effect)+" and dividing the Matter requirement by ÷"+format(tmp.up.effect2)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
 
    layerShown(){return player.pe.harshStrong.gte(11)},
 branches: ["ma","m",["b",2]],
 
 milestones: {
    0: {
        requirementDescription: "1 Ultra Prestige-Point",
        done() { return player.up.best.gte(1) },
        effectDescription: "Change the current row.",
    },
    1: {
        requirementDescription: "2 Ultra Prestige-Points",
        done() { return player.up.best.gte(2) },
        effectDescription: "Permanently keep Prestige Upgrades.",
    },
    2: {
        requirementDescription: "3 Ultra Prestige-Points",
        done() { return player.up.best.gte(3) },
        effectDescription: "Permanently keep Matter and Prestige milestones",
        unlocked() { return hasMilestone("up",1) },
    },
},
challenges: {
    11: {
        name: "Derogatory Challenge 1",
   
        challengeDescription() {
            return "Matter requirement is increased by ×" + this.powers2() +" by Points gain is brought to the " + this.powers() +"th root."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
         goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(1e38);
                if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(1e43);
                if (challengeCompletions(this.layer, this.id) == 2) return new OmegaNum(1e48);
                if (challengeCompletions(this.layer, this.id) == 3) return new OmegaNum(1e52);
                if (challengeCompletions(this.layer, this.id) == 4) return new OmegaNum(1e57);
                if (challengeCompletions(this.layer, this.id) == 5) return new OmegaNum(1e65);
                if (challengeCompletions(this.layer, this.id) == 6) return new OmegaNum(1e71);
                if (challengeCompletions(this.layer, this.id) == 7) return new OmegaNum(1e79);
                if (challengeCompletions(this.layer, this.id) == 8) return new OmegaNum(1e87);
                if (challengeCompletions(this.layer, this.id) == 9) return new OmegaNum(1e95);
                if (challengeCompletions(this.layer, this.id) == 10) return new OmegaNum(1e106);
                if (challengeCompletions(this.layer, this.id) == 11) return new OmegaNum(1e120);
                if (challengeCompletions(this.layer, this.id) == 12) return new OmegaNum(1e136);
                if (challengeCompletions(this.layer, this.id) == 13) return new OmegaNum(1e162);
                if (challengeCompletions(this.layer, this.id) == 14) return new OmegaNum(1e180);
                if (challengeCompletions(this.layer, this.id) == 15) return new OmegaNum(1e215);
                if (challengeCompletions(this.layer, this.id) == 16) return new OmegaNum(1e240);
                if (challengeCompletions(this.layer, this.id) == 17) return new OmegaNum(1e300);
                if (challengeCompletions(this.layer, this.id) == 18) return new OmegaNum("1e360");
                if (challengeCompletions(this.layer, this.id) == 19) return new OmegaNum("1e420");
                if (challengeCompletions(this.layer, this.id) == 20) return new OmegaNum("1e480");
            },
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 1.10;
                if (challengeCompletions(this.layer, this.id) == 1) return 1.20;
                if (challengeCompletions(this.layer, this.id) == 2) return 1.30;
                if (challengeCompletions(this.layer, this.id) == 3) return 1.40;
                if (challengeCompletions(this.layer, this.id) == 4) return 1.50;
                if (challengeCompletions(this.layer, this.id) == 5) return 1.60;
                if (challengeCompletions(this.layer, this.id) == 6) return 1.75;
                if (challengeCompletions(this.layer, this.id) == 7) return 1.90;
                if (challengeCompletions(this.layer, this.id) == 8) return 2.15;
                if (challengeCompletions(this.layer, this.id) == 9) return 2.30;
                if (challengeCompletions(this.layer, this.id) == 10) return 2.48;
                if (challengeCompletions(this.layer, this.id) == 11) return 2.61;
                if (challengeCompletions(this.layer, this.id) == 12) return 2.89;
                if (challengeCompletions(this.layer, this.id) == 13) return 3.25;
                if (challengeCompletions(this.layer, this.id) == 14) return 3.74;
                if (challengeCompletions(this.layer, this.id) == 15) return 4.45;
                if (challengeCompletions(this.layer, this.id) == 16) return 5.00;
                if (challengeCompletions(this.layer, this.id) == 17) return 5.75;
                if (challengeCompletions(this.layer, this.id) == 18) return 6.35;
                if (challengeCompletions(this.layer, this.id) == 19) return 8.00;
                if (challengeCompletions(this.layer, this.id) == 20) return 10.00;
            },
            powers2() {
                if (challengeCompletions(this.layer, this.id) == 0) return 1e10;
                if (challengeCompletions(this.layer, this.id) == 1) return 1e20;
                if (challengeCompletions(this.layer, this.id) == 2) return 1e30;
                if (challengeCompletions(this.layer, this.id) == 3) return 1e40;
                if (challengeCompletions(this.layer, this.id) == 4) return 1e50;
                if (challengeCompletions(this.layer, this.id) == 5) return 1e60;
                if (challengeCompletions(this.layer, this.id) == 6) return 1e70;
                if (challengeCompletions(this.layer, this.id) == 7) return 1e80;
                if (challengeCompletions(this.layer, this.id) == 8) return 1e90;
                if (challengeCompletions(this.layer, this.id) == 9) return 1e100;
                if (challengeCompletions(this.layer, this.id) == 10) return 1e110;
                if (challengeCompletions(this.layer, this.id) == 11) return 1e120;
                if (challengeCompletions(this.layer, this.id) == 12) return 1e130;
                if (challengeCompletions(this.layer, this.id) == 13) return 1e140;
                if (challengeCompletions(this.layer, this.id) == 14) return 1e150;
                if (challengeCompletions(this.layer, this.id) == 15) return 1e160;
                if (challengeCompletions(this.layer, this.id) == 16) return 1e170;
                if (challengeCompletions(this.layer, this.id) == 17) return 1e180;
                if (challengeCompletions(this.layer, this.id) == 18) return 1e190;
                if (challengeCompletions(this.layer, this.id) == 19) return 1e200;
                if (challengeCompletions(this.layer, this.id) == 20) return 1e210;
            },
        currencyDisplayName: "points",
        currencyInternalName: "points",
    
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 10;
            if (challengeCompletions(this.layer, this.id) == 1) return 100;
            if (challengeCompletions(this.layer, this.id) == 2) return 1000;
            if (challengeCompletions(this.layer, this.id) == 3) return 1e5;
            if (challengeCompletions(this.layer, this.id) == 4) return 1e6;
            if (challengeCompletions(this.layer, this.id) == 5) return 1e7;
            if (challengeCompletions(this.layer, this.id) == 6) return 1e8;
            if (challengeCompletions(this.layer, this.id) == 7) return 1e9;
            if (challengeCompletions(this.layer, this.id) == 8) return 1e12;
            if (challengeCompletions(this.layer, this.id) == 9) return 1e18;
            if (challengeCompletions(this.layer, this.id) == 10) return 1e26;
            if (challengeCompletions(this.layer, this.id) == 11) return 1e35;
            if (challengeCompletions(this.layer, this.id) == 12) return 1e60;
            if (challengeCompletions(this.layer, this.id) == 13) return 1e90;
            if (challengeCompletions(this.layer, this.id) == 14) return 1e150;
            if (challengeCompletions(this.layer, this.id) == 15) return 1e200;
            if (challengeCompletions(this.layer, this.id) == 16) return 1e245;
            if (challengeCompletions(this.layer, this.id) == 17) return 1e270;
            if (challengeCompletions(this.layer, this.id) == 18) return 1e300;
            if (challengeCompletions(this.layer, this.id) == 19) return 1e305;
            if (challengeCompletions(this.layer, this.id) == 20) return 1e307;
        },
        rewardEffect() {
            let rew = new OmegaNum(this.rewards());
            return rew;
        },
        rewardDisplay() { return "Multipler is ×" + format(this.rewardEffect())+" to matter divication requiremenemt." },
        rewardDescription: "Concurrent multipler to Matter requirement divication based on challenges completed.",
        unlocked() {return player.up.unlocked},
        completionLimit: 20,
    },
    12: {
        name: "Derogatory Challenge 2",
   
        challengeDescription() {
            return "Machintruc gain is divided by ÷" + this.powers() +"."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
        goal(){
            if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(1e35);
            if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(1e47);
            if (challengeCompletions(this.layer, this.id) == 2) return new OmegaNum(1e66);
            if (challengeCompletions(this.layer, this.id) == 3) return new OmegaNum(1e84);
            if (challengeCompletions(this.layer, this.id) == 4) return new OmegaNum(1e127);
            if (challengeCompletions(this.layer, this.id) == 5) return new OmegaNum(1e165);
            if (challengeCompletions(this.layer, this.id) == 6) return new OmegaNum(1e235);
            if (challengeCompletions(this.layer, this.id) == 7) return new OmegaNum(1e288);
            if (challengeCompletions(this.layer, this.id) == 8) return new OmegaNum("1e370");
            if (challengeCompletions(this.layer, this.id) == 9) return new OmegaNum("1e500");
            if (challengeCompletions(this.layer, this.id) == 10) return new OmegaNum("1e768");
            if (challengeCompletions(this.layer, this.id) == 11) return new OmegaNum("1e1024");
            if (challengeCompletions(this.layer, this.id) == 12) return new OmegaNum("1e1375");
            if (challengeCompletions(this.layer, this.id) == 13) return new OmegaNum("1e1700");
            if (challengeCompletions(this.layer, this.id) == 14) return new OmegaNum("1e2450");
            if (challengeCompletions(this.layer, this.id) == 15) return new OmegaNum("1e3000");
            if (challengeCompletions(this.layer, this.id) == 16) return new OmegaNum("1e3800");
            if (challengeCompletions(this.layer, this.id) == 17) return new OmegaNum("1e4600");
            if (challengeCompletions(this.layer, this.id) == 18) return new OmegaNum("1e6800");
            if (challengeCompletions(this.layer, this.id) == 19) return new OmegaNum("1e8300");
            if (challengeCompletions(this.layer, this.id) == 20) return new OmegaNum("1e10500");
        },
        powers() {
            if (challengeCompletions(this.layer, this.id) == 0) return 4;
            if (challengeCompletions(this.layer, this.id) == 1) return 6;
            if (challengeCompletions(this.layer, this.id) == 2) return 8;
            if (challengeCompletions(this.layer, this.id) == 3) return 10;
            if (challengeCompletions(this.layer, this.id) == 4) return 12;
            if (challengeCompletions(this.layer, this.id) == 5) return 14;
            if (challengeCompletions(this.layer, this.id) == 6) return 16;
            if (challengeCompletions(this.layer, this.id) == 7) return 18;
            if (challengeCompletions(this.layer, this.id) == 8) return 20;
            if (challengeCompletions(this.layer, this.id) == 9) return 22;
            if (challengeCompletions(this.layer, this.id) == 10) return 24;
            if (challengeCompletions(this.layer, this.id) == 11) return 26;
            if (challengeCompletions(this.layer, this.id) == 12) return 28;
            if (challengeCompletions(this.layer, this.id) == 13) return 30;
            if (challengeCompletions(this.layer, this.id) == 14) return 32;
            if (challengeCompletions(this.layer, this.id) == 15) return 34;
            if (challengeCompletions(this.layer, this.id) == 16) return 36;
            if (challengeCompletions(this.layer, this.id) == 17) return 38;
            if (challengeCompletions(this.layer, this.id) == 18) return 40;
            if (challengeCompletions(this.layer, this.id) == 19) return 42;
            if (challengeCompletions(this.layer, this.id) == 20) return 44;
        },
       
        currencyDisplayName: "points",
        currencyInternalName: "points",
    
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.05;
            if (challengeCompletions(this.layer, this.id) == 2) return 1.1;
            if (challengeCompletions(this.layer, this.id) == 3) return 1.15;
            if (challengeCompletions(this.layer, this.id) == 4) return 1.2;
            if (challengeCompletions(this.layer, this.id) == 5) return 1.25;
            if (challengeCompletions(this.layer, this.id) == 6) return 1.3;
            if (challengeCompletions(this.layer, this.id) == 7) return 1.35;
            if (challengeCompletions(this.layer, this.id) == 8) return 1.4;
            if (challengeCompletions(this.layer, this.id) == 9) return 1.45;
            if (challengeCompletions(this.layer, this.id) == 10) return 1.5;
            if (challengeCompletions(this.layer, this.id) == 11) return 1.55;
            if (challengeCompletions(this.layer, this.id) == 12) return 1.6;
            if (challengeCompletions(this.layer, this.id) == 13) return 1.65;
            if (challengeCompletions(this.layer, this.id) == 14) return 1.7;
            if (challengeCompletions(this.layer, this.id) == 15) return 1.75;
            if (challengeCompletions(this.layer, this.id) == 16) return 1.8;
            if (challengeCompletions(this.layer, this.id) == 17) return 1.85;
            if (challengeCompletions(this.layer, this.id) == 18) return 1.9;
            if (challengeCompletions(this.layer, this.id) == 19) return 1.95;
            if (challengeCompletions(this.layer, this.id) == 20) return 2;
        },
        rewardEffect() {
            let rew = new OmegaNum(this.rewards());
            return rew;
        },
        rewardDisplay() { return "Points gain is raised to the power of " + format(this.rewardEffect())+"." },
        rewardDescription: "Points gain is raised based on your challenges completed.",
        unlocked() {return player.up.unlocked},
        completionLimit: 20,
    },
    21: {
        name: "Derogatory Challenge 3",
   
        challengeDescription() {
            return "<b>Booster I</b> upgrade does nothing."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
        goal(){
            if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(1e9);
            if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(1e10);
            if (challengeCompletions(this.layer, this.id) == 2) return new OmegaNum(1e11);
            if (challengeCompletions(this.layer, this.id) == 3) return new OmegaNum(1e12);
            if (challengeCompletions(this.layer, this.id) == 4) return new OmegaNum(1e13);
            if (challengeCompletions(this.layer, this.id) == 5) return new OmegaNum(1e14);
            if (challengeCompletions(this.layer, this.id) == 6) return new OmegaNum(1e15);
            if (challengeCompletions(this.layer, this.id) == 7) return new OmegaNum(1e16);
            if (challengeCompletions(this.layer, this.id) == 8) return new OmegaNum("1e17");
            if (challengeCompletions(this.layer, this.id) == 9) return new OmegaNum("1e18");
            if (challengeCompletions(this.layer, this.id) == 10) return new OmegaNum("1e19");
            if (challengeCompletions(this.layer, this.id) == 11) return new OmegaNum("1e20");
            if (challengeCompletions(this.layer, this.id) == 12) return new OmegaNum("1e21");
            if (challengeCompletions(this.layer, this.id) == 13) return new OmegaNum("1e22");
            if (challengeCompletions(this.layer, this.id) == 14) return new OmegaNum("1e23");
            if (challengeCompletions(this.layer, this.id) == 15) return new OmegaNum("1e24");
            if (challengeCompletions(this.layer, this.id) == 16) return new OmegaNum("1e25");
            if (challengeCompletions(this.layer, this.id) == 17) return new OmegaNum("1e26");
            if (challengeCompletions(this.layer, this.id) == 18) return new OmegaNum("1e27");
            if (challengeCompletions(this.layer, this.id) == 19) return new OmegaNum("1e28");
            if (challengeCompletions(this.layer, this.id) == 20) return new OmegaNum("1e29");
        },
       
       
        currencyDisplayName: "points",
        currencyInternalName: "points",
    
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1.0;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.5;
            if (challengeCompletions(this.layer, this.id) == 2) return 1.6;
            if (challengeCompletions(this.layer, this.id) == 3) return 1.7;
            if (challengeCompletions(this.layer, this.id) == 4) return 1.8;
            if (challengeCompletions(this.layer, this.id) == 5) return 1.9;
            if (challengeCompletions(this.layer, this.id) == 6) return 2;
            if (challengeCompletions(this.layer, this.id) == 7) return 2.1;
            if (challengeCompletions(this.layer, this.id) == 8) return 2.2;
            if (challengeCompletions(this.layer, this.id) == 9) return 2.3;
            if (challengeCompletions(this.layer, this.id) == 10) return 2.4;
            if (challengeCompletions(this.layer, this.id) == 11) return 2.5;
            if (challengeCompletions(this.layer, this.id) == 12) return 2.6;
            if (challengeCompletions(this.layer, this.id) == 13) return 2.7;
            if (challengeCompletions(this.layer, this.id) == 14) return 2.8;
            if (challengeCompletions(this.layer, this.id) == 15) return 2.9;
            if (challengeCompletions(this.layer, this.id) == 16) return 3;
            if (challengeCompletions(this.layer, this.id) == 17) return 3.1;
            if (challengeCompletions(this.layer, this.id) == 18) return 3.2;
            if (challengeCompletions(this.layer, this.id) == 19) return 3.3;
            if (challengeCompletions(this.layer, this.id) == 20) return 3.4;
        },
        rewardEffect() {
            let rew = new OmegaNum(this.rewards());
            return rew;
        },
        rewardDisplay() { return "Multipler is  " + format(this.rewardEffect())+"x." },
        rewardDescription: "Concurrent multipler to the Paradox gain.",
  
        unlocked() {return hasUpgrade("p",44)},
        completionLimit: 20,
    },
    22: {
        name: "Derogatory Challenge 4",
   
        challengeDescription() {
            return "All previous challenges are applied to once."
            
        },
        goal(){
            if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(1e7);
            if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(1e7);
        },
       
       
        currencyDisplayName: "points",
        currencyInternalName: "points",
    
      
        rewardDescription: "Unlock Generators and do nothing else.",
        unlocked() {return (challengeCompletions("up", 21) >= 2)},
 countsAs: [11,12,21]
    },
}
})

addLayer("pw", {
    name: "power station", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PW", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),

    }},
    color: "#6b6b6b",
    requires: new EN(1e45), // Can be a function that takes requirement increases into account
    resource: "power stations", // Name of prestige currency
    baseResource: "machintruc systems", // Name of resource prestige is based on
    baseAmount() {return player.ma.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.02, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (player.pw.unlocked) mult = mult.times(tmp.ma.buyables[12].effect.first)
        if (hasUpgrade("g",11)) mult = mult.times(20)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)

       return exp;
    },
  
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    milestones: {
        0: {
            requirementDescription: "1 Power Station",
            done() { return player.pw.points.gte(1) },
           
            effectDescription: "Permanently keep Machintruc & Matter upgrades on reset.",
        },
        1: {
            requirementDescription: "100 Power Stations",
            done() { return player.pw.points.gte(100) },
           
            effectDescription: "Unlock Automator Robots",
        },
        2: {
            requirementDescription: "1e10 Power Stations",
            done() { return player.pw.points.gte(1e10)&&hasMilestone("pw",1) },
            unlocked() { return hasMilestone("pw",1) },
            effectDescription: "Unlock Scrolls",
        },
        3: {
            requirementDescription: "1e512 Power Stations",
            done() { return player.pw.points.gte("1e512")&&hasMilestone("pw",2) },
            unlocked() { return hasMilestone("pw",2) },
            effectDescription: "When discovering a new lost Scroll, your progress won't be reset.",
        },
    },
    layerShown(){return hasMilestone("p",1)},
 branches: ["ma",["b",2],"g"],
 
 tabFormat: {
    "Milestones": {
        buttonStyle() { return {'background-color': '#6b6b6b'} },
        content: ["main-display",
        "prestige-button",
        "resource-display", "blank",
        "milestones",
        "blank", 
        "blank",
    ]},
    "Robots": {
        
        unlocked() { return hasMilestone("pw",1) },
        content: ["main-display",
        "prestige-button",
        "resource-display", "blank",
        "blank",
        ["display-text",
        function() {return 'Robots automate one of the currencies in layers, buyables and clickables.'},
            {}],
        "blank",
        ["display-text",
        function() {return 'You need to purchase one of the Robots by spending your Power Stations, whose the curency is harsh based on the ability to automate in early stages.'},
            {}],
            "blank",
            "blank",
            "clickables",
            "blank",
            "upgrades",
        ]},
},
upgrades: {
    11: {
       
        description: "Unlock the Matter Robot",
        cost: new EN(100),
       
    },
    12: {
      
        description: "Unlock the Booster Robot",
        cost: new EN(500),
       
    },
  
},
clickables: {
    rows: 7,
    cols: 4,
    11: {
        title: "Matter Robot",
        display(){
            return hasUpgrade("pw", 11)?(player.m.auto?"On":"Off"):"Locked"
        },
        unlocked() { return hasUpgrade("pw", 11) },
       canClick() { return hasUpgrade("pw", 11) },
        onClick() { player.m.auto = !player.m.auto },
        style: {"background-color"() { return player.m.auto?"#FFFFFF":"#666666" }},
    },
    12: {
        title: "Booster Robot",
        display(){
            return hasUpgrade("pw", 12)?(player.b.auto?"On":"Off"):"Locked"
        },
        unlocked() { return hasUpgrade("pw", 12) },
       canClick() { return hasUpgrade("pw", 12) },
        onClick() { player.b.auto = !player.b.auto },
        style: {"background-color"() { return player.b.auto?"#ffff00":"#666666" }},
    },
    13: {
        title: "Machintruc Robot",
        display(){
            return hasUpgrade("p", 24)?(player.ma.autoMp?"On":"Off"):"Locked"
        },
        unlocked() { return hasUpgrade("p", 24) },
       canClick() { return hasUpgrade("p", 24) },
        onClick() { player.ma.autoMp = !player.ma.autoMp },
        style: {"background-color"() { return player.ma.autoMp?"gray":"#666666" }},
    },
    21: {
        title: "Powerly Robot",
        display(){
            return hasUpgrade("p", 24)?(player.ma.autoPm?"On":"Off"):"Locked"
        },
        unlocked() { return hasUpgrade("p", 34) },
       canClick() { return hasUpgrade("p", 34) },
        onClick() { player.ma.autoPm = !player.ma.autoPm },
        style: {"background-color"() { return player.ma.autoPm?"gray":"#666666" }},
    },
},
})
addLayer("pa", {
    name: "paradox", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),

    }},
    color: "#ff00fb",
    requires: new EN(1e58), // Can be a function that takes requirement increases into account
    resource: "paradox", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade('pa', 11)) mult = mult.times(upgradeEffect("pa",11))
        if (hasChallenge('up', 21)) mult = mult.times(challengeEffect("up",21))
        if (player.g.unlocked) mult = mult.times(player.g.power);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
   
       return exp;
    },
    softcap: new EN(8000),
    softcapPower: 0.0025,
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
 
    layerShown(){return hasMilestone("p",1)},
  
    
   
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("m", 2)) keep.push("upgrades")
      
        if (layers[resettingLayer].row > this.row) layerDataReset("pa", keep)
    },
   
    upgrades: {
        11: {
            title: "Paradox I",
            description: "Paradox multiply its own gain",
            cost: new EN(1),
            effect() {
                let eff = player.pa.points.add(1).pow(0.005)
                if (eff.gte(25)) eff = eff.div(1e10).log10().plus(25)
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("pa", 11)) },
        },
        12: {
            title: "Paradox II",
            description: "Paradox multiply Points gain",
            cost: new EN(1e10),
            effect() {
                let eff = player.pa.points.add(1).pow(0.002)
              
                return eff;
            },
            effectDisplay() { return "×"+format(upgradeEffect("pa", 12)) },
            unlocked() { return hasUpgrade("pa",11) },
        },
    }

})
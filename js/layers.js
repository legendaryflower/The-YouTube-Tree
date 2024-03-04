addLayer("v", {
    name: "videos", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🎬", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(1), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "grey",
    requires: new EN(75), // Can be a function that takes requirement increases into account
    resource: "videos", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    base: 2.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade("p", 22)) mult = mult.times(upgradeEffect("p", 22).s);
        if (player.v.points.gte(7)) mult = mult.times(7);
        if (player.v.points.gte(8)) mult = mult.times("ee100");
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
  
   onPrestige ()
   {
    player.p.points = new EN(0)
   },

 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("v", keep)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
   
  
})
addLayer("vi", {
    name: "views", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "👁", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "cyan",
    requires: new EN(1), // Can be a function that takes requirement increases into account
    resource: "views", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade("p",31)) mult = mult.times(upgradeEffect("p",31));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
    tabFormat: ["blank",
    ["display-text",
    function() {return '<h3>You have </h3><h2> ' + formatWhole(player.vi.points) + ' </h2> Views.'},
        {}],
			"blank",
			"blank",
            ["display-text",
            function() {return 'You gain Views for every Videos you have.'},
                {}],
			"blank",
            "resource-display",
			"milestones", "blank", "blank", "upgrades"],
    passiveGeneration() { return (true)?0.01:0 },
 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("vi", keep)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["v"],
    hotkeys: [
        {key: "v", description: "V: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
   
   
})
addLayer("s", {
    name: "subs", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⏩", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "red",
    requires: new EN(1), // Can be a function that takes requirement increases into account
    resource: "subscribers", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade("p",31)) mult = mult.times(upgradeEffect("p",31));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
       if (hasUpgrade("p", 23)) exp = exp.plus(0.1);
       return exp;
    },
    tabFormat: ["blank",
    ["display-text",
    function() {return '<h3>You have </h3><h2> ' + formatWhole(player.s.points) + ' </h2> Subscribers.'},
        {}],
			"blank",
			"blank",
            ["display-text",
            function() {return 'You gain Subscribers for every Videos you have.'},
                {}],
			"blank",
           "resource-display",
			"milestones", "blank", "blank", "upgrades"],
    passiveGeneration() { return (true)?0.001:0 },
 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("s", keep)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["v"],
    hotkeys: [
        {key: "v", description: "V: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
   
 
})
addLayer("p", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⭐", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "white",
    requires: new EN(1), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    baseResource: "video", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
      if (hasUpgrade("p",11)) mult = mult.times(1.5);
      if (hasUpgrade("p",12)) mult = mult.times(upgradeEffect("p",12));
      if (hasUpgrade("p",13)) mult = mult.times(upgradeEffect("p",13));
      if (hasUpgrade("p",21)) mult = mult.times(upgradeEffect("p",21));
      if (hasUpgrade("p",31)) mult = mult.times(upgradeEffect("p",31));
      if (hasUpgrade("p", 22)) mult = mult.plus(upgradeEffect("p", 22).v);
      
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
    tabFormat: ["blank",
    ["display-text",
    function() {return '<h3>You have </h3><h2> ' + formatWhole(player.p.points) + ' </h2> Points.'},
        {}],
			"blank",
			"blank",
           
			"blank",
			"milestones", "blank", "blank", "upgrades"],
    passiveGeneration() { return (true)?1:0 },
 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
   
    hotkeys: [
        {key: "v", description: "V: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
   
    upgrades: {
        11: {
            title: "Promotion",
            description: "Increase the Points gain by 50%.",
            cost: new EN(200),
            unlocked() {return hasUpgrade("p",11)||player.p.points.gte(200)}
           
        },
        12: {
            title: "Sharing",
            description: "Points multiply their own gain.",
            cost: new EN(600),
            effect() {
               
                let eff = player.p.points.add(1).pow(0.1)
                return eff;
            },
            effectDisplay() { return format(upgradeEffect("p", 12))+"x" },
            unlocked() {return hasUpgrade("p",12)||player.p.points.gte(600)}
           
        },
        13: {
            title: "Exporting",
            description: "Videos multiply Points gain.",
            cost: new EN(2500),
            effect() {
               
                let eff = player.p.points.add(1).pow(0.04)
                return eff;
            },
            effectDisplay() { return format(upgradeEffect("p", 13))+"x" },
            unlocked() {return hasUpgrade("p",13)||player.p.points.gte(2500)}
           
        },
        21: {
            title: "Reviewing",
            description: "Views multiply Points gain.",
            cost: new EN(10),
            effect() {
               
                let eff = player.vi.points.add(1).pow(0.05)

                return eff;
            },
            
            currencyDisplayName: "views",
            currencyInternalName: "points",
            currencyLayer: "vi",

            effectDisplay() { return format(upgradeEffect("p", 21))+"x" },
            unlocked() {return hasUpgrade("p",21)||player.vi.points.gte(10)}
           
        },
        22: {
            title: "Promoting",
            description: "Videos adds to the Points gain but increase the cost requirement of Videos based on Subscribers.",
            cost: new EN(20),
            effect() {
                
                
                let exp = 1
                return {v: player.v.points.add(0.05).log10().pow(exp), s: player.s.points.add(1e5).log10().pow(exp)} 
            },
 
            effectDisplay() { return "+"+format(tmp.p.upgrades[22].effect.v)+" to Points gain, "+format(tmp.p.upgrades[22].effect.s)+"x to Video's cost requirement" },
            
            currencyDisplayName: "views",
            currencyInternalName: "points",
            currencyLayer: "vi",


            unlocked() {return hasUpgrade("p",22)||player.vi.points.gte(20)}
           
        },
        23: {
            title: "Channel Share",
            description: "Increase the Subscribers' exponent a little bit.",
            cost: new EN(30),
            
            currencyDisplayName: "views",
            currencyInternalName: "points",
            currencyLayer: "vi",


            unlocked() {return hasUpgrade("p",23)||player.vi.points.gte(30)}
           
        },
        31: {
            title: "Interviewing",
            description: "Subscribers multiply Points gain, Views gain and Subscribers gain.",
            cost: new EN(5),
            effect() {
               
                let eff = player.s.points.add(1).pow(0.5)

                return eff;
            },
            
            currencyDisplayName: "subscribers",
            currencyInternalName: "points",
            currencyLayer: "s",

            effectDisplay() { return format(upgradeEffect("p", 31))+"x" },
            unlocked() {return hasUpgrade("p",31)||player.s.points.gte(5)}
           
        },
        
    },
})


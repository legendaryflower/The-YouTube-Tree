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
        if (player.v.points.gte(11)) mult = mult.times(7e7);
        if (player.v.points.gte(50)) mult = mult.times("ee100");
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
    autoPrestige() { return (hasUpgrade("r",11)) },
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
addLayer("q", {
    name: "vidIQ", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🥇", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "violet",
    requires: new EN(9), // Can be a function that takes requirement increases into account
    resource: "vidIQ", // Name of prestige currency
    baseResource: "videos", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    base: 2.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
      if (hasUpgrade("q",13)) mult = mult.div(upgradeEffect("q",13))       
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
  
    onPrestige() {
        player.p.points = new EN(0)
        player.v.points = new EN(1)
                    },

 branches: ["v"],
 autoPrestige() { return (hasUpgrade("r",12)) },
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("q", keep)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)

    layerShown(){return hasUpgrade("p",33)},
    upgrades: {
        11: {
            title: "Promotion II",
            description: "Increase the Points gain by 100% and increase the views gain by 50%.",
            cost: new EN(1),
            unlocked() {return player.q.unlocked}
           
        },
        12: {
            title: "Sharing II",
            description: "Double the views and subscribers gain.",
            cost: new EN(1),
            unlocked() {return player.q.unlocked}
           
        },
        13: {
            title: "Exporting II",
            description: "vidIQ cost requirement is divided based on Points",
            cost: new EN(1),
            effect() {
               
                let eff = player.p.points.add(1).pow(0.1)
                if (eff.gte(3)) eff = new EN(3)
                return eff;
            },
            effectDisplay() { return "/"+format(upgradeEffect("q", 13))},
            unlocked() {return player.q.unlocked}
           
        },
        31: {
            title: "Ads",
            description: "You can monetize, which you get money from ads in your videos.",
            cost: new EN(1500),
            effect() {
               
                let eff = player.p.points.add(1).pow(0.1)
                if (eff.gte(3)) eff = new EN(3)
                return eff; 
            },
            style: {width: "160px", height: "160px"},
            currencyDisplayName: "subscribers",
            currencyInternalName: "points",
            currencyLayer: "s",
   
            unlocked() {return hasUpgrade("q",31)||player.s.points.gte(1000)}
           
        },
        14: {
            title: "Progression Slow?",
            description: "Subscribers boost Points gain, and Point upgrades related to points boosting will be multipled by 2. Also unlock Automators",
            cost: new EN(1),
            effect() {
               
                let eff = player.s.points.add(1).pow(0.25)
                if (eff.gte(3)) eff = new EN(3)
                return eff;
            },
            effectDisplay() { return format(upgradeEffect("q", 14))+"x"},
            unlocked() {return hasUpgrade("q",11)&&hasUpgrade("q",12)&&hasUpgrade("q",13)}
           
        },
        15: {
            title: "Learn YouTube",
            description: "Unlock YouTube Academy",
            cost: new EN(3),
            unlocked() {return hasUpgrade("r",12)}
           
        },
        16: {
            title: "Cash Income",
            description: "You gain thrice the cash.",
            cost: new EN(3),
            unlocked() {return hasChallenge("q",11)}
           
        },
        
    },
    challenges: {
      11: {
        name: "Copyright School",
   
        challengeDescription() {
            return "Points gain is divided by " + this.powers() +". The exponents of Views and Subs are reduced by /" + this.powers2() +"."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
         goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(100000);
                if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(1000000);
                if (challengeCompletions(this.layer, this.id) == 2) return new OmegaNum(1e7);
                if (challengeCompletions(this.layer, this.id) == 3) return new OmegaNum(1e8);
                if (challengeCompletions(this.layer, this.id) == 4) return new OmegaNum(1e150);
                if (challengeCompletions(this.layer, this.id) == 5) return new OmegaNum("ee100");
   
            },
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 100;
                if (challengeCompletions(this.layer, this.id) == 1) return 1000;
                if (challengeCompletions(this.layer, this.id) == 2) return 10000;
                if (challengeCompletions(this.layer, this.id) == 3) return 100000;
                if (challengeCompletions(this.layer, this.id) == 4) return 1e40;
                if (challengeCompletions(this.layer, this.id) == 5) return 1e200;

            },
            powers2() {
                if (challengeCompletions(this.layer, this.id) == 0) return 5;
                if (challengeCompletions(this.layer, this.id) == 1) return 25;
                if (challengeCompletions(this.layer, this.id) == 2) return 125;
                if (challengeCompletions(this.layer, this.id) == 3) return 6125;
                if (challengeCompletions(this.layer, this.id) == 4) return 1e10;
                if (challengeCompletions(this.layer, this.id) == 5) return 1e75;

            },
        currencyDisplayName: "points",
        currencyInternalName: "points",
        currencyLayer: "p",
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.75;
            if (challengeCompletions(this.layer, this.id) == 2) return 2.25;
            if (challengeCompletions(this.layer, this.id) == 3) return 2.74;
            if (challengeCompletions(this.layer, this.id) == 4) return 1e10;
            if (challengeCompletions(this.layer, this.id) == 5) return 1e95;
          
        },
        rewardEffect() {
            let rew = new OmegaNum(this.rewards());
            return rew;
        },
        onEnter ()
        {
         player.v.points = new EN(11)
         player.p.points = new EN(0)
        },
        rewardDisplay() { return "Multipler is " + format(this.rewardEffect())+"x to points gain" },
        rewardDescription: "Concurrent multipler to Points gain based on challenges completed.",
        unlocked() {return hasUpgrade("q",15)},
        completionLimit: 5,
     
    },
    12: {
        name: "Community Guidelines Training",
   
        challengeDescription() {
            return "<b>Sharing</b> is useless, almost all Points upgrades are divided by " + this.powers() +"."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
         goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(5e4);
                if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(5e5);
                if (challengeCompletions(this.layer, this.id) == 2) return new OmegaNum(5e8);
                if (challengeCompletions(this.layer, this.id) == 3) return new OmegaNum(5e20);
                if (challengeCompletions(this.layer, this.id) == 4) return new OmegaNum("ee600");
                if (challengeCompletions(this.layer, this.id) == 5) return new OmegaNum("eeeee60");
   
            },
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 5;
                if (challengeCompletions(this.layer, this.id) == 1) return 10;
                if (challengeCompletions(this.layer, this.id) == 2) return 15;
                if (challengeCompletions(this.layer, this.id) == 3) return 20;
                if (challengeCompletions(this.layer, this.id) == 4) return 1e75;
                if (challengeCompletions(this.layer, this.id) == 5) return 1e305;

            },
          
        currencyDisplayName: "points",
        currencyInternalName: "points",
        currencyLayer: "p",
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.5;
            if (challengeCompletions(this.layer, this.id) == 2) return 2;
            if (challengeCompletions(this.layer, this.id) == 3) return 2.5;
            if (challengeCompletions(this.layer, this.id) == 4) return 50;
            if (challengeCompletions(this.layer, this.id) == 5) return 1e10;
          
        },
        rewardEffect() {
            let rew = new OmegaNum(this.rewards());
            return rew;
        },
        onEnter ()
        {
         player.v.points = new EN(11)
         player.p.points = new EN(0)
        },
        rewardDisplay() { return "Multipler is " + format(this.rewardEffect())+"x to gaining revenue" },
        rewardDescription: "You get more revenue income based on this challenge completion.",
        unlocked() {return hasChallenge("q",11)},
        completionLimit: 5,
     
    }
}
})
addLayer("m", {
    name: "money", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "💲", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "green",
    requires: new EN(3), // Can be a function that takes requirement increases into account
    resource: "dollars", // Name of prestige currency
    baseResource: "vidIQ", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade("q",16)) mult = mult.times(3);
        if (hasChallenge("q",12)) mult = mult.times(upgradeEffect("q",12));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
  


 branches: ["q"],
 tabFormat: ["blank",
 ["display-text",
 function() {return '<h3>From all of your videos, you got a revenue of </h3><h2> ' + formatWhole(player.m.points) + ' </h2> dollars.'},
     {}],
         "blank",
         "blank",
         ["display-text",
         function() {return "You're gaining 10% of the revenue per how many vidIQ you have."},
             {}],
         "blank",],
 
    row: 1, // Row the layer is in on the tree (0 is the first row)
    passiveGeneration() { return (true)?0.1:0 },
    layerShown(){return hasUpgrade("q",31)},
    
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
    softcap: new EN(10),
    softcapPower: 0.1,
    color: "cyan",
    requires: new EN(1), // Can be a function that takes requirement increases into account
    resource: "views", // Name of prestige currency
    baseResource: "videos", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade("p",31)) mult = mult.times(upgradeEffect("p",31));
        if (hasUpgrade("q",11)) mult = mult.times(1.5);
        if (hasUpgrade("q",12)) mult = mult.times(2);
 
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
       if (inChallenge("q", 11)) exp = exp.div(challengeNerf2("q", 11));
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
    softcap: new EN(10),
    softcapPower: 0.1,
    requires: new EN(1), // Can be a function that takes requirement increases into account
    resource: "subscribers", // Name of prestige currency
    baseResource: "videos", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
        if (hasUpgrade("p",31)) mult = mult.times(upgradeEffect("p",31));
        if (hasUpgrade("p",32)) mult = mult.pow(upgradeEffect("p",32));
        if (hasUpgrade("q",12)) mult = mult.times(2);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
       if (hasUpgrade("p", 23)) exp = exp.plus(0.1);
       if (inChallenge("q", 11)) exp = exp.div(challengeNerf2("q", 11));
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
      if (hasUpgrade("q",11)) mult = mult.times(2);
      if (hasUpgrade("q",14)) mult = mult.times(upgradeEffect("q",14));
      if (inChallenge("q", 11)) mult = mult.div(challengeNerf("q", 11));
      if (hasChallenge("q", 11)) mult = mult.times(challengeEffect("q", 11));
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
               
                if (inChallenge("q",12)) return new EN(1)

                let eff = player.p.points.add(1).pow(0.1)
                if (hasUpgrade("p",33)) eff = eff.times(1.01)
                if (hasUpgrade("q",14)) eff = eff.times(2)
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
                if (hasUpgrade("p",33)) eff = eff.times(1.01)
                if (hasUpgrade("q",14)) eff = eff.times(2)
                if (inChallenge("q",12)) eff = eff.div(challengeNerf("q",12))
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
                if (hasUpgrade("p",33)) eff = eff.times(1.01)
                if (hasUpgrade("q",14)) eff = eff.times(2)
                if (inChallenge("q",12)) eff = eff.div(challengeNerf("q",12))
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
                if (hasUpgrade("p",33)) eff = eff.times(1.01)
                if (hasUpgrade("q",14)) eff = eff.times(2)
                if (inChallenge("q",12)) eff = eff.div(challengeNerf("q",12))
                return eff;
            },
            
            currencyDisplayName: "subscribers",
            currencyInternalName: "points",
            currencyLayer: "s",

            effectDisplay() { return format(upgradeEffect("p", 31))+"x" },
            unlocked() {return hasUpgrade("p",31)||player.s.points.gte(5)}
           
        },
        32: {
            title: "Uploading",
            description: "Subscribers exponenate their own gain.",
            cost: new EN(10),
            effect() {
               
                let eff = player.s.points.add(1).pow(0.04)
                if (hasUpgrade("p",33)) eff = eff.times(1.01)
                if (inChallenge("q",12)) eff = eff.div(challengeNerf("q",12))
                return eff;
            },
            
            currencyDisplayName: "subscribers",
            currencyInternalName: "points",
            currencyLayer: "s",

            effectDisplay() { return "^"+format(upgradeEffect("p", 32)) },
            unlocked() {return hasUpgrade("p",32)||player.s.points.gte(10)}
           
        },
        33: {
            title: "Boosting",
            description: "Unlock vidIQ and all upgrades are boosted by 1%.",
            cost: new EN(15),
            unlocked() {return hasUpgrade("p",33)||player.s.points.gte(15)}
           
        },
    },
})

addLayer("r", {
    name: "automation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🤖", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "darkgray",
    requires: new EN(1), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    baseResource: "video", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
    
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
    tooltip() {return "Automation"},
    tabFormat: ["blank",
    ["display-text",
    function() {return '<h3>Automation</h3>'},
        {}],
			"blank",
			"blank",
           
			"blank",
			"milestones", "blank", "blank", "upgrades"],

 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
   
   branches: ["s","vi","m"],
    layerShown(){return hasUpgrade("q",14)},
    upgrades: {
        11: {
            description: "Unlock the Videos automator",
            cost: new EN(25000000),
            unlocked() {return player.r.unlocked},
              
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLayer: "p",
        },
        12: {
            description: "Unlock the vidIQ automator",
            cost: new EN(1.25e9),
            unlocked() {return player.m.unlocked},
              
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLayer: "p",
        },
    },
})


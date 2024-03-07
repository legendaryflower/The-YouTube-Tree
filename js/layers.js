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
        if (player.v.points.gte(12)) mult = mult.times(7e44);
        if (player.v.points.gte(50)) mult = mult.times("ee100");
        if (hasChallenge("q", 13)) mult = mult.div(challengeEffect("q", 13));
        if (hasUpgrade("q",22)) mult = mult.div(upgradeEffect("q",22))
        if (hasUpgrade("q",25)) mult = mult.times(2);
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
   resetsNothing() { return hasMilestone("pb",0) },
 
   
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
      if (hasChallenge("q", 13)) mult = mult.div(challengeEffect("q", 13));
      if (hasUpgrade("q",22)) mult = mult.div(upgradeEffect("q",22))    
      if (hasUpgrade("tr",14)) mult = mult.div(upgradeEffect("tr",14))    
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
          
            style: {width: "160px", height: "160px"},
            currencyDisplayName: "subscribers",
            currencyInternalName: "points",
            currencyLayer: "s",
   
            unlocked() {return hasUpgrade("q",31)||player.s.points.gte(1000)}
           
        },
        32: {
            title: "Device",
            description: "Give a 100x multipler to the Points gain.",
            cost: new EN(1000),
          
            style: {width: "160px", height: "160px"},
            currencyDisplayName: "dollars",
            currencyInternalName: "points",
            currencyLayer: "m",
   
            unlocked() {return hasUpgrade("q",32)||player.m.points.gte(1000)}
           
        },
        33: {
            title: "Supercomputer",
            description: "Give a 100x multipler to the Trophy gain.",
            cost: new EN(2.5e35),
          
            style: {width: "160px", height: "160px"},
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
   
   
            unlocked() {return hasUpgrade("q",26)}
           
        },
        34: {
            title: "Hypercomputer",
            description: "Give a 1e5x multipler to the Trophy gain.",
            cost: new EN(1e37),
          
            style: {width: "160px", height: "160px"},
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
   
   
            unlocked() {return hasUpgrade("q",33)}
           
        },
        41: {
            title: "Gaming PC",
            description: "Give a 1e4x multipler to the Points gain.",
            cost: new EN(10000),
          
            style: {width: "320px", height: "320px"},
            currencyDisplayName: "dollars",
            currencyInternalName: "points",
            currencyLayer: "m",
   
            unlocked() {return hasUpgrade("q",41)||player.m.points.gte(10000)}
           
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
        21: {
            title: "Rich Moose",
            description: "Exponenate the revenue income by 1.2.",
            cost: new EN(4),
            unlocked() {return hasChallenge("q",13)}
           
        },
        22: {
            title: "vidIQ Pro",
            description: "Divide the cost requirements of vidIQ and Videos based on your vidIQ.",
            cost: new EN(4),
            effect() {
                let eff = OmegaNum.pow(1.2, player.q.upgrades.length);
                if (eff.gte(12.83)) eff = new EN(12.83)
                return eff;
            },
            effectDisplay() { return "/"+format(upgradeEffect("q", 22))},
            unlocked() {return hasUpgrade("q",21)}
           
        },
        23: {
            title: "AI",
            description: "For every vidIQ upgrades you have, multiply the Points gain.",
            cost: new EN(14),
            effect() {
                let eff = OmegaNum.pow(1.05, player.q.upgrades.length);
        
                return eff;
            },
            effectDisplay() { return format(upgradeEffect("q", 23))+"x"},
            unlocked() {return hasUpgrade("q",22)}
           
        },
        24: {
            title: "YouTuber",
            description: "Unlock Content and raise the Subscribers and Views points gain based on Points.",
            cost: new EN(21),
            effect() {
               
                let eff = player.p.points.add(1).pow(0.011)
          
                return eff;
            },
            effectDisplay() { return "^"+format(upgradeEffect("q", 24))},
            unlocked() {return hasUpgrade("q",23)}
           
        },
        25: {
            title: "YouTube Star",
            description: "Trophies' gain is increased by 50 but double the Videos cost requirement.",
            cost: new EN(5e33),
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
      
            unlocked() {return hasUpgrade("q",25)||player.points.gte(5e33)}
           
        },
        26: {
            title: "Underrated",
            description: "<b>Exporting</b> is boosted slightly.",
            cost: new EN(5e34),
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
      
            unlocked() {return hasUpgrade("q",25)}
           
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
                
   
            },
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 100;
                if (challengeCompletions(this.layer, this.id) == 1) return 1000;
                if (challengeCompletions(this.layer, this.id) == 2) return 10000;
              

            },
            powers2() {
                if (challengeCompletions(this.layer, this.id) == 0) return 5;
                if (challengeCompletions(this.layer, this.id) == 1) return 25;
                if (challengeCompletions(this.layer, this.id) == 2) return 125;
          

            },
        currencyDisplayName: "points",
        currencyInternalName: "points",
        currencyLayer: "p",
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.75;
            if (challengeCompletions(this.layer, this.id) == 2) return 2.25;
            if (challengeCompletions(this.layer, this.id) == 3) return 2.75;
          
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
        completionLimit: 3,
     
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
 
   
            },
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 5;
                if (challengeCompletions(this.layer, this.id) == 1) return 10;
                if (challengeCompletions(this.layer, this.id) == 2) return 15;
   

            },
          
        currencyDisplayName: "points",
        currencyInternalName: "points",
        currencyLayer: "p",
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.5;
            if (challengeCompletions(this.layer, this.id) == 2) return 2;
            if (challengeCompletions(this.layer, this.id) == 3) return 2.5;
          
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
        completionLimit: 3,
     
    },
    13: {
        name: "Suspension",
   
        challengeDescription() {
            return "Points is rooted to " + this.powers() +"."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
         goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(1500);
                if (challengeCompletions(this.layer, this.id) == 1) return new OmegaNum(3000);
                if (challengeCompletions(this.layer, this.id) == 2) return new OmegaNum(1e7);
  
   
            },
            powers() {
                if (challengeCompletions(this.layer, this.id) == 0) return 1e40;
                if (challengeCompletions(this.layer, this.id) == 1) return 1e30;
                if (challengeCompletions(this.layer, this.id) == 2) return 1e20;


            },
          
        currencyDisplayName: "points",
        currencyInternalName: "points",
        currencyLayer: "p",
        rewards() {
            if (challengeCompletions(this.layer, this.id) == 0) return 1;
            if (challengeCompletions(this.layer, this.id) == 1) return 1.4;
            if (challengeCompletions(this.layer, this.id) == 2) return 1.8;
            if (challengeCompletions(this.layer, this.id) == 3) return 2.2;
          
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
        rewardDisplay() { return "Multipler is " + format(this.rewardEffect())+"x to decreasing the cost requirement of vidIQ and Videos." },
        rewardDescription: "Unlock more vidIQ upgrades and give a multipler to decrease the cost requirement of vidIQ and Videos.",
        unlocked() {return hasChallenge("q",12)},
        completionLimit: 3,
     
    },
    21: {
        name: "Termination",
   
        challengeDescription() {
            return "All challenges are applied to once."
            + "<br>"+challengeCompletions(this.layer, this.id)+""
             + "/" + this.completionLimit + " completions";
        },
         goal(){
                if (challengeCompletions(this.layer, this.id) == 0) return new OmegaNum(1.5e5);
            
   
            },
            style: {width: "900px", height: "240px"},
          
        currencyDisplayName: "points",
        currencyInternalName: "points",
        currencyLayer: "p",
        onEnter ()
        {
         player.v.points = new EN(11)
         player.p.points = new EN(0)
        },
        countsAs: [11,12,13],
        rewardDescription: "Unlock Trophy layer.",
        unlocked() {return hasChallenge("q",11)&&hasChallenge("q",12)&&hasChallenge("q",13)&&hasUpgrade("q",23)&&player.m.points.gte(1500)},
        completionLimit: 1,
     
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
        if (hasChallenge("q",12)) mult = mult.times(challengeEffect("q",12));
        if (hasUpgrade("q",21)) mult = mult.pow(1.2);
        if (player.pb.points.gte(2)) mult = mult.times(tmp.co.buyables[13].effect.first);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
       if (hasUpgrade("co",14)) exp = exp.times(3);
       if (hasUpgrade("co",24)) exp = exp.times(1.5);
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
addLayer("tr", {
    name: "trophy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🏆", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
  
    color: "yellow",
    requires: new EN(1e15), // Can be a function that takes requirement increases into account
    resource: "trophy", // Name of prestige currency
    baseResource: "videos", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
       
 
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)

       return exp;
    },
    tabFormat: ["blank",
    ["display-text",
    function() {return 'You have <h2> ' + formatWhole(player.points) + '</h2> Trophies.'},
        {}],
			"blank",
			"blank",
        
			"blank",
       "blank", "blank", "upgrades"],

 tooltip() {return "Trophy"},
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("tr", keep)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["vi","q"],
    layerShown(){return hasChallenge("q",21)},
    upgrades: {
   
        11: {
            title: "Medal",
            description: "Generate 1 Trophies per second.",
            cost: new EN(2000),
          

            currencyDisplayName: "dollars",
            currencyInternalName: "points",
            currencyLayer: "m",
   
     
           
    },
   12: {
        title: "Bronze Medal",
        description: "Double the Trophies gain",
        cost: new EN(100),
      

        currencyDisplayName: "trophies",
        currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",11)}
 
       
},
13: {
    title: "Silver Medal",
    description: "Boost Trophies gain based on Points.",
    cost: new EN(200),
    effect() {
               
    

        let eff = player.p.points.add(1).pow(0.08)
        
        return eff;
    },
    effectDisplay() { return format(upgradeEffect("tr", 13))+"x" },

    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",12)}

   
},
14: {
    title: "Gold Medal",
    description: "vidIQ divides its own cost requirement",
    cost: new EN(1500),
    effect() {
               
    

        let eff = player.q.points.add(1).pow(0.08)
        
        return eff;
    },
    effectDisplay() { return "/"+format(upgradeEffect("tr", 14)) },

    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",13)}

   
},
15: {
    title: "Platinum Medal",
    description: "Raise the Views gain by 6.",
    cost: new EN(1.5e33),

    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",15)||player.points.gte(1.5e33)}

   
},
16: {
    title: "Diamond Medal",
    description: "Inflate the Trophy gain a bit.",
    cost: new EN(1e43),

    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",16)||player.points.gte(1e43)}

   
},
17: {
    title: "Polonium Medal",
    description: "Trophy gain is tetrated to 1.001.",
    cost: new EN(1e124),

    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",17)||player.points.gte(1e124)}

   
},
21: {
    title: "Uranium Medal",
    description: "Trophies multiply their own gain.",
    cost: new EN(5e163),
    effect() {
               
    

        let eff = player.points.add(1).pow(0.1)
        
        return eff;
    },
    effectDisplay() { return format(upgradeEffect("tr", 21))+"x" },
    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",21)||player.points.gte(5e163)}

   
},
22: {
    title: "Neptunium Medal",
    description: "Multiply Trophies based on this time played.",
    cost: new EN(3e182),
    effect() {
               
    

        return new OmegaNum(player.timePlayed).plus(1).pow(1)
    },
    effectDisplay() { return format(upgradeEffect("tr", 22))+"x" },
    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",22)||player.points.gte(3e182)}

   
},
23: {
    title: "Plutonium Medal",
    description: "Trophies gain are tetrated to 1.0018.",
    cost: new EN(3.5e187),
    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",22)}

   
},
24: {
    title: "Dubnium Medal",
    description: "Trophies' gain is increased by 1e100 and unlock Play Buttons.",
    cost: new EN("3e568"),
    currencyDisplayName: "trophies",
    currencyInternalName: "points",
unlocked() {return hasUpgrade("tr",23)}

   
},
}
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
        if (hasUpgrade("q",24)) mult = mult.pow(upgradeEffect("q",24));
        if (hasUpgrade("co",12)) mult = mult.times(15);
        if (hasUpgrade("co",22)) mult = mult.times(15);
        if (hasUpgrade("co",26)) mult = mult.times(tmp.co.buyables[12].effect.first);
        if (hasUpgrade("tr",15)) mult = mult.pow(6);
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
        if (hasUpgrade("co",13)) mult = mult.times(4);
        if (hasUpgrade("q",24)) mult = mult.pow(upgradeEffect("q",24));
        if (hasUpgrade("co",23)) mult = mult.pow(4.5);
        if (hasUpgrade("co",26)) mult = mult.times(tmp.co.buyables[12].effect.first);
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
      if (inChallenge("q", 13)) mult = mult.root(challengeNerf("q", 13));
      if (hasChallenge("q", 11)) mult = mult.times(challengeEffect("q", 11));
      if (hasUpgrade("q",23)) mult = mult.times(upgradeEffect("q",23));
      if (hasUpgrade("q",32)) mult = mult.times(100);
      if (hasUpgrade("q",41)) mult = mult.times(1000);
      if (player.pb.unlocked) mult = mult.times(tmp.pb.effect)
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
                if (hasUpgrade("q",26)) eff = eff.times(1.5)
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
addLayer("reb", {
    name: "report", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🐞", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "red",
    requires: new EN(1e144), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    baseResource: "video", // Name of resource prestige is based on
    baseAmount() {return player.v.points}, // Get the current amount of baseResource
    tooltip(){return "Report bugs"},
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
      if (inChallenge("q", 13)) mult = mult.root(challengeNerf("q", 13));
      if (hasChallenge("q", 11)) mult = mult.times(challengeEffect("q", 11));
      if (hasUpgrade("q",23)) mult = mult.times(upgradeEffect("q",23));
      if (hasUpgrade("q",32)) mult = mult.times(100);
      if (hasUpgrade("q",41)) mult = mult.times(1000);
      if (player.pb.unlocked) mult = mult.times(tmp.pb.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
    tabFormat: ["blank",
    ["display-text",
    function() {return 'You can report bugs <a href="https://forms.gle/YExDaFXvpFnkBDEi9">here</a>.'},
        {}],
			"blank",
			"blank",
           
			"blank",
			"milestones", "blank", "blank", "upgrades"],

 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
   

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
   
   branches: ["s","vi","m","tr"],
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


addLayer("co", {
    name: "content", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "📺", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "olive",
    requires: new EN(1e17), // Can be a function that takes requirement increases into account
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
    tooltip() {return "Content"},
    tabFormat: ["blank",
    ["display-text",
    function() {return '<h1>Content</h1>'},
        {}],
			"blank",
			"blank",
            ["display-text",
    function() {return 'Because around 500,000 people know your channel. You can perform any content to make your audience engaged.'},
        {}],
			"blank",
			"upgrades", "blank", "blank", "buyables"],

 
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
   
   branches: [["r",2],["m",2],["tr",2]],
    layerShown(){return hasUpgrade("q",24)},
    upgrades: {
        11: {
            title: "Gamer",
            description: "Multiply Trophies gain by 15.",
            cost: new EN(2500),
            unlocked() {return player.co.unlocked},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        21: {
            title: "Gamer II",
            description: "Multiply Trophies gain by another 15.",
            cost: new EN(10000),
            unlocked() {return hasUpgrade("co",13)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        12: {
            title: "Livestreamer",
            description: "Multiply Views gain by 15.",
            cost: new EN(40000),
            unlocked() {return hasUpgrade("co",11)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        22: {
            title: "Livestreamer II",
            description: "Multiply Views gain by another 15.",
            cost: new EN(2.56e5),
            unlocked() {return hasUpgrade("co",14)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        13: {
            title: "Artist",
            description: "Multiply Subscribers gain by 4.",
            cost: new EN(80000),
            unlocked() {return hasUpgrade("co",12)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        23: {
            title: "Artist II",
            description: "Raise Subscribers gain by 4.5.",
            cost: new EN(1e25),
            unlocked() {return hasUpgrade("co",16)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        14: {
            title: "Object Shows",
            description: "Multiply Dollars' exponent by 3.",
            cost: new EN(2.56e5),
            unlocked() {return hasUpgrade("co",13)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        24: {
            title: "Object Shows II",
            description: "Multiply Dollars' exponent by 1.5.",
            cost: new EN(1.75e26),
            unlocked() {return hasUpgrade("co",16)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        15: {
            title: "Music Maker",
            description: "Square the Trophies gain.",
            cost: new EN(5.12e5),
            unlocked() {return hasUpgrade("co",14)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        25: {
            title: "Music Maker II",
            description: "Raise the Trophies gain by 1.15.",
            cost: new EN(1e27),
            unlocked() {return hasUpgrade("co",16)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        16: {
            title: "Game Creator",
            description: "Cube the Trophies gain",
            cost: new EN(2.5e9),
            unlocked() {return hasUpgrade("co",15)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
        26: {
            title: "Game Creator II",
            description: "Raise the Trophies gain by 1.10.",
            cost: new EN(1e31),
            unlocked() {return hasUpgrade("co",16)},
              
            currencyDisplayName: "trophies",
            currencyInternalName: "points",
       
        },
    },
    buyables: {
        11: {
            cost(x) { return new EN(1e10).mul(new EN(25000).pow(x)) },
            title() { return "Vermillion" },
  
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiplies Trophy gain by " + format(data.effect.first) + "."
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = OmegaNum.pow(4, x.pow(1.5))
                else eff.first = OmegaNum.pow(1/40, x.times(-1).pow(1.5))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade("co",23)}
        },
        12: {
            cost(x) { return new EN(1e15).mul(new EN(1e15).pow(x)) },
            title() { return "Verbillion" },
  
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiplies Views & Subscribers gain by " + format(data.effect.first) + "."
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = OmegaNum.pow(100, x.pow(1.8))
                else eff.first = OmegaNum.pow(1/40, x.times(-1).pow(1.5))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasUpgrade("co",26)}
        },
        13: {
            cost(x) { return new EN(1e16).mul(new EN(1e20).pow(x)) },
            title() { return "Vertrillion" },
  
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiplies Dollars gain by " + format(data.effect.first) + "."
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = OmegaNum.pow(8, x.pow(1.8))
                else eff.first = OmegaNum.pow(1/40, x.times(-1).pow(1.5))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return player.pb.points.gte(2)}
        },
        14: {
            cost(x) { return new EN(1e18).mul(new EN(1e200).pow(x)) },
            title() { return "Verquadrillion" },
  
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
               Multiplies Trophy gain by " + format(data.effect.first) + "."
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = OmegaNum.pow(1e25, x.pow(512))
                else eff.first = OmegaNum.pow(1/40, x.times(-1).pow(1.5))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return player.pb.points.gte(3)}
        },
    },
})
addLayer("pb", {
    name: "play button", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "▶", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new EN(0), 
        total: new EN(0),
        best: new EN(0),
   
    }},
    color: "silver",
    requires: new EN("1e791"), // Can be a function that takes requirement increases into account
    resource: "play buttons", // Name of prestige currency
    baseResource: "trophies", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    base: 1e10,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new EN(1)
      
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       let exp =  new EN(1)
     
       return exp;
    },
    effectDescription() {
        return "which are boosting Points gain by "+format(tmp.pb.effect)+"x."
    },
    
    addToBase() {
        let base = new EN(0);
    

        return base;
    },
    effectBase() {
        let base = new EN(2);
        
        // ADD
        base = base.plus(tmp.pb.addToBase);
        
        // MULTIPLY
   
        
        return base.pow(tmp.pb.power);
    },
    power() {
        let power = new EN(1);
    
        return power;
    },
    effect() {
        return OmegaNum.pow(tmp.pb.effectBase, player.pb.points.plus(0)).max(1).times(1);
    },

 layerShown() {return hasUpgrade("tr",24)},
   
    doReset(resettingLayer) {
     
        if (layers[resettingLayer].row > this.row) layerDataReset("v", keep)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
   branches: ["s","vi"],
   onPrestige() {
       
    player.v.points = new EN(1)
               },
               milestones: {
         
                0: {requirementDescription: "1 Play Button",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Videos reset nothing.",
               },
              
            }
})
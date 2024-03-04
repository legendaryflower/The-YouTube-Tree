let modInfo = {
	name: "The YouTube Tree",
	id: "YTtree",
	author: "RTLF2024",
	pointsName: "trophies",
	discordName: "",
	discordLink: "",
	initialStartPoints: new EN (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Alpha",
}

let changelog = `<h1>Changelog:</h1><br>
 <em>This list may contain spoilers! </em><br><br>
	<h3>v0.1 Alpha</h3><br>
		- Early launch.<br>
		- Trophies are unfinished so this would be added in later updates. <br>
		- Added Points, Videos, Views and Subscribers.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","buyMax"]


var alwaysKeepTheseVariables = ["auto","autoMp","autoPm"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true;
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new EN(0)

	let gain = new EN(0)
	
	return gain
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
// Display extra things at the top of the page
var displayThings = [`<span>Reach 8 videos to beat the game!`,
]

// Determines when the game "ends"
function isEndgame() {
	return player.v.points.gte(new OmegaNum(8))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
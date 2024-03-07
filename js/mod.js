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
	num: "0.3",
	name: "Alpha",
}

let changelog = `<h1>Changelog:</h1><br>
 <em>This list may contain spoilers! </em><br><br>
 <h3>v0.3 Alpha</h3><br>
 - Trophies can now be gained upon completing the 4th YouTube Academy.<br>
 - Added more YouTube Academies.<br>
 - Added 2 new layers. <br>
 - More changes maybe to the game.
 <br><br>
	<h3>v0.2 Alpha</h3><br>
		- Added vidIQ, more upgrades. <br>
		- You can monetize when you reach at least 1,500 Subscribers. <br>
		- Added a news ticker.
		<br><br>
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
	return hasUpgrade("tr",11);
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new EN(0)

	let gain = new EN(1)
	if (hasUpgrade("tr",12)) gain = gain.times(2)
	if (hasUpgrade("tr",13)) gain = gain.times(upgradeEffect("tr",13))
	if (hasUpgrade("co",11)) gain = gain.times(15)
	if (hasUpgrade("co",21)) gain = gain.times(15)
	if (hasUpgrade("co",15)) gain = gain.pow(2)
	if (hasUpgrade("co",16)) gain = gain.pow(3)
	return gain
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	newsTotal: OmegaNum.ZERO,
}}

// Display extra things at the top of the page
// Display extra things at the top of the page
var displayThings = [`<span>Reach 1e20 trophies to beat the game!`,
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new OmegaNum(1e20))
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
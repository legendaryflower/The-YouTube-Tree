let modInfo = {
	name: "The Modding Tree",
	id: "Slime Adventure",
	author: "",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new EN (10), // Used for hard resets and new players
	
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
 - Added Derogatory Challenge 3 & 4<br>
 - Added more automation robots, such as Machintruc Robot.<br>
 - Added a new column of Prestige upgrades when you unlocked Booster Robot.<br>
 - Working on new Paradox Upgrades, Generator Upgrade Tree and Infinity.
 <br><br>
 <h3>v0.2 Alpha</h3><br>
		- Fixed a bug when the Matter effect doesn't softcap at 1e43. Now softcaps at 1e35.<br>
		- Added formulas for all upgrades, milestones, challenges, buyables and clickables for people that only have 40 IQ.
		- Added Automation Robots
		<br><br>
	<h3>v0.1 Alpha</h3><br>
		- Added some layers<br>
		- Working on Ultra Prestige.`

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
	return hasUpgrade("p", 11);
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new EN(0)

	let gain = new EN(1)
	if (hasUpgrade('p', 12)) gain = gain.times(2)
	if (hasUpgrade('p', 21)) gain = gain.times(upgradeEffect("p",21))
	if (hasUpgrade('p', 22)) gain = gain.times(upgradeEffect("p",22))
	if (hasUpgrade('p', 31)) gain = gain.times(upgradeEffect("p",31))
	if (player.m.unlocked) gain = gain.times(tmp.m.effect);
	if (hasUpgrade('ma', 13)) gain = gain.times(upgradeEffect("ma",13))
	if (player.ma.unlocked) gain = gain.times(tmp.ma.buyables[11].effect.first);
	if (player.up.unlocked) gain = gain.times(tmp.up.effect);
	if (inChallenge("up", 11)) gain = gain = gain.root(challengeNerf("up", 11));
	if (hasChallenge("up", 12)) gain = gain.pow(challengeEffect("up", 12));
	if (hasUpgrade('pa', 12)) gain = gain.times(upgradeEffect("pa",12))
	if (hasUpgrade("p",44)) gain = gain.pow(tmp.ma.buyables[13].effect.first);
	if (hasUpgrade("g",21)) gain = gain.times(50);
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
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
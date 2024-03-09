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
	num: "0.4.3",
	name: "Alpha",
}

let changelog = `<h1>Changelog:</h1><br>
 <em>This list may contain spoilers! </em><br><br>
 <h3>v0.4.3 Alpha</h3><br>
 - Completing Termination now only multiples Points gain by 1.5.
 - vidIQ Challenge 13 completion will unlock Trophies.
 <h3>v0.4.2 Alpha</h3><br>
 - Termination does not apply Challenge 12.<br><br>
 <h3>v0.4.1 Alpha</h3><br>
 - Not a change but added a layer that you can directly report bugs
 <br><br>
 <h3>v0.4 Alpha</h3><br>
 - Added Play Buttons. <br>
 - Added 7 new Trophy Upgrades. <br>
 - Added 4 new vidIQ Upgrades. <br>
 - Fixed a mistake in the 4th change in v0.3 Alpha which said "maybe" instead of "made". <br>
 - All of the challenges now only need 3 completions to beat. <br>
 - More changes made to the game. <br>
 - Added 2 new News messages. <br>
 <br><br>
 <h3>v0.3 Alpha</h3><br>
 - Trophies can now be gained upon completing the 4th YouTube Academy.<br>
 - Added more YouTube Academies.<br>
 - Added 2 new layers. <br>
 - More changes made to the game.
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
	if (hasUpgrade("co",25)) gain = gain.pow(1.15)
	if (hasUpgrade("co",26)) gain = gain.pow(1.1)
	if (hasUpgrade("co",16)) gain = gain.pow(3)
	if (hasUpgrade("co",23)) gain = gain.times(tmp.co.buyables[11].effect.first);
	if (hasUpgrade("q",25)) gain = gain.times(50)
	if (hasUpgrade("q",33)) gain = gain.times(100)
	if (hasUpgrade("q",34)) gain = gain.times(1e5)
	if (hasUpgrade("tr",16)) gain = gain.pow(3)
	if (hasUpgrade("tr",17)) gain = gain.tetrate(1.001)
	if (hasUpgrade("tr",21)) gain = gain.times(upgradeEffect("tr",21))
	if (hasUpgrade("tr",22)) gain = gain.times(upgradeEffect("tr",22))
	if (hasUpgrade("tr",23)) gain = gain.tetrate(1.0018);
	if (player.points.gte("1e805")) gain = gain.tetrate(0.9);
	if (hasUpgrade("tr",24)) gain = gain.times(1e100)
	if (player.pb.points.gte(3)) gain = gain.times(tmp.co.buyables[14].effect.first);
	return gain
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	newsTotal: OmegaNum.ZERO,
}}

// Display extra things at the top of the page
// Display extra things at the top of the page
var displayThings = [`<span>Reach 1e805 trophies to beat the game!`,
() => player.points.gte("1e805") ? '<span style="color:orange">Due to taxes, Your trophies gain is tetrated to 0.9!</span>' : '',
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new OmegaNum("1e805"))
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
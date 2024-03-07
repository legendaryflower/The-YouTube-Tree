"use strict"; // credit to Yahtzee Master#0168
let ticker = document.getElementById("newsContent");
let tickerContainer = document.getElementById("newsTicker"); // ticker is the text element, tickerContainer is... the thing that contains ticker

let newsPosition = -1e100; // hopefully noones screen is this big

function tickNews() {
  if (player) {
  if (!player.hideNews) {
  newsPosition -= 3;
  ticker.style.left = `${newsPosition}px`;

  if (newsPosition < -ticker.offsetWidth) newNewsMessage()};
  }
}

function newNewsMessage() {
  if (!player.hideNews) {
  const newsCandidates = [];
  for (const i in newsArray)
    if (newsArray[i][1] === undefined || newsArray[i][1]())
      newsCandidates.push(newsArray[i][0]);
  player.newsTotal = player.newsTotal.plus(1);
  ticker.innerHTML =
    newsCandidates[Math.floor(newsCandidates.length * Math.random())];
  newsPosition = tickerContainer.offsetWidth;
  ticker.style.left = `${newsPosition}px`};
}
// you can add a second element to each message's array
// the second element is a function that returns a boolean of whether to shown it
const newsArray = [
  ["People say that dinosaurs are killed by ice. What killed the dinosaurs? The ice age!"],
  ["Imagine a gorilla cup of papper hot srup"],
  ["There is a theory where at least 1% of people population (which is around 8 billion people) found a video with 0 likes and 999M dislikes in just 3 minutes after getting uploaded. After 1 hour, it reached 999M negative comments that has at least 60+ replies."],
  ["Outcast isn't a boy nor a girl."],
  ["4 is definitely Gorilla's favorite number"],
  ["1 YouTube video is 0.0001 updates"],
  ["WARNING! The snail in CHUCHEL got turned into a girl so we need to take action on the hijacker that did it. If you'd find a hijacker, call us at [softcapped]. -Goverments at TMTverse"],
  ["Don't know what game should be or shouldn't be."],
  ["I wanna see parents asking for modd.io to be shut down"],
  ["The pals have met me. Rhenium!"],
  ["You just have won your YouTube competition."],
  ["Stop adding goofy characters."],
  ["Do not purchase subscribers, you're going to be in a trouble of your YouTube account."],
  ["Imagine if someone gets a punishement that's someone doing all of someone's work every day until their 40, someone being wearing nappies for the rest of their life, someone doing all of their entire chores and community service, someone will be watching baby shows everyday until their 18, someone will delete their YouTube channel, Google, Scratch account, roblox, deviantart and fur-affinity account, taking someone thing away from them, someone will be using scratch until they got ungrounded, someone will not gonna have roblox, vyond, computer, electrionic, tv, deviantart, cartoon network, itunes, playstation, xbox, scratch, break-time,youtube, dc comics, mondo media, comedy central, south park, iphone, video game system, wiiu, fur-affinity, li, someone will not see their friends to watch any upcoming movies, someone being sent to detention for 3 days, someone will watch one of the scene that grounds tim in the boss baby that someone hates, someone will play baby toys like dolls, cars, blocks, letters, and many baby toys, someone will be washing the dishes and empty the dish washer everyday, until someone sees in next month, someone will be cleaning up the entire mess outside with someone, someone will be sweeping on the floors in all major rooms, someone will not do F4F after someone will follow them, someone will be doing their work in Google Docs with 100 pages until someone is done, someone will be banned from scratch due to SCG (Scratch community guidelines) and TOS (Terms of services), someone will not able to use YouTube until someone is ungrounded, someone will be using someone's heavy backpack while they walk home from school, someone will be not allowed to be on their computer while grounded, someone will be doing their homework everyday until someone graduate, someone will be picking up the mess and put it to the trash can or somewhere in the backyard, someone will not use DeviantArt while grounded, someone will be playing with babies in their house, someone will not be at someone's house anymore, someone will eat some foods that they hate, someone will be seating in the baby char while someone eat, someone will be forced to go to the roller coaster that someone hates, someone will be forbidden to watch rated X under 21 movies, someone will be beaten up by lily unless someone apologises, someone will get terminated on youtube for violating youtube community guidelines, someone will be doing someone's job until June 2024, someone will be wearing baby clothes for the rest of their life, someone will be watching troublemakers getting grounded videos, someone will not be in someone's house anymore what they have done, someone will be staying out of their sight, someone will poo poo or pee pee in their nappeis and not using the toilet, because people are going to burn all of someone's underwear and destroy someone's toilet, someone will be makking painting with baby crayons and baby eraser, someone will not be allowed to make videos, someone will be doing their spelling for 250 times, someone will be in someone's my least favorite characters list, someone will not accept by someone knocking or ringing the bell in their door in someone's house, someone will be in the naugthy list of christmas, which will be in the end of 2024, someone will be not allowed to go on sleepovers with someones, someone will sleep on the floor for now on, and if someone keeps things up, someone will be grounded even mroe and more, and someone will be send to any countries."],
];
setTimeout(() => {
  ticker = document.getElementById("newsContent");
  tickerContainer = document.getElementById("newsTicker");
  setInterval(tickNews, 15);
}, 150);
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
];
setTimeout(() => {
  ticker = document.getElementById("newsContent");
  tickerContainer = document.getElementById("newsTicker");
  setInterval(tickNews, 15);
}, 150);
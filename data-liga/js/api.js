var base_url = "api.football-data.org/v2/";
var standings_url = "competitions/2021/";
var team_url = "teams/";
var match_url = "competitions/2021/";

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

async function getStandings() {
  let proxy = "https://cors-anywhere.herokuapp.com/";
  let standings = {};
  let options = {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": "3901c72a75b24e7c97fc5210ecf7eaef"
    },
    credentials: "same-origin"
  };

  standings = await fetch(
    proxy + base_url + standings_url + "standings?standingType=TOTAL",
    options
  )
    .then(status)
    .then(json)
    .catch(error);

  return standings;
}

async function getMatches() {
  let proxy = "https://cors-anywhere.herokuapp.com/";
  let matches = {};
  let options = {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": "3901c72a75b24e7c97fc5210ecf7eaef"
    },
    credentials: "same-origin"
  };

  matches = await fetch(
    proxy + base_url + match_url + "matches?season=2019",
    options
  )
    .then(status)
    .then(json)
    .catch(error);

  return matches;
}

async function getTeam(teamId) {
  let proxy = "https://cors-anywhere.herokuapp.com/";
  let team = {};
  let options = {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": "3901c72a75b24e7c97fc5210ecf7eaef"
    },
    credentials: "same-origin"
  };

  team = await fetch(proxy + base_url + team_url + teamId, options)
    .then(status)
    .then(json)
    .catch(e => {
      console.error(e);
    });

  return team;
}

async function loadDetailTeam() {
  let detailTeam = await fetch("../../pages/detailtim.html")
    .then(response => {
      return response.text();
    })
    .catch(e => {
      console.error(e);
    });

  return detailTeam;
}

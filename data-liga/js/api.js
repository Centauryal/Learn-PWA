var base_url = "api.football-data.org/v2/competitions/2021/";
var team_base_url = "api.football-data.org/v2/teams/";
var match_base_url = "";

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
    proxy + base_url + "standings?standingType=TOTAL",
    options
  )
    .then(status)
    .then(json)
    .catch(error);

  return standings;
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

  team = await fetch(proxy + team_base_url + teamId, options)
    .then(status)
    .then(json)
    .catch(e => {
      console.error(e);
    });

  return team;
}

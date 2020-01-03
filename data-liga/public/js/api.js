const base_url = "https://api.football-data.org/v2/";
const standings_url = "competitions/";
const team_url = "teams/";
const API_KEY = "3901c72a75b24e7c97fc5210ecf7eaef";

const fetchApi = function(url) {
  return fetch(url, {
    mode: "cors",
    headers: {
      "X-Auth-Token": API_KEY
    }
  });
};

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

async function getStandings(leagueId) {
  let response = await fetchApi(
    base_url + standings_url + leagueId + "/standings?standingType=TOTAL"
  )
    .then(status)
    .then(json)
    .catch(error);

  return response;
}

async function getMatches(leagueId, dateNow, dateTo) {
  let response = await fetchApi(
    base_url +
      standings_url +
      leagueId +
      "/matches?dateFrom=" +
      dateNow +
      "&dateTo=" +
      dateTo +
      "&status=SCHEDULED"
  )
    .then(status)
    .then(json)
    .catch(error);

  return response;
}

async function getTeam(teamId) {
  let response = await fetchApi(base_url + team_url + teamId)
    .then(status)
    .then(json)
    .catch(error);

  return response;
}

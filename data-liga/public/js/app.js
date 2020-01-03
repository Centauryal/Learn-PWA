if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    registerServiceWorker();
    requestNotification();
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}

function registerServiceWorker() {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(function() {
      console.log("Pendaftaran ServiceWorker berhasil");
    })
    .catch(function() {
      console.log("Pendaftaran ServiceWorker gagal");
    });
}

function requestNotification() {
  if ("Notification" in window) {
    requestPermission();
  } else {
    console.error("Browser tidak mendukung notifikasi.");
  }

  function requestPermission() {
    Notification.requestPermission().then(function(result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }

      if ("PushManager" in window) {
        function urlBase64ToUint8Array(base64String) {
          const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
          const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        }

        navigator.serviceWorker.getRegistration().then(function(registration) {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                "BPNVM1zdU4h0lwTnNcE5fAAX5pCjt4Jsf-mGpMr7B7YQ5JC8pV10AKdtvRpoEgYfX5YbEhBzVkiIJfWhz9kX9XU"
              )
            })
            .then(function(subscribe) {
              console.log(
                "Berhasil melakukan subscribe dengan endpoint: ",
                subscribe.endpoint
              );
              console.log(
                "Berhasil melakukan subscribe dengan p256dh key: ",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("p256dh"))
                  )
                )
              );
              console.log(
                "Berhasil melakukan subscribe dengan auth key: ",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("auth"))
                  )
                )
              );
            })
            .catch(function(e) {
              console.error("Tidak dapat melakukan subscribe ", e.message);
            });
        });
      }

      console.log("Fitur notifikasi diijinkan.");
    });
  }
}

var htmlLoading = `<div class="preloader-wrapper big loading center active">
<div class="spinner-layer spinner-blue">
  <div class="circle-clipper left">
    <div class="circle"></div>
  </div><div class="gap-patch">
    <div class="circle"></div>
  </div><div class="circle-clipper right">
    <div class="circle"></div>
  </div>
</div>

<div class="spinner-layer spinner-red">
  <div class="circle-clipper left">
    <div class="circle"></div>
  </div><div class="gap-patch">
    <div class="circle"></div>
  </div><div class="circle-clipper right">
    <div class="circle"></div>
  </div>
</div>

<div class="spinner-layer spinner-yellow">
  <div class="circle-clipper left">
    <div class="circle"></div>
  </div><div class="gap-patch">
    <div class="circle"></div>
  </div><div class="circle-clipper right">
    <div class="circle"></div>
  </div>
</div>

<div class="spinner-layer spinner-green">
  <div class="circle-clipper left">
    <div class="circle"></div>
  </div><div class="gap-patch">
    <div class="circle"></div>
  </div><div class="circle-clipper right">
    <div class="circle"></div>
  </div>
</div>
</div>`;

async function choiceLeagueStandings() {
  let elmChoiceLeague = document.getElementById("change-standings");
  let choiceDefault = 2021;
  await loadStandings(choiceDefault);
  elmChoiceLeague.innerHTML = `
    <div class="col s12">
      <button class="btn btn-change-league" onclick="loadStandings(2021)">Premier League</button>
      <button class="btn btn-change-league" onclick="loadStandings(2014)">LaLiga Santander</button>
      <button class="btn btn-change-league" onclick="loadStandings(2002)">Bundesliga</button>
      <button class="btn btn-change-league" onclick="loadStandings(2015)">Ligue 1</button>
    </div>
    `;
}

async function loadStandings(leagueId) {
  let elmStandings = document.getElementById("data-standings");
  if (typeof elmStandings != "undefined" && elmStandings != null) {
    let elmTitleLeague = document.getElementById("title-standing");
    let html = "";
    let standingsLeague = {};
    elmStandings.innerHTML = htmlLoading;

    switch (leagueId) {
      case 2021:
        elmTitleLeague.innerHTML = `
        <p>Premier League</p>
        `;
        break;
      case 2014:
        elmTitleLeague.innerHTML = `
        <p>Laliga Santander</p>
        `;
        break;
      case 2002:
        elmTitleLeague.innerHTML = `
        <p>Bundesliga</p>
        `;
        break;
      case 2015:
        elmTitleLeague.innerHTML = `
        <p>Ligue 1</p>
        `;
        break;
    }

    if ("caches" in window) {
      caches
        .match(
          "api.football-data.org/v2/competitions/" +
            leagueId +
            "/standings?standingType=TOTAL"
        )
        .then(function(response) {
          if (response) {
            standingsLeague = response.json();
          }
        });
    }

    standingsLeague = await getStandings(leagueId);
    standingsLeague.standings.forEach(function(league) {
      league.table.forEach(function(teams) {
        html += `
        <tr onclick="location.href='./detailteam.html?id=${
          teams.team.id
        }'" class="click-team">
          <td>${teams.position}</td>
          <td class="team-logos">
            <img src="${teams.team.crestUrl.replace(
              /^http:\/\//i,
              "https://"
            )}" class="team-img">
            <span><b>${teams.team.name}</b></span>
          </td>
          <td>${teams.playedGames}</td>
          <td>${teams.won}</td>
          <td>${teams.draw}</td>
          <td>${teams.lost}</td>
          <td>${teams.goalsFor}</td>
          <td>${teams.goalsAgainst}</td>
          <td>${teams.goalDifference}</td>
          <td>${teams.points}</td>
        </tr>
        `;
      });
    });
    elmStandings.innerHTML = html;
  }
}

async function choiceLeagueMatches() {
  let elmChoiceLeague = document.getElementById("change-matches");
  let choiceDefault = 2021;
  await loadMatches(choiceDefault);
  elmChoiceLeague.innerHTML = `
    <div class="col s12">
      <button class="btn btn-change-league" onclick="loadMatches(2021)">Premier League</button>
      <button class="btn btn-change-league" onclick="loadMatches(2014)">LaLiga Santander</button>
      <button class="btn btn-change-league" onclick="loadMatches(2002)">Bundesliga</button>
      <button class="btn btn-change-league" onclick="loadMatches(2015)">Ligue 1</button>
    </div>
    `;
}

async function loadMatches(leagueId) {
  let elmMatches = document.getElementById("data-matches");
  if (typeof elmMatches != "undefined" && elmMatches != null) {
    let elmTitleMatch = document.getElementById("title-matches");
    let html = "";
    let matchLeague = {};
    elmMatches.innerHTML = htmlLoading;

    switch (leagueId) {
      case 2021:
        elmTitleMatch.innerHTML = `
        <p>Premier League Matches</p>
        `;
        break;
      case 2014:
        elmTitleMatch.innerHTML = `
        <p>Laliga Santander Matches</p>
        `;
        break;
      case 2002:
        elmTitleMatch.innerHTML = `
        <p>Bundesliga Matches</p>
        `;
        break;
      case 2015:
        elmTitleMatch.innerHTML = `
        <p>Ligue 1 Matches</p>
        `;
        break;
    }

    let pad = n => {
      return n < 10 ? "0" + n : n;
    };

    let today = new Date();
    let day1 = today.getDate();
    let month1 = today.getMonth() + 1;
    let year1 = today.getFullYear();
    let dateNow = year1 + "-" + pad(month1) + "-" + pad(day1);

    let nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    let day2 = nextMonth.getDate();
    let month2 = nextMonth.getMonth() + 1;
    let year2 = nextMonth.getFullYear();
    let dateTo = year2 + "-" + pad(month2) + "-" + pad(day2);

    if ("caches" in window) {
      caches
        .match(
          "api.football-data.org/v2/competitions/" +
            leagueId +
            "/matches?dateFrom=" +
            dateNow +
            "&dateTo=" +
            dateTo +
            "&status=SCHEDULED"
        )
        .then(function(response) {
          if (response) {
            matchLeague = response.json();
          }
        });
    }

    matchLeague = await getMatches(leagueId, dateNow, dateTo);
    matchLeague.matches.forEach(function(match) {
      html += `
      <div class="col s12 m6">
            <div class="card-panel light-blue card-match-center">
                <span>
                    <p class="name-matches truncate">
                        ${match.homeTeam.name}<br>
                        vs<br>
                        ${match.awayTeam.name}<br>
                    </p>
                    <p class="time-matches">
                        ${new Date(match.utcDate).toString().substring(0, 21)}
                    </p>
                </span>
            </div>
      </div>
      `;
    });

    elmMatches.innerHTML = html;
  }
}

async function loadTeamInfo() {
  return new Promise(async function(resolve, reject) {
    var urlParams = new URLSearchParams(window.location.search);
    var teamId = urlParams.get("id");
    let teamData = {};
    document.getElementById("body-content").innerHTML = htmlLoading;
    if ("caches" in window) {
      caches
        .match("api.football-data.org/v2/teams/" + teamId)
        .then(function(response) {
          if (response) {
            teamData = response.json();
            resolve(teamData);
          }
        });
    }

    teamData = await getTeam(teamId);

    if (teamData != null) {
      let detailTeam = `
      <div class="main-wrapper container">
        <div class="card team-card">
          <div class="team-card-title">
            <div class="detail-logo-wrapper">
              <img id="team-img" src="${teamData.crestUrl.replace(
                /^http:\/\//i,
                "https://"
              )}">
            </div>
            <div class="detail-logo-info">
              <h1 id="team-title"><b>${teamData.name}</b></h1>
              <p id="team-venue"><b>${teamData.venue}</b></p>
              <p>${teamData.address}</p>
              <p>${teamData.phone}</p>
              <p><a href="${
                teamData.website != null ? teamData.website : "#klasemen"
              }" target="_blank">Official Website</a></p>
              <p id="team-email">${
                teamData.email != null ? teamData.email : "No Email"
              }</p>
              <a id="btnFavorite" class="btn waves-effect waves-light btn-team">
                <i class="iconify left btn-favorite pulse" data-icon="fa-heart"></i>Favorite
              </a>
            </div>
          </div>
          <div id="squad-team" class="row">
          </div>
        </div>
      </div>
      `;
      document.getElementById("body-content").innerHTML = detailTeam;
      resolve(teamData);

      let squadTeam = document.getElementById("squad-team");
      let squadHtml = "";
      teamData.squad.forEach(function(squads) {
        let birthday = new Date(squads.dateOfBirth);
        let day = birthday.getDate();
        let month = birthday.getMonth() + 1;
        let fullYear = birthday.getFullYear();
        squadHtml += `
          <div class="col s12 m6">
                <div class="card-panel card-detail-center">
                    <span>
                        <p class="detail-name truncate">
                            ${squads.name}
                        </p>
                        <p class="detail-all">
                        ${
                          squads.position != null ? squads.position : "Coach"
                        }<br>
                        ${squads.nationality}
                        </p>
                        <p class="detail-all">
                        ${month + "-" + day + "-" + fullYear}
                        </p>
                    </span>
                </div>
          </div>
        `;
      });

      squadTeam.innerHTML = squadHtml;
    } else {
      let elem = document.getElementById("info-detail");
      elem.innerHTML = `<p>Failed to get data</p>`;
      let squadTeam = document.getElementById("squad-team");
      squadTeam.innerHTML = `<p style="text-align: center;">Please check your internet connections!</p>`;
    }
  });
}

async function getFavorites() {
  document.getElementById("data-favorite").innerHTML = htmlLoading;
  let teams = await getAllFromDB();
  console.log(teams);
  let html = "";
  if (teams.length > 0) {
    teams.forEach(function(team) {
      html += `
          <div class="col s12 m6">
                <div class="card-panel favorite-team-card-item">
                  <a href="./detailteam.html?id=${team.id}">
                    <div class="favorite-team-img-wrapper">
                        <img src="${team.crestUrl.replace(
                          /^http:\/\//i,
                          "https://"
                        )}">
                    </div>
                    <span>
                        <p class="detail-name truncate">
                            ${team.name}
                        </p>
                        <p class="white-text">${team.venue}<br>
                        ${team.phone}<br>
                        ${team.email != null ? team.email : "No Email"}
                        </p>
                    </span>
                  </a>
                </div>
          </div>
        `;
    });
  } else {
    html = `
      <p><b>There's no favorites team</b></p>
      `;
  }
  document.getElementById("data-favorite").innerHTML = html;
}

var favoritePromise = function() {
  return new Promise((resolve, reject) => {
    let item = {};
    resolve(item);
  });
};

async function stateFavorite(teamId) {
  let btnFav = document.querySelector("#btnFavorite");
  let status = false;

  let teamData = await getDataDBById(teamId);
  if (teamData != null) {
    status = false;
    btnFav.classList.add("red");
  } else {
    status = true;
    btnFav.classList.remove("red");
  }
  return status;
}

async function loadFavorite(item) {
  let toggleBtn = document.querySelector("#btnFavorite");

  toggleBtn.onclick = async function() {
    let isFavorite = await stateFavorite(item.id);
    if (isFavorite) {
      insertDataDB(item);
      toggleBtn.classList.add("red");
      M.toast({ html: "Favorite team added", classes: "toast-bg" });
    } else {
      deleteDataDB(item.id);
      toggleBtn.classList.remove("red");
      M.toast({ html: "Favorite team deleted", classes: "toast-bg" });
    }
  };
}

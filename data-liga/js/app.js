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

async function loadStandingsPage() {
  await renderStandings();
  initDatabase();
}

async function loadFavoritesPage() {
  await renderFavorites();
}

async function loadTeamPage(teamId) {
  await renderTeamPage();
  await renderTeamInfo(teamId);
  await loadFavorite(teamId);
  toggleFav(teamId);
}

async function loadDataFromCaches(proxy, base_url) {
  let cacheData = {};

  await caches.match(proxy + base_url).then(response => {
    if (response) {
      cacheData = response.json();
    }
  });

  return cacheData;
}

async function renderStandings() {
  let elmStandings = document.getElementById("data-standings");
  if (typeof elmStandings != "undefined" && elmStandings != null) {
    let standings = {};
    let html = "";
    if ("caches" in window) {
      let proxy = "https://cors-anywhere.herokuapp.com/";
      let base_url = `api.football-data.org/v2/competitions/2021/standings?standingType=TOTAL`;
      standings = await loadDataFromCaches(proxy, base_url);
    }
    standings = await getStandings();
    standings = standings.standings[0].table;
    Object.keys(standings).forEach(standing => {
      let teamUrl = standings[standing].team.crestUrl;
      html += `
      <tr onClick="loadTeamPage(${
        standings[standing].team.id
      })" class="click-team">
        <td>${standings[standing].position}</td>
        <td class="team-logos">
          <img src="${teamUrl.replace(
            /^http:\/\//i,
            "https://"
          )}" class="team-img">
          <span><b>${standings[standing].team.name}</b></span>
        </td>
        <td>${standings[standing].playedGames}</td>
        <td>${standings[standing].won}</td>
        <td>${standings[standing].draw}</td>
        <td>${standings[standing].lost}</td>
        <td>${standings[standing].goalsFor}</td>
        <td>${standings[standing].goalsAgainst}</td>
        <td>${standings[standing].goalDifference}</td>
        <td>${standings[standing].points}</td>
      </tr>
      `;
    });
    elmStandings.innerHTML = html;
  }
}

async function renderTeamPage() {
  let html = await loadDetailTeam();
  document.querySelector("#body-content").innerHTML = html;
}

async function renderTeamInfo(teamId) {
  let teamData = {};

  if ("caches" in window) {
    let proxy = "https://cors-anywhere.herokuapp.com/";
    let base_url = `api.football-data.org/v2/teams/${teamId}`;
    teamData = await loadDataFromCaches(proxy.base_url);
  }

  teamData = await getTeam(teamId);

  if (teamData != null) {
    let teamUrl = teamData.crestUrl;

    let elem = document.querySelector("#info-detail");
    elem.innerHTML = `
      <div class="detail-logo-wrapper">
        <img id="team-img" src="${teamUrl.replace(/^http:\/\//i, "https://")}">
      </div>
      <div class="detail-logo-info">
        <h1 id="team-title"><b>${teamData.name}</b></h1>
        <p>${teamData.address}</p>
        <p>${teamData.phone}</p>
        <p><a href="${
          teamData.website != null ? teamData.website : "#klasemen"
        }" target="_blank">Official Website</a></p>
        <p id="team-email">${
          teamData.email != null ? teamData.email : "No Email"
        }</p>
        <a class="waves-effect waves-light btn btn-team">
          <i class="iconify left btn-favorite pulse" data-icon="fa-heart" onclick="toggleFav(teamId)"></i>Favorite
        </a>
      </div>
    `;

    let squadTable = document.querySelector("#squad-team");
    let squadHtml = "";
    let squads = teamData.squad;
    Object.keys(squads).forEach((squad, index) => {
      let squadDateUTC = new Date(squads[squad].dateOfBirth);
      let Day = squadDateUTC.getDate();
      let Month = squadDateUTC.getMonth() + 1;
      let FullYear = squadDateUTC.getFullYear();
      squadHtml += `
          <tr>
              <td>${index + 1}</td>
              <td>${squads[squad].name}</td>
              <td>${squads[squad].position}</td>
              <td>${Month + "-" + Day + "-" + FullYear}</td>
              <td>${squads[squad].countryOfBirth}</td>
              <td>${squads[squad].nationality}</td>
          </tr>
      `;
    });

    squadTable.innerHTML = squadHtml;
  } else {
    let elem = document.querySelector("#info-detail");
    elem.innerHTML = `<p>Failed to get data</p>`;
    let squadTable = document.querySelector("#squad-team");
    squadTable.innerHTML = `<td colspan="6" style="text-align: center;">Please check your internet connections!</td>`;
  }
}

async function renderFavorites() {
  let favElem = document.getElementById("data-favorite");
  if (typeof favElem != "undefined" && favElem != null) {
    let teamData = await getAllDataFromDB();
    let html = "";
    if (teamData.length > 0) {
      teamData.forEach((team, index) => {
        let teamUrl = team.teamLogo;
        html += `
                  <a onclick="loadTeamPage(${
                    team.teamId
                  })" style="cursor: pointer;">
                      <div class="favorite-team-card-item">
                          <div class="favorite-team-img-wrapper">
                              <img src="${teamUrl.replace(
                                /^http:\/\//i,
                                "https://"
                              )}">
                          </div>
                          <p><b>${team.teamTitle}</b><br>${team.teamEmail}</p>
                      </div>
                  </a>
              `;
      });
    } else {
      html = `
              <p><b>There's no favorites team</b></p>
          `;
    }

    favElem.innerHTML = html;
  }
}

async function loadFavorite(teamId) {
  let toggleBtn = document.querySelector(".btn-team");
  let status = false;
  let findedData = await countDataDB(teamId);
  console.log(findedData);
  if (findedData < 1) {
    //tidak ada di list
    toggleBtn.classList.remove("red");
    status = true;
  } else {
    //ada di list
    toggleBtn.classList.add("red");
    status = false;
  }
  return status;
}

async function toggleFav(teamId) {
  let toggleBtn = document.querySelector(".btn-team");
  let teamTitle = document.querySelector("#team-title").innerHTML;
  let teamEmail = document.querySelector("#team-email").innerHTML;
  let teamLogo = document.querySelector("#team-img").getAttribute("src");
  let teamIdFavorite = teamId;
  toggleBtn.onclick = async e => {
    let check = await loadFavorite(teamIdFavorite);
    if (check) {
      await insertDataDB({
        teamId: teamIdFavorite,
        teamLogo: teamLogo,
        teamTitle: teamTitle,
        teamEmail: teamEmail
      });
      toggleBtn.classList.add("red");
      M.toast({ html: "Team added to favorite!", classes: "toast-bg" });
    } else {
      await deleteDataDB(teamIdFavorite);
      toggleBtn.classList.remove("red");
      M.toast({ html: "Team removed from favorite!", classes: "toast-bg" });
    }
  };
}

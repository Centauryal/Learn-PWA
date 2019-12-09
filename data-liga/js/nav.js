document.addEventListener("DOMContentLoaded", function() {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  var page = window.location.hash.substr(1);
  if (page == "") page = "standings";
  loadPage(page);

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        //Daftar event listener untuk setiap tautan menu
        document
          .querySelectorAll(".sidenav a, .topnav a")
          .forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              //hapus class
              document
                .querySelectorAll(".sidenav a, .topnav li")
                .forEach(elm => {
                  elm.classList.remove("active");
                });

              //tutup sidenav
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();

              //muat konten halaman yang dipanggil
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);

              //tambah class
              elm.parentElement.setAttribute("class", "active");
            });
          });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;

          switch (page) {
            case "standings":
              loadStandingsPage();
              break;
            case "matches":
              break;
            case "favorites":
              loadFavoritesPage();
              break;
          }
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
});

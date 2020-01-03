let dbPromised = idb.open("football-league", 1, function(upgradeDB) {
  let favoriteDb = upgradeDB.createObjectStore("favorites", {
    keyPath: "id"
  });
  favoriteDb.createIndex("name", "name", { unique: false });
});

function getAllFromDB() {
  let data = dbPromised
    .then(function(db) {
      var tx = db.transaction("favorites", "readonly");
      var store = tx.objectStore("favorites");
      return store.getAll();
    })
    .then(function(items) {
      return items;
    });
  return data;
}

async function getDataDBById(id) {
  let data = dbPromised
    .then(function(db) {
      var tx = db.transaction("favorites", "readonly");
      var store = tx.objectStore("favorites");
      return store.get(id);
    })
    .then(function(items) {
      return items;
    });

  return data;
}

function insertDataDB(item) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("favorites", "readwrite");
      var store = tx.objectStore("favorites");
      console.log(item);
      store.put(item);
      return tx.complete;
    })
    .then(function() {
      console.log("Favorite team added!");
    })
    .catch(function(e) {
      console.error(e);
    });
}

function deleteDataDB(teamId) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("favorites", "readwrite");
      var store = tx.objectStore("favorites");
      store.delete(teamId);
      return tx.complete;
    })
    .then(function() {
      console.log("Favorite team deleted!");
    })
    .catch(function(e) {
      console.error(e);
    });
}

function initDatabase() {
  let dbPromise = idb.open("football-league", 1, db => {
    if (!db.objectStoreNames.contains("favorites")) {
      let table = db.createObjectStore("favorites", {
        keyPath: "teamId"
      });
    }
  });
  return dbPromise;
}

function getAllDataFromDB(key) {
  let dbPromise = initDatabase();
  let data = dbPromise
    .then(function(db) {
      var tx = db.transaction("favorites", "readonly");
      var store = tx.objectStore("favorites");
      return store.getAll();
    })
    .then(function(items) {
      console.log("Data yang diambil: ");
      console.log(items);
      return items;
    })
    .catch(e => console.error(e));

  return data;
}

async function countDataDB(key) {
  let dbPromise = initDatabase();
  let count = await dbPromise
    .then(function(db) {
      let tx = db.transaction("favorites", "readonly");
      let store = tx.objectStore("favorites");
      return store.count(key);
    })
    .then(result => {
      return result;
    })
    .catch(e => console.error(e));

  return count;
}

function insertDataDB(item) {
  let dbPromise = initDatabase();
  dbPromise
    .then(function(db) {
      var tx = db.transaction("favorites", "readwrite");
      var store = tx.objectStore("favorites");
      store.add(item);
      return tx.complete;
    })
    .then(function() {
      console.log("Team added to Favorite.");
    })
    .catch(function(e) {
      console.error(e);
    });
}

function deleteDataDB(key) {
  let dbPromise = initDatabase();
  dbPromise
    .then(function(db) {
      var tx = db.transaction("favorites", "readwrite");
      var store = tx.objectStore("favorites");
      store.delete(key);
      return tx.complete;
    })
    .then(function() {
      console.log("team delete from favorite");
    })
    .catch(function(e) {
      console.error(e);
    });
}

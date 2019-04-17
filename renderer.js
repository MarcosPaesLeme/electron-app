// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const chokidar = require("chokidar");
const fs = require("fs");
const os = require("os");
const fse = require("fs-extra");
const { difference } = require("lodash");
const axios = require("axios");
var convert = require("xml-js");
const osPath = os.homedir();
const partwork = "partwork";
const path = require('path');

// document.getElementById("sync").disabled = true;

let watcher;
let showInLogFlag = false;
let globalPath;

function StartWatcher(path) {
  let folder = path.split("/");
  document.getElementById("start").disabled = true;
  if (document.getElementById("start").disabled == true) {
    document.getElementById("start").style.opacity = 0.5;
  } else {
    document.getElementById("start").style.opacity = 1;
  }
  document.getElementById("messageLogger").innerHTML =
    "Escaneando a pasta, aguarde...";
  watcher = chokidar.watch(path, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  function onWatcherReady() {
    console.info(
      "From here can you check for real changes, the initial scan has been completed."
    );
    showInLogFlag = true;
    document.getElementById("stop").style.display = "block";
    document.getElementById(
      "messageLogger"
    ).innerHTML = `A pasta <span style="font-weight: bold;color: #ea7748;">${
      folder[folder.length - 1]
    } </span> está sendo monitorada.`;
  }
  watcher
    .on("add", path => {
      console.log("File", path, "has been added");
      sendFile("add", path);
      // if (showInLogFlag) {
      //   addLog("File added : " + path, "new");
      // }
    })
    .on("addDir", function(path) {
      console.log("Directory", path, "has been added");
      // if (showInLogFlag) {
      //   addLog("Folder added : " + path, "new");
      // }
    })
    .on("change", function(path) {
      console.log("File", path, "has been changed");
      sendFile("change", path);
      // if (showInLogFlag) {
      //   addLog("A change ocurred : " + path, "change");
      // }
    })
    .on("unlink", function(path) {
      console.log("File", path, "has been removed");
      sendFile("unlink", path);
      // if (showInLogFlag) {
      //   addLog("A file was deleted : " + path, "delete");
      // }
    })
    .on("unlinkDir", function(path) {
      console.log("Directory", path, "has been removed");
      // if (showInLogFlag) {
      //   addLog("A folder was deleted : " + path, "delete");
      // }
    })
    .on("error", function(error) {
      console.log("Error happened", error);
      // if (showInLogFlag) {
      //   addLog("An error ocurred: ", "delete");
      //   console.log(error);
      // }
    })
    .on("ready", onWatcherReady)
    .on("raw", function(event, path, details) {
      // This event should be triggered everytime something happens.
      // console.log("Raw event info:", event, path, details);
      // setTimeout(function(){ sendFile(event, details.watchedPath, path) }, 3000);
      // sendFile(event, details.watchedPath, path);
    });
}

document.getElementById("start").addEventListener(
  "click",
  function(e) {
    const { dialog } = require("electron").remote;
    dialog.showOpenDialog(
      {
        properties: ["openDirectory"]
      },
      function(path) {
        // document.getElementById("sync").disabled = false;
        // console.log('Vendo o que saiu', osPath);
        if (path) {
          if (!fs.existsSync(osPath + `/${partwork}`))
            fs.mkdir(osPath + `/${partwork}`);
          globalPath = path[0];
          sendFile("sync", globalPath);
          StartWatcher(path[0]);
        } else {
          console.log("No path selected");
        }
      }
    );
  },
  false
);

document.getElementById("stop").addEventListener(
  "click",
  function(e) {
    if (!watcher) {
      console.log("You need to start first the watcher");
    } else {
      watcher.close();
      document.getElementById("start").disabled = false;
      document.getElementById("start").style.opacity = 1;
      document.getElementById("stop").style.display = "none";
      showInLogFlag = false;
      document.getElementById("messageLogger").innerHTML =
        "Nenhuma pasta esta sendo monitorada";
    }
  },
  false
);
// function resetLog() {
//   return (document.getElementById("log-container").innerHTML = "");
// }
// function addLog(message, type) {
//   const el = document.getElementById("log-container");
//   const newItem = document.createElement("LI"); // Create a <li> node
//   const textnode = document.createTextNode(message); // Create a text node
//   if (type == "delete") {
//     newItem.style.color = "red";
//   } else if (type == "change") {
//     newItem.style.color = "blue";
//   } else {
//     newItem.style.color = "green";
//   }
//   newItem.appendChild(textnode); // Append the text to <li>
//   el.appendChild(newItem);
// }

function sendFile(event, fileName) {

  if (event === "add") {
    // fs.readFile(`${fileName}`, (err, data) => {
    //   if (err) throw err;
    //   console.log(data);
    //   var result1 = convert.xml2json(data, {
    //     compact: true,
    //     spaces: 4
    //   });
    //   axios
    //     .post("http://localhost:3000/upload/uploadxml", { data: result1 })
    //     .then(res => {
    //       console.log("Retorno", res);
    //       let file = fileName.split("/");
    //       fse.move(
    //         `${fileName}`,
    //         osPath + `/${partwork}/${file[file.length - 1]}`,
    //         { overwrite: true },
    //         err => {
    //           if (err) return console.error(err);

    //           console.log("success!");
    //         }
    //       );
    //       // console.log("success!");
    //       // console.log(res);
    //       let data = new Date();
    //       let lastSync = data.toTimeString();
    //       lastSync = lastSync.split(" ")[0];
    //       document.getElementById(
    //         "syncManuallyLogger"
    //       ).innerHTML = `Ultima sincronização feita ás ${lastSync} `;
    //     });
    // });
  } else if (event === "sync") {
    let pasta1 = fs.readdirSync(globalPath);
    let pasta2 = fs.readdirSync(osPath + `/${partwork}`);

    let fileSync = difference(pasta1, pasta2);
    console.log("FILESYNC", fileSync);
    // console.log('Dir',globalPath)
    // let retorno = readDirectorySynchronously(globalPath);
    // console.log('aeeeee',retorno)
    // fileSync.forEach(file => {
    //   fs.readFile(`${globalPath}/${file}`, (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //     var result1 = convert.xml2json(data, {
    //       compact: true,
    //       spaces: 4
    //     });
    //     axios
    //       .post("http://localhost:3000/upload/uploadxml", { data: result1 })
    //       .then(res => {
    //         console.log("Retorno", res);
    //         fse.move(
    //           `${globalPath}/${file}`,
    //           osPath + `/${partwork}/${file}`,
    //           { overwrite: true },
    //           err => {
    //             if (err) return console.error(err);

    //             console.log("success!");
    //           }
    //         );
    //         // console.log("success!");
    //         // console.log(res);
    //         let data = new Date();
    //         let lastSync = data.toTimeString();
    //         lastSync = lastSync.split(" ")[0];
    //         document.getElementById(
    //           "syncManuallyLogger"
    //         ).innerHTML = `Ultima sincronização feita ás ${lastSync} `;
    //       });
    //   });
    // });
  } else {
    console.log("Evento, " + event + " não esta sendo monitorado");
  }
}

// function getFilesFromDir(dir) {
//   var filesToReturn = [];
//   function walkDir(currentPath) {
//     var files = fs.readdirSync(currentPath);
//     for (var i in files) {
//       var curFile = path.join(currentPath, files[i]);      
//       if (fs.statSync(curFile).isFile()) {
//         filesToReturn.push(curFile.replace(dir, ''));
//       } else if (fs.statSync(curFile).isDirectory()) {
//        walkDir(curFile);
//       }
//     }
//   };
//   walkDir(dir);
//   return filesToReturn; 
// }

// var filesCollection = [];
// const directoriesToSkip = ['bower_components', 'node_modules', 'www', 'platforms'];

// function readDirectorySynchronously(directory) {
//     var currentDirectorypath = path.join(__dirname + directory);
//     console.log('currentDirectorypath',currentDirectorypath)
//     var currentDirectory = fs.readdirSync(currentDirectorypath, 'utf8');

//     currentDirectory.forEach(file => {
//         var fileShouldBeSkipped = directoriesToSkip.indexOf(file) > -1;
//         var pathOfCurrentItem = path.join(__dirname + directory + '/' + file);
//         if (!fileShouldBeSkipped && fs.statSync(pathOfCurrentItem).isFile()) {
//             filesCollection.push(pathOfCurrentItem);
//         }
//         else if (!fileShouldBeSkipped) {
//             var directorypath = path.join(directory + '\\' + file);
//             readDirectorySynchronously(directorypath);
//         }
//     });
// }




function syncFiles() {
  let data = new Date();
  let lastSync = data.toTimeString();
  lastSync = lastSync.split(" ")[0];
  // document.getElementById("sync").disabled = true;
  // sendFile('sync',globalPath);
  document.getElementById(
    "syncManuallyLogger"
  ).innerHTML = `Ultima sincronização manual feita ás ${lastSync} `;
  // document.getElementById("sync").disabled = false;
}

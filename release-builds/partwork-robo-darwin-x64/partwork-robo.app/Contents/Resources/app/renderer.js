// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const chokidar = require('chokidar');
const fs = require('fs');
const axios = require('axios');
var convert = require("xml-js");

let watcher = null;
let showInLogFlag = false;

function StartWatcher(path) {
     let folder = path.split("/")
    document.getElementById("start").disabled = true;
    if(document.getElementById("start").disabled == true) {
     document.getElementById("start").style.opacity = 0.5;
    } else {
     document.getElementById("start").style.opacity = 1;
    }
    document.getElementById("messageLogger").innerHTML = "Escaneando a pasta, aguarde...";
    watcher = chokidar.watch(path, {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });
    function onWatcherReady() {
        console.info('From here can you check for real changes, the initial scan has been completed.');
        showInLogFlag = true;
        document.getElementById("stop").style.display = "block";
        document.getElementById("messageLogger").innerHTML = `A pasta <span style="font-weight: bold;color: #ea7748;">${folder[folder.length -1]} </span> está sendo monitorada.`;
    }
    watcher
        .on('add', (path) => {
            console.log('File', path, 'has been added');
            if (showInLogFlag) {
                addLog("File added : " + path, "new");
            }
        })
        .on('addDir', function (path) {
            console.log('Directory', path, 'has been added');
            if (showInLogFlag) {
                addLog("Folder added : " + path, "new");
            }
        })
        .on('change', function (path) {
            console.log('File', path, 'has been changed');
            if (showInLogFlag) {
                addLog("A change ocurred : " + path, "change");
            }
        })
        .on('unlink', function (path) {
            console.log('File', path, 'has been removed');
            if (showInLogFlag) {
                addLog("A file was deleted : " + path, "delete");
            }
        })
        .on('unlinkDir', function (path) {
            console.log('Directory', path, 'has been removed');
            if (showInLogFlag) {
                addLog("A folder was deleted : " + path, "delete");
            }
        })
        .on('error', function (error) {
            console.log('Error happened', error);
            if (showInLogFlag) {
                addLog("An error ocurred: ", "delete");
                console.log(error);
            }
        })
        .on('ready', onWatcherReady)
        .on('raw', function (event, path, details) {
            // This event should be triggered everytime something happens.
            console.log('Raw event info:', event, path, details);
            sendFile(event,details.watchedPath, path);
        });
}

document.getElementById("start").addEventListener("click", function (e) {
    const { dialog } = require('electron').remote;
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (path) {
        if (path) {
            StartWatcher(path[0]);
        } else {
            console.log("No path selected");
        }
    });
}, false);

document.getElementById("stop").addEventListener("click", function (e) {
    if (!watcher) {
        console.log("You need to start first the watcher");
    } else {
        watcher.close();
        document.getElementById("start").disabled = false;
        document.getElementById("start").style.opacity = 1;
        document.getElementById("stop").style.display = 'none';
        showInLogFlag = false;
        document.getElementById("messageLogger").innerHTML = "Nenhuma pasta esta sendo monitorada";
    }
}, false);
function resetLog() {
    return document.getElementById("log-container").innerHTML = "";
}
function addLog(message, type) {
    const el = document.getElementById("log-container");
    const newItem = document.createElement("LI");       // Create a <li> node
    const textnode = document.createTextNode(message);  // Create a text node
    if (type == "delete") {
        newItem.style.color = "red";
    } else if (type == "change") {
        newItem.style.color = "blue";
    } else {
        newItem.style.color = "green";
    }
    newItem.appendChild(textnode);                    // Append the text to <li>
    el.appendChild(newItem);
}

function sendFile(event,file, fileName) {

     if(event === 'rename') {
          axios
          .delete("http://localhost:3001/upload/uploadxml", {data: fileName})
          .then(res => {
            console.log(res);
          });   
     } else {
          fs.readFile(`${file}/${fileName}`, (err, data) => {
               if (err) throw err;
               console.log(data);
               var result1 = convert.xml2json(data, {
               compact: true,
               spaces: 4
             });
             console.log(result1);
             axios
               .post("http://localhost:3001/upload/uploadxml", {data: result1})
               .then(res => {
                 console.log(res);
               });
             });
     }
     
     

     
   }
"use strict";

const electron = require("electron");
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
const Menu = electron.Menu;
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != "darwin") {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 375,
    height: 600,
    resizable: false,
    icon: path.join(__dirname, 'assets/icons/png/48x48.png')
  });

  // and load the index.html of the app.
  mainWindow.loadURL("file://" + __dirname + "/login.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Setting Menu
  var menu = Menu.buildFromTemplate([
    // {
    //   label: "Sair",
    //   click() {
    //     app.quit();
    //   }
    // }
  ]);

  Menu.setApplicationMenu(menu);
  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
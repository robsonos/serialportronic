const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

// Place holders for our windows so they don't get garbage collected.
let mainWindow;

async function createWindow() {
  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load ionic framework
  var startUrl = url.format({
    pathname: path.join(__dirname, "../www/index.html"),
    protocol: "file:",
    slashes: true
  });

  // If we are developers we might as well open the devtools by default.
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Open main window after dom is ready
  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

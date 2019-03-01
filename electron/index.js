var { app, BrowserWindow } = require("electron");
var path = require("path");
var url = require("url");
var Splashscreen = require("@trodi/electron-splashscreen");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var window = BrowserWindow;

function createWindow() {
  // Window options
  var windowOptions = {
    width: 1200,
    height: 800,
    show: false
  };

  // Splash Screen
  window = Splashscreen.initSplashScreen({
    windowOpts: windowOptions,
    templateUrl: path.join(__dirname, "assets/splash.html"),
    delay: 0,
    splashScreenOpts: {
      height: 300,
      width: 300,
      backgroundColor: "white"
      // transparent: true,
    }
  });

  // Load ionic
  var startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../www/index.html"),
      protocol: "file:",
      slashes: true
    });
  window.loadURL(startUrl);

  // Open the DevTools.
  window.webContents.openDevTools();

  // Emitted when the window is closed.
  window.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
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
  if (window === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

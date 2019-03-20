const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = BrowserWindow;

function createWindow() {
  // Window options
  var windowOptions = {
    height: 800,
    width: 1200,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  };

  // Load window options
  mainWindow = new BrowserWindow(windowOptions);

  // Hot reload
  let isServing;
  let server;
  const args = process.argv.slice(1);
  args.forEach(val => {
    if (val.substring(0, 9) == '--address') {
      isServing = val;
      server = val.substring(10);
    }
  });

  if (isServing) {
    // Run from server
    console.log('[electron] Running from server');
    // Reload module
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
    });

    // Load from server
    mainWindow.loadURL(server);
  } else {
    // Run from www folder
    console.log('[electron] Running from www folder');
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../www/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  if (isDev) {
    console.log('[electron] Running in dev mode');
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.openDevTools();
  } else {
    console.log('[electron] Running in prod mode');
  }

  // Open main window after dom is ready
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.maximize();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

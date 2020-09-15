import {BrowserWindow, shell, app, BrowserView, Tray, Menu} from 'electron';
import windowStateKeeper from 'electron-window-state';
const path = require('path');
const url = require('url');
import {format} from 'url';
import {environment} from './environment';

// const {ShortcutConfig} = require('./shortcutConfig');
// const shortcuts = require('./shortcuts');

let win = {};
let gOauthWindow = undefined;
let tray = null;
let contextMenu;
let config = {};

class Main {
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static mainView: Electron.BrowserView;
  static BrowserWindowRef: any;

  public static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
    Main.BrowserWindowRef = browserWindow;
    Main.application = app;
    Main.application.on('ready', Main.onReady);
  }

  private static onReady(): void {
    const mainWindowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600,
      fullScreen: false
    })

    Main.mainWindow = new Main.BrowserWindowRef({
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      minHeight: 600,
      minWidth: 400,
      title: 'Google Chat',
      icon: path.join(__dirname, 'icons/chat_64.png')
    });

    Main.mainView = new BrowserView();
    Main.mainWindow.setBrowserView(Main.mainView);
    Main.mainView.setBounds({x: 0, y: 0, width: mainWindowState.width, height: mainWindowState.height});
    Main.mainView.webContents.loadURL(environment.serviceUrl);

    // Main.mainWindow.loadURL(format({
    //   pathname: path.join(__dirname, 'index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }));
    Main.mainWindow.on('closed', Main.onClose);
    Main.mainWindow.on('minimize', Main.onMinimize);

    mainWindowState.manage(Main.mainWindow);

    if (!environment.production) {
      Main.mainView.webContents.openDevTools();
    }
  }

  private static onMinimize(event: Event): void {
    event.preventDefault();
    Main.mainWindow.hide();
  }

  private static onClose(): void {

  }
}

export default Main.main(app, BrowserWindow);

// function createTray(win) {
//   // if tray-icon is set to null in config file then don't create a tray icon
//   if (!config['tray-icon']) {
//     return;
//   }
//
//   tray = new Tray(path.join(__dirname, `icons/${config['tray-icon']}`));
//   contextMenu = Menu.buildFromTemplate([
//     {
//       label: 'Show',
//       click:  function() {
//         win.show();
//       },
//       enabled: false,
//       id: 'show-win'
//     },
//     {
//       label: 'Hide',
//       click:  function() {
//         win.hide();
//       },
//       id: 'hide-win'
//     },
//     {
//       label: 'Toggle FullScreen',
//       click:  function() {
//         win.setFullScreen(!win.isFullScreen());
//       },
//     },
//     {
//       label: 'Quit',
//       click:  function() {
//         app.isQuitting = true;
//         app.quit();
//       }
//     }
//   ]);
//   tray.setToolTip('Todoist');
//   tray.setContextMenu(contextMenu);
// }

// function setCustomUserAgent() {
//   session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
//     details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';
//     callback({ cancel: false, requestHeaders: details.requestHeaders });
//   });
// }

function createWindow () {
  // setCustomUserAgent();

  // const configInstance = new ShortcutConfig();
  // config = configInstance.config;
  //
  // let mainWindowState = windowStateKeeper({
  //   defaultWidth: 800,
  //   defaultHeight: 600
  // });

  // use mainWindowState to restore previous
  // size/position of window
  // win = new BrowserWindow({
  //   x: mainWindowState.x,
  //   y: mainWindowState.y,
  //   width: mainWindowState.width,
  //   height: mainWindowState.height,
  //   minHeight: 600,
  //   minWidth: 420,
  //   title: 'Todoist',
  //   icon: path.join(__dirname, 'icons/icon.png')
  // });


  // and load the index.html of the app.
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, (config['beta'] ? 'beta.html' : 'index.html')),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  // createTray(win);
  // shortcutsInstance = new shortcuts(win, app);
  // shortcutsInstance.registerAllShortcuts();

  // react on close and minimize
  // win.on('minimize',function(event){
  //   event.preventDefault();
  //   win.hide();
  // });

  // win.on('close', function (event) {
  //   // we should not hide the window if there is no tray icon
  //   // because user will not be able to close the app
  //   if (!config['tray-icon']) {
  //     app.isQuitting = true;
  //   }
  //
  //   if(!app.isQuitting){
  //     event.preventDefault();
  //     win.hide();
  //   }
  //
  //   return false;
  // });

  // win.on('hide', function() {
  //   contextMenu.getMenuItemById('show-win').enabled = true;
  //   contextMenu.getMenuItemById('hide-win').enabled = false;
  //   tray.setContextMenu(contextMenu);
  // });
  //
  // win.on('show', function() {
  //   contextMenu.getMenuItemById('show-win').enabled = false;
  //   contextMenu.getMenuItemById('hide-win').enabled = true;
  //   tray.setContextMenu(contextMenu);
  // });
  //
  // win.webContents.on('new-window', handleRedirect)
  // manage size/position of the window
  // so it can be restored next time
  // mainWindowState.manage(win);
}

// function handleRedirect(e, url) {
//   // there may be some popups on the same page
//   if (url == win.webContents.getURL()) {
//     return true;
//   }
//
//   // when user is logged in there is link
//   // asks to update the page. It should be opened
//   // in the app and not in the external browser
//   if (/https:\/\/todoist\.com\/app/.test(url)) {
//     win.reload();
//     return true;
//   }
//
//   /**
//    * In case of google or facebook oauth login
//    * let's create another window and listen for
//    * its "close" event.
//    * As soon as that event fired we can refresh our
//    * main window.
//    */
//   if (/google.+?oauth/.test(url) || /facebook.+?oauth/.test(url)) {
//     e.preventDefault();
//     gOauthWindow = new BrowserWindow();
//     gOauthWindow.loadURL(url);
//     gOauthWindow.on('close', () => {
//       win.reload();
//     })
//     return true;
//   }
//
//   /*
//    * The first time the settings button is clicked
//    * the 'new-window' event is emitted with the url to the settings page
//    * The electron default behavior(creating a new window) is prevented
//    * and instead the contents of the main window are reloaded with the contents
//    * from the settings page effectively emulating the behavior of the website
//    */
//   if (/prefs\/account/.test(url)) {
//     e.preventDefault();
//     win.loadURL(url);
//     return true;
//   }
//
//   e.preventDefault()
//   shell.openExternal(url)
// }

// var gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     // Someone tried to run a second instance, we should focus our window.
//     if (win) {
//       if (win.isMinimized()){
//         win.restore();
//         win.focus();
//       }
//       win.show();
//       win.focus();
//     }
//   });
// }
//
// app.on('ready', createWindow);

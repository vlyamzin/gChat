import {BrowserWindow, app, ipcMain, BrowserView} from 'electron';
import windowStateKeeper from 'electron-window-state';
const path = require('path');
import {environment} from './environment';
import {gTray, IgTray} from './tray';
import {BrowserViewContainer} from './browser-view-container';
import updater from './auto-updater';
import {Channels} from './shared/channels';

export enum AppState {
  IDLE = 1,
  ACTIVE,
  MINIMIZED,
}

class Main {
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static mainView: BrowserViewContainer;
  static tray: IgTray;
  static BrowserWindowRef: any;
  static appState: AppState;
  private static gotLock: boolean;
  private static onShow = Main.windowEventHandler('show');
  private static onMinimize = Main.windowEventHandler('minimize');

  public static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
    Main.BrowserWindowRef = browserWindow;
    Main.application = app;
    Main.gotLock = Main.application.requestSingleInstanceLock();
    if (!Main.gotLock) {
      Main.application.quit();
    } else {
      Main.application.on('second-instance', Main.onSecondInstance);
      Main.application.on('ready', Main.onReady);
    }
  }

  private static onReady(): void {
    const mainWindowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600,
      fullScreen: false
    });

    Main.mainWindow = new Main.BrowserWindowRef({
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      minHeight: 600,
      minWidth: 400,
      title: 'Google Chat',
      icon: path.join(__dirname, 'icons/chat_64.png'),
      backgroundColor: '#002b36',
    });

    Main.appState = AppState.ACTIVE;
    Main.createBrowser();
    Main.createTray();

    if (process.platform === 'darwin'){
      Main.application.dock.show();
    }

    Main.application.on('before-quit', Main.onBeforeQuit);
    Main.application.on('activate', Main.onActivate);
    Main.mainWindow.on('close', Main.onClose);
    Main.mainWindow.on('show', Main.onShow);
    Main.mainWindow.on('minimize', Main.onMinimize);
    Main.mainWindow.on('restore', Main.onShow);
    ipcMain.on(Channels.NOTIFICATION_CLICK, () => {
        Main.mainWindow.show();
    });

    mainWindowState.manage(Main.mainWindow);
    Main.startAutoUpdateCheck();
  }

  private static windowEventHandler(eventType: string): Function {
    return (event: Event) => {
      Main.appState = eventType === 'show' ? AppState.ACTIVE : AppState.MINIMIZED;
      Main.tray?.updateTrayState(Main.appState);
    }
  }

  private static onSecondInstance(event: Event): void {
    if (Main.mainWindow) {
      if (Main.mainWindow.isMinimized() || AppState.MINIMIZED) {
        Main.mainWindow.restore();
      }
      Main.mainWindow.focus();
    }
  }

  private static onClose(event: Event): boolean {
    if (!Main.tray?.isQuitting) {
      event.preventDefault();
      Main.windowEventHandler('close')(event);
      Main.mainWindow.hide();
    }

    return false;
  }

  private static onBeforeQuit(event: Event): void {
    if (updater.restartAfterUpdate) {
      Main.application.quit();
    }
  }

  private static onActivate(event: Event): void {
    if (process.platform === 'darwin') {
      event.preventDefault();
      Main.windowEventHandler('show')(event);
      Main.mainWindow.restore();
    }
  }

  private static createBrowser(): void {
    Main.mainView = new BrowserViewContainer();
    Main.mainWindow.setBrowserView(Main.mainView.browserView);
    Main.mainView.init(Main.mainWindow);
  }

  private static createTray(): void {
    if (!Main.tray && environment.useTray) {
      Main.tray = new gTray();
      Main.tray.init(Main.mainWindow, Main.application);
    }
  }

  private static startAutoUpdateCheck(): void {
    updater.init(Main.mainWindow);
    if (environment.production) {
      updater.checkForUpdates();
    }
  }
}

Main.main(app, BrowserWindow);

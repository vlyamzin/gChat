import {BrowserWindow, app} from 'electron';
import windowStateKeeper from 'electron-window-state';
const path = require('path');
import {environment} from './environment';
import {gTray, IgTray} from './tray';
import {BrowserViewContainer} from './browser-view-container';

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
  private static onShow = Main.windowEventHandler('show');
  private static onMinimize = Main.windowEventHandler('minimize');

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
    });

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

    Main.appState = AppState.ACTIVE;
    Main.createBrowser();
    Main.createTray();

    Main.mainWindow.on('close', Main.onClose);
    Main.mainWindow.on('show', Main.onShow);
    Main.mainWindow.on('minimize', Main.onMinimize);
    Main.mainWindow.on('restore', Main.onShow)

    mainWindowState.manage(Main.mainWindow);
  }

  private static windowEventHandler(eventType: string): Function {
    return (event: Event) => {
      event.preventDefault();
      Main.appState = eventType === 'show' ? AppState.ACTIVE : AppState.MINIMIZED;
      Main.tray?.updateTrayState(Main.appState);
    }
  }

  private static onClose(event: Event): boolean {
    if (Main.tray?.hasTray && !Main.tray?.isQuitting) {
      Main.windowEventHandler('close')(event);
      Main.mainWindow.hide();
    }

    return false;
  }

  private static createBrowser(): void {
    Main.mainView = new BrowserViewContainer();
    Main.mainView.init(Main.mainWindow);
    Main.mainWindow.setBrowserView(Main.mainView.browserView);
  }

  private static createTray(): void {
    if (!Main.tray && environment.useTray) {
      Main.tray = new gTray();
      Main.tray.init(Main.mainWindow, Main.application);
    }
  }
}

Main.main(app, BrowserWindow);

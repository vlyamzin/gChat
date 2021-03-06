import {Tray, Menu} from 'electron';
import * as path from 'path';
import {AppState} from './main';
import updater from './auto-updater';
import {Platform} from './shared/platform';

export interface IgTray {
  init: (window: Electron.BrowserWindow, app: Electron.App) => void;
  tray: Electron.Tray;
  updateTrayState: (state: AppState) => void
  hasTray: boolean;
  isQuitting: boolean;
}

export class gTray implements IgTray {
  private _trayInstance: Electron.Tray;
  private _appInstance: Electron.App;
  private _contextMenu: Electron.Menu;
  private _trayIsAvailable: boolean;
  private _isQuitting: boolean;

  constructor() {
    this._trayIsAvailable = false;
    this._isQuitting = false;
  }

  public init(window: Electron.BrowserWindow, app: Electron.App): void {
    this._appInstance = app;
    this.createContextMenu(window, app);
    if (Platform.isOSX()) {
      this._trayIsAvailable = false;
      app.dock.setMenu(this._contextMenu);
    } else {
      this._trayIsAvailable = true;
      this._trayInstance = new Tray(path.join(__dirname, 'icons/256x256.png'));
      this._trayInstance.setToolTip('Google Chat');
      this._trayInstance.setContextMenu(this._contextMenu);
    }
  }

  public get tray(): Electron.Tray {
    return this._trayInstance;
  }

  public get hasTray(): boolean {
    return this._trayIsAvailable;
  }

  public get isQuitting(): boolean {
    return this._isQuitting;
  }

  public updateTrayState(state: AppState): void {
    switch (state) {
      case AppState.ACTIVE:
        this._contextMenu.getMenuItemById('show-window').enabled = false;
        this._contextMenu.getMenuItemById('hide-window').enabled = true;
        break;
      case AppState.MINIMIZED:
        this._contextMenu.getMenuItemById('show-window').enabled = true;
        this._contextMenu.getMenuItemById('hide-window').enabled = false;
        break;
    }

    if (Platform.isOSX()) {
      this._appInstance.dock.setMenu(this._contextMenu);
    } else {
      this._trayInstance.setContextMenu(this._contextMenu);
    }
  }

  private createContextMenu(window: Electron.BrowserWindow, app: Electron.App): void {
    this._contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Google Chat',
        click: () => {
          window.restore();
        },
        enabled: false,
        id: 'show-window'
      },
      {
        label: 'Minimize to tray',
        click: () => {
          window.minimize();
        },
        id: 'hide-window'
      },
      {
        label: 'Check for updates',
        click: () => {
          updater.performedByUser = true;
          updater.checkForUpdates();
        }
      },
      {
        label: 'Quit Google Chat',
        click: () => {
          this._isQuitting = true;
          window.destroy();
          app.quit();
        },
        id: 'quit-app'
      }
    ]);
  }
}

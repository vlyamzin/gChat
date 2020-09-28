import {BrowserView, shell} from "electron";
import {environment} from './environment';
import * as path from 'path';


export class BrowserViewContainer {
  private static _windowRef: Electron.BrowserWindow;
  private readonly _browserViewRef: Electron.BrowserView;

  constructor() {
    this._browserViewRef = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js'),
      }
    });
  }

  public init(window: Electron.BrowserWindow): void {
    BrowserViewContainer._windowRef = window;
    this._browserViewRef.setAutoResize( { width: true, height: true } )
    this._browserViewRef.webContents.loadURL(environment.serviceUrl);
    this._browserViewRef.webContents.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';
    this.setBounds();
    this._browserViewRef.webContents.on("new-window", (event, url) => {
      shell.openExternal(url);
      event.preventDefault();
    });

    if (!environment.production) {
      this._browserViewRef.webContents.openDevTools();
    }
  }

  public get browserView(): Electron.BrowserView {
    return this._browserViewRef;
  }

  private setBounds(): void {
    this._browserViewRef.setBounds({
      x: 0,
      y: 0,
      width: BrowserViewContainer._windowRef.getBounds().width,
      height: BrowserViewContainer._windowRef.getBounds().height - BrowserViewContainer.getTitleBarSize()
    })
  }

  private static getTitleBarSize(): number {
    if (process.platform === "darwin") {  // macOS
      return 20;
    } else if (process.platform === "win32") {  // windows
      return BrowserViewContainer._windowRef.isMenuBarVisible() ? 60 : 40;
    } else {  // linux
      return BrowserViewContainer._windowRef.isMenuBarVisible() ? 25 : 0;
    }
  }
}

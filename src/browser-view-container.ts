import {BrowserView, shell, session, OnBeforeSendHeadersListenerDetails, BeforeSendResponse} from 'electron';
import {environment} from './environment';
import * as path from 'path';
import {ContextMenu} from './context-menu';
import {Platform} from './shared/platform';


export class BrowserViewContainer {
  private static _windowRef: Electron.BrowserWindow;
  private readonly _browserViewRef: Electron.BrowserView;
  private _contextMenu: ContextMenu;

  constructor() {
    this._browserViewRef = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      }
    });
    this._contextMenu = new ContextMenu();
  }

  public init(window: Electron.BrowserWindow): void {
    BrowserViewContainer._windowRef = window;
    this._browserViewRef.setAutoResize( { width: true, height: true } )
    this._browserViewRef.webContents.loadURL(environment.serviceUrl);
    session.defaultSession.webRequest.onBeforeSendHeaders(BrowserViewContainer.overwriteUA)
    this.setBounds();
    this._browserViewRef.webContents.on("new-window", (event, url) => {
      shell.openExternal(url);
      event.preventDefault();
    });

    this._contextMenu.init(this._browserViewRef.webContents);

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
    if (Platform.isOSX()) {
      return 20;
    } else if (Platform.isWin()) {
      return BrowserViewContainer._windowRef.isMenuBarVisible() ? 60 : 40;
    } else {
      return BrowserViewContainer._windowRef.isMenuBarVisible() ? 25 : 0;
    }
  }

  private static getUserAgent(): string {
    if (Platform.isOSX()) {
      return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';
    } else if (Platform.isWin()) {
      return 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';
    } else if (Platform.isLinux()){
      return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';
    }
  }

  private static overwriteUA(details: OnBeforeSendHeadersListenerDetails, callback: (beforeSendResponse: BeforeSendResponse) => void): void {
    if (/accounts.google/.test(details.url)) {
      details.requestHeaders['User-Agent'] = 'Chrome';
    } else {
      details.requestHeaders['User-Agent'] = BrowserViewContainer.getUserAgent();
    }
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  }
}

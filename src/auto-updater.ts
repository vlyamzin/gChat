import {autoUpdater, UpdateInfo, CancellationToken} from 'electron-updater';
import {AppUpdater} from 'electron-updater/out/AppUpdater';
import {ReleaseNoteInfo} from 'builder-util-runtime/out/updateInfo'
import {BrowserWindow, dialog} from 'electron';
import {environment} from './environment';

class AutoUpdater {

  public restartAfterUpdate: boolean;
  private static _updater = autoUpdater;
  private _cancellationToken: CancellationToken;
  private _performedByUser = false;

  private static mapReleaseNotes(releaseNotes: string | Array<ReleaseNoteInfo> | null): string {
    if (typeof releaseNotes === 'string') {
      return releaseNotes;
    }

    return (releaseNotes || []).map(n => n.note).join('\n');
  }

  /**
   * @function init
   * @description Initialize module. Setup auto-updater listeners
   * @public
   * */
  public init(window: BrowserWindow): void {
    this.restartAfterUpdate = false;

    const log = require("electron-log");
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;


    autoUpdater.on('update-available', (info: UpdateInfo) => this.onAvailable(info, window));
    autoUpdater.on('update-not-available', () => this.onNotAvailable(window));
    autoUpdater.on('download-progress', (progressObj) => {
      //TODO deal with progress
      window.setProgressBar(progressObj.percent / 100);
    });
    autoUpdater.on('update-downloaded', async () => this.onDownloaded(window));
    autoUpdater.on('error', () => this.onError(window));

  }

  public get instance(): AppUpdater {
    return AutoUpdater._updater;
  }

  public set cancellationToken(token: CancellationToken) {
    this._cancellationToken = token;
  }

  public get performedByUser(): boolean {
    return this._performedByUser;
  }

  public set performedByUser(value: boolean) {
    this._performedByUser = value;
  }

  public checkForUpdates(): void {
    this.instance.checkForUpdates()
      .then((result) => this.cancellationToken = result.cancellationToken)
      .catch((err) => console.log('Auto Update service is not started', err))
      .finally(() => {
          this.performedByUser = false;
      });
  }

  private async onAvailable(info: UpdateInfo, window: BrowserWindow): Promise<void> {
    const result = await dialog.showMessageBox(window, {
      type: 'info',
      buttons: ['No', 'Yes'],
      title: 'New version available',
      message: `There is a new version of gChat: ${info.version}. Would you like to download and install it?`,
      detail: `Release notes: \n ${AutoUpdater.mapReleaseNotes(info.releaseNotes)}`
    });

    if (result.response > 0) {
      autoUpdater.downloadUpdate(this._cancellationToken);
    }
  }

  private onNotAvailable(window: BrowserWindow): void {
    if (this.performedByUser) {
      dialog.showMessageBox(window, {
        type: 'info',
        buttons: ['OK'],
        title: 'No updates available',
        message: 'There is nothing to update. You have the latest version.'
      });
    }
  }

  private async onDownloaded(window: BrowserWindow): Promise<void> {
    const result = await dialog.showMessageBox(window, {
      type: 'info',
      buttons: ['No', 'Yes'],
      title: 'Downloaded',
      message: 'The new version has been downloaded successfully!',
      detail: 'You need to restart the application to apply changes. Would you like to do it now?'
    });

    if (result.response > 0) {
      this.restartAfterUpdate = true;
      autoUpdater.quitAndInstall();
    }
  }

  private onError(window: BrowserWindow): void {
    console.log('Error happened during the update');
    if (!this.performedByUser) {
      return;
    }
    if (environment.production) {
      dialog.showMessageBox(window, {
        type: 'error',
        buttons: ['OK'],
        title: 'Error',
        message: 'The error happened during the download process. Try again later.'
      });
    }
  }
}

const updater = new AutoUpdater();
export default updater;

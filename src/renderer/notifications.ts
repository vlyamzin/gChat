import {environment} from '../environment';
import {ipcRenderer} from "electron";
import {Channels} from '../shared/channels';

export class Notifications {
  public setNotificationCallback(): void {
    const OldNotify = window.Notification;
    const newNotify = function (title: string, opt: NotificationOptions): Notification {
      const _t = `${environment.appName}: New message from ${title}`;
      opt.silent = false;
      Notifications.notifyNotificationCreate(title, opt);
      const instance = new OldNotify(_t, opt);
      instance.addEventListener('click', () => Notifications.notifyNotificationClick());
      return instance;
    };

    newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
    Object.defineProperty(newNotify, 'permission', {
      get: () => OldNotify.permission,
    });

    // @ts-ignore
    window.Notification = newNotify;
  }

  private static notifyNotificationCreate(title: string, opt: NotificationOptions) {
    ipcRenderer.send(Channels.NOTIFICATION, title, opt);
  }
  private static notifyNotificationClick() {
    ipcRenderer.send(Channels.NOTIFICATION_CLICK);
  }
}

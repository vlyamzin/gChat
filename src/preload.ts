import { ipcRenderer } from 'electron';
import {environment} from './environment';

function setNotificationCallback(createCallback: Function, clickCallback: Function): void {
  const OldNotify = window.Notification;
  const newNotify = function (title: string, opt: NotificationOptions): Notification {
    const _t = `${environment.appName}: New message from ${title}`;
    opt.silent = false;
    createCallback(title, opt);
    const instance = new OldNotify(_t, opt);
    instance.addEventListener('click', () => clickCallback());
    return instance;
  };

  newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
  Object.defineProperty(newNotify, 'permission', {
    get: () => OldNotify.permission,
  });

  // @ts-ignore
  window.Notification = newNotify;
}

function notifyNotificationCreate(title: string, opt: NotificationOptions) {
  ipcRenderer.send('notification', title, opt);
}
function notifyNotificationClick() {
  ipcRenderer.send('notification-click');
}

setNotificationCallback(notifyNotificationCreate, notifyNotificationClick);

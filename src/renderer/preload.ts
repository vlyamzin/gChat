import {Notifications} from './notifications';
import {Quote} from './quote';

class PreloadManager {
  private readonly notifications: Notifications;
  private readonly quoteService: Quote;

  constructor() {
    this.notifications = new Notifications();
    this.quoteService = new Quote();
  }

  public init(): void {
    this.notifications.setNotificationCallback();
    this.quoteService.initEventListeners();
  }
}

const manager = new PreloadManager();
manager.init();

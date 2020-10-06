import contextMenu from 'electron-context-menu';
import {ContextMenuParams, WebContents} from 'electron';
import {Channels} from './shared/channels';

export class ContextMenu {
  private _view: WebContents;

  public init(view: WebContents): Function {
    this._view = view;

    return contextMenu({
      window: view,
      prepend: (actions, params, view) => {
          return [
            {
              label: 'Quote',
              click: () => {
                  this.quote(params);
              }
            },
            {
              label: 'Quote selection'
            }
          ]
      }
    });
  }

  private quote(params: ContextMenuParams): void {
    this._view.send(Channels.QUOTE, {x: params.x, y: params.y});
  }
}

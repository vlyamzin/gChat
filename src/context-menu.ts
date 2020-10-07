import contextMenu from 'electron-context-menu';
import {ContextMenuParams, WebContents} from 'electron';
import {Channels} from './shared/channels';
import {environment} from './environment';

export class ContextMenu {
  private _view: WebContents;

  public init(view: WebContents): Function {
    this._view = view;

    return contextMenu({
      window: view,
      prepend: (actions, params, view) => {
          return [
            {
              label: 'Reply',
              click: () => {
                  this.quote(params);
              }
            },
            {
              label: 'Quote selection',
              visible: params.selectionText.trim().length > 0,
              click: () => {
                this.quoteSelection(params);
              }
            }
          ]
      },
      showSearchWithGoogle: false,
      showLookUpSelection: false,
      showInspectElement: !environment.production
    });
  }

  private quote(params: ContextMenuParams): void {
    this._view.send(Channels.QUOTE, {x: params.x, y: params.y});
  }

  private quoteSelection(params: ContextMenuParams): void {
    this._view.send(Channels.QUOTE_SELECTION, params.selectionText.trim(), {x: params.x, y: params.y});
  }
}

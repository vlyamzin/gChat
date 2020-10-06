import {ipcRenderer} from "electron";
import {Channels} from '../shared/channels';
import {QuoteListener} from '../shared/interfaces';

export class Quote {
  private static MESSAGE_BLOCK_CLASSES = new Set(['Zc1Emd', 'QIJiHb', 'MiRdyc']);
  private static INPUT_BLOCK_ID = 'g1zMPd';
  private static INPUT_HISTORY_MESSAGE_ID = 'LT24l';
  private static INPUT_HISTORY_MESSAGE_HIDE = 'qs41qe';

  public initEventListeners(): void {
    ipcRenderer.on(Channels.QUOTE, this.quoteListener);
  }

  private quoteListener: QuoteListener = function (event, coords) {
    const elem = document.elementFromPoint(coords.x, coords.y) as HTMLElement;
    if (Quote.validateSelection(elem)) {
      Quote.copyMessageAndFocusInput(elem);
    }
  }

  private static validateSelection(elem: HTMLElement): boolean {
    for (let c of elem.classList.entries()) {
      if (Quote.MESSAGE_BLOCK_CLASSES.has(c[1])) {
        return true;
      }
    }

    return false;
  }

  private static copyMessageAndFocusInput(elem: HTMLElement): void {
    const input = Quote.getById(Quote.INPUT_BLOCK_ID);
    const history = Quote.getById(Quote.INPUT_HISTORY_MESSAGE_ID);


    if (!input) {
      throw new Error('Input not found');
    }

    setTimeout(() => { history.classList.remove(Quote.INPUT_HISTORY_MESSAGE_HIDE); }, 0);
    input.focus();
    input.textContent = '```Quote:\n"' + Quote.getInnerText(elem) + '"\n```\n ';
    Quote.putCursorToEnd(input);

  }

  private static getById(id: string): HTMLElement {
    return document.querySelector<HTMLElement>(`[jsname='${id}']`);
  }

  private static putCursorToEnd(elem: HTMLElement): void {
    let range, selection;
    range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private static getInnerText(elem: HTMLElement): string {
    let child = elem.firstChild, text: Array<string> = [];

    while (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        //@ts-ignore
        text.push(child.data);
      }
      child = child.nextSibling;
    }

    return text.join('');
  }
}

import {IpcRendererEvent} from 'electron';

export interface ICoords {
  x: number;
  y: number;
}

export type QuoteListener = (event: IpcRendererEvent, coords: ICoords) => void

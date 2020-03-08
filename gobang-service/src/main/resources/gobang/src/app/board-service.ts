import {Inject, Injectable} from '@angular/core';
import {Board} from './models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  board: Board;

  initBoard(size: number) {
    console.log(`The BoardService is init with a board size ${size}.`);
    this.board = new Board(size);
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {GameRecord, Team} from './models';
import {BoardService} from './board-service';

export class Game {
  currentTurn: Team;

  constructor(
    public id: number,
    public link: string,
    public team: Team,
    public token: string) {
  }

  isYourTurn(): boolean {
    return this.team === this.currentTurn;
  }
}

export class NotYourTurnError extends Error {
  constructor() {
    super('It\'s not your turn.');
  }
}

@Injectable()
export abstract class GobangService {
  abstract createGame(): Observable<Game>;

  abstract putChess(row: number, col: number): Observable<any>;

  abstract listenToGame(): Observable<GameRecord>;
}

@Injectable({
  providedIn: 'root'
})
export class StubGobangService implements GobangService {
  private game: Game;
  private gameRecordsSubject: Subject<GameRecord>;
  private gameSubject: Subject<Game>;
  private boardService: BoardService;

  constructor(boardService: BoardService) {
    this.boardService = boardService;
  }

  createGame(): Observable<Game> {
    this.game = new Game(1, 'http://example.com/games/1', Team.BLACK, 'token');
    this.gameSubject = new BehaviorSubject<Game>(this.game);
    console.log('The game is created.');
    setTimeout(() => {
      this.gameSubject.next(this.game);
    }, 300);
    return this.gameSubject;
  }

  putChess(row: number, col: number): Observable<any> {
    console.log(`Put chess at (${row}, ${col})`);
    const putChessSubject = new Subject<any>();
    // simulate put-chess
    setTimeout(() => {
      if (this.game.isYourTurn()) {
        putChessSubject.next();
        this.gameRecordsSubject.next(new GameRecord(row, col, this.game.team));
        setTimeout(() => this.gameRecordsSubject.next(this.generateRandomGameRecord()), 1000);
      } else {
        putChessSubject.error(new NotYourTurnError());
      }
    }, 400);
    return putChessSubject;
  }

  listenToGame(): Observable<GameRecord> {
    this.gameRecordsSubject = new Subject();
    return this.gameRecordsSubject;
  }

  private generateRandomGameRecord(): GameRecord {
    let row;
    let col;
    do {
      row = Math.floor(Math.random() * this.boardService.board.size);
      col = Math.floor(Math.random() * this.boardService.board.size);
      console.log(`Random game record is generated: (${row}, ${col}).`);
    } while (this.boardService.board.isUsed(row, col));
    return new GameRecord(row, col, Team.WHITE);
  }
}



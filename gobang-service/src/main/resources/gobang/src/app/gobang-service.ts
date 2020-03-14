import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {GameRecord, Team} from './models';
import {BoardService} from './board-service';

export class Game {

  constructor(
    public id: number,
    public team: Team,
    public token: string) {
  }

  static p1Team = Team.BLACK;
  static p2Team = Team.WHITE;
  currentTurn: Team = Team.BLACK;

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
  game: Game;
  gameRecordsSubject: Subject<GameRecord>;
  errorSubject: Subject<Error>;

  abstract createGame(): Observable<Game>;

  abstract putChess(row: number, col: number): Observable<any>;

  abstract connect(): void;

  abstract joinGame(id: number): Observable<Game>;
}

@Injectable({
  providedIn: 'root'
})
export class StubGobangService implements GobangService {
  game: Game;
  gameRecordsSubject: Subject<GameRecord>;
  gameStartedSubject: Subject<any>;
  errorSubject: Subject<Error>;
  private gameSubject: Subject<Game>;
  private boardService: BoardService;

  constructor(boardService: BoardService) {
    this.boardService = boardService;
  }

  createGame(): Observable<Game> {
    this.game = new Game(1, Game.p1Team, 'token');
    this.gameSubject = new BehaviorSubject<Game>(this.game);
    console.log('The game is created.');
    setTimeout(() => {
      this.gameSubject.next(this.game);
    }, 300);
    return this.gameSubject;
  }

  joinGame(id: number): Observable<Game> {
    console.log('Joining the game...');
    const joinGameSubject = new Subject<Game>();
    setTimeout(() => {
      this.game = new Game(id, Game.p2Team, 'token');
      joinGameSubject.next(this.game);
    }, 400);
    return joinGameSubject;
  }

  connect(): void {
    console.log('Connecting to the server');
    this.validateIfGameExists();
    this.gameRecordsSubject = new Subject<GameRecord>();
    this.gameStartedSubject = new Subject<any>();
    this.errorSubject = new Subject<Error>();
    // Do nothing, because this is just a stub.
    console.log('Connected to the server');
  }

  putChess(row: number, col: number): Observable<any> {
    console.log(`Putting chess at (${row}, ${col})`);
    this.validateIfGameExists();
    const putChessSubject = new Subject<any>();
    // simulate put-chess
    setTimeout(() => {
      if (this.game.isYourTurn()) {
        putChessSubject.next();
        this.gameRecordsSubject.next(new GameRecord(row, col, this.game.team));
        setTimeout(() => this.gameRecordsSubject.next(this.generateRandomGameRecord()), 1000);
      } else {
        const err = new NotYourTurnError();
        this.errorSubject.next(err);
        putChessSubject.error(err);
      }
    }, 400);
    return putChessSubject;
  }

  private validateIfGameExists() {
    if (!this.game) {
      throw new Error('The game has not been created.');
    }
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



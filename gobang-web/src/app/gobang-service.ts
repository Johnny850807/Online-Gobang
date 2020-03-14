import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {GameMove, oppositeTeam, Team} from './models';
import {BoardService} from './board-service';
import get = Reflect.get;

export class Game {

  constructor(
    public id: number,
    public yourTeam: Team,
    public token: string) {
  }

  static p1Team = Team.BLACK;
  static p2Team = Team.WHITE;
  currentTurn: Team = Team.BLACK;
  started = false;

  isYourTurn(): boolean {
    return this.yourTeam === this.currentTurn;
  }

  setNextTurn() {
    this.currentTurn = this.currentTurn === Team.BLACK ? Team.WHITE : Team.BLACK;
    console.log(`[Game] Set current turn to ${Team[this.currentTurn]}.`);
  }
}

export class TokenInvalidError extends Error {
  constructor() {
    super('The token is invalid.');
  }
}

export class GameOverError extends Error {
  constructor() {
    super('The game has been over.');
  }
}

export class GameNotStartedError extends Error {
  constructor() {
    super('The game has not been started.');
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
  gameStartedObservable: Observable<any>;
  gameMovesObservable: Observable<GameMove>;
  errorObservable: Observable<Error>;
  putChessObservable = new Observable<any>();

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
  private gameMovesSubject: Subject<GameMove>;
  private gameStartedSubject: Subject<any>;
  private errorSubject: Subject<Error>;
  private boardService: BoardService;
  private putChessSubject: ReplaySubject<any>;

  constructor(boardService: BoardService) {
    this.boardService = boardService;
    this.initSubjects();
  }

  private initSubjects() {
    this.gameMovesSubject = new Subject<GameMove>();
    this.gameStartedSubject = new Subject<any>();
    this.putChessSubject = new ReplaySubject<any>(1);
    this.composeErrorSubject(this.gameMovesSubject, this.gameStartedSubject, this.putChessSubject);
  }

  private composeErrorSubject(...subjects: Subject<any>[]) {
    this.errorSubject = new Subject<Error>();
    for (const subject of subjects) {
      subject.subscribe({
        error: err => {
          this.errorSubject.next(err);
        }
      });
    }
  }

  createGame(): Observable<Game> {
    console.log('Creating the game.');
    this.game = new Game(1, Game.p1Team, 'token');
    const createGameSubject = new BehaviorSubject<Game>(this.game);
    setTimeout(() => {
      console.log('Created the game.');
      createGameSubject.next(this.game);
      this.gameStarted();
    }, 300);
    return createGameSubject;
  }

  joinGame(id: number): Observable<Game> {
    console.log('Joining the game...');
    const joinGameSubject = new Subject<Game>();
    setTimeout(() => {
      console.log('Joined the game...');
      this.game = new Game(id, Game.p2Team, 'token');
      joinGameSubject.next(this.game);
      this.gameStarted();
    }, 400);
    return joinGameSubject;
  }

  private gameStarted() {
    console.log('The game is started!');
    this.game.started = true;
    this.gameStartedSubject.next();
    if (!this.game.isYourTurn()) {
      // The first turn is AI's
      this.performAiMove();
    }
  }

  connect(): void {
    console.log('Connecting to the server');
    this.validateIfGameExists();
    // Do nothing, because this is just a stub.
    console.log('Connected to the server');

    setTimeout(() => {
      this.gameStartedSubject.next();
    }, 1500);  // after 1500ms, trigger player joining
  }

  putChess(row: number, col: number): Observable<any> {
    console.log(`Putting chess at (${row}, ${col})`);
    this.validateIfGameExists();

    if (this.game.started) {
      if (this.game.isYourTurn()) {
        this.doPutChess(row, col);
      } else {
        this.putChessSubject.error(new NotYourTurnError());
      }
    } else {
      this.putChessSubject.error(new GameNotStartedError());
    }

    return this.putChessSubject;
  }

  private doPutChess(row: number, col: number) {
    this.game.setNextTurn();
    setTimeout(() => {
      this.putChessSubject.next();
      this.putChessSubject.complete();
      this.gameMovesSubject.next(new GameMove(row, col, this.game.yourTeam));
      this.performAiMove();
    }, 400);
  }

  private performAiMove() {
    setTimeout(() => {
      this.game.setNextTurn();
      this.gameMovesSubject.next(this.generateRandomGameRecord(
        oppositeTeam(this.game.yourTeam)
      ));
    }, 1000);
  }

  private validateIfGameExists() {
    if (!this.game) {
      throw new Error('The game has not been created.');
    }
  }

  private generateRandomGameRecord(team: Team): GameMove {
    let row;
    let col;
    do {
      row = Math.floor(Math.random() * this.boardService.board.size);
      col = Math.floor(Math.random() * this.boardService.board.size);
      console.log(`Random game record is generated: (${row}, ${col}).`);
    } while (this.boardService.board.isUsed(row, col));
    return new GameMove(row, col, team);
  }

  get gameStartedObservable(): Observable<any> {
    return this.gameStartedSubject;
  }

  get gameMovesObservable(): Observable<GameMove> {
    return this.gameMovesSubject;
  }

  get errorObservable(): Observable<Error> {
    return this.errorSubject;
  }

  get putChessObservable(): Observable<any> {
    return this.putChessSubject;
  }

}



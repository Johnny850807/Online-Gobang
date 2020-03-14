import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {GameMoves, oppositeTeam, Team} from './models';
import {BoardService} from './board-service';

export class Game {

  constructor(
    public id: number,
    public yourTeam: Team,
    public token: string) {
  }

  static p1Team = Team.BLACK;
  static p2Team = Team.WHITE;
  currentTurn: Team = Team.BLACK;

  isYourTurn(): boolean {
    return this.yourTeam === this.currentTurn;
  }

  setNextTurn() {
    this.currentTurn = this.currentTurn === Team.BLACK ? Team.WHITE : Team.BLACK;
    console.log(`[Game] Set current turn to ${Team[this.currentTurn]}.`);
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
  gameMovesSubject: Subject<GameMoves>;
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
  gameMovesSubject = new Subject<GameMoves>();
  gameStartedSubject = new Subject<any>();
  errorSubject = new Subject<Error>();
  private gameSubject: Subject<Game>;
  private boardService: BoardService;

  constructor(boardService: BoardService) {
    this.boardService = boardService;
  }

  createGame(): Observable<Game> {
    console.log('Creating the game.');
    this.game = new Game(1, Game.p1Team, 'token');
    this.gameSubject = new BehaviorSubject<Game>(this.game);
    setTimeout(() => {
      console.log('Created the game.');
      this.gameSubject.next(this.game);
      this.gameStarted();
    }, 300);
    return this.gameSubject;
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
  }

  putChess(row: number, col: number): Observable<any> {
    console.log(`Putting chess at (${row}, ${col})`);
    this.validateIfGameExists();
    const putChessSubject = new Subject<any>();
    // simulate put-chess
    if (this.game.isYourTurn()) {
      this.game.setNextTurn();
      setTimeout(() => {
        putChessSubject.next();
        this.gameMovesSubject.next(new GameMoves(row, col, this.game.yourTeam));
        this.performAiMove();
      }, 400);
    } else {
      const err = new NotYourTurnError();
      this.errorSubject.next(err);
    }
    return putChessSubject;
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

  private generateRandomGameRecord(team: Team): GameMoves {
    let row;
    let col;
    do {
      row = Math.floor(Math.random() * this.boardService.board.size);
      col = Math.floor(Math.random() * this.boardService.board.size);
      console.log(`Random game record is generated: (${row}, ${col}).`);
    } while (this.boardService.board.isUsed(row, col));
    return new GameMoves(row, col, team);
  }


}



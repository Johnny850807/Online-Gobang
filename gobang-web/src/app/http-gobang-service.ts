import {Game, GameOverError, GobangService, NotYourTurnError, TokenInvalidError} from './gobang-service';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {GameMove, Team} from './models';
import {RxStomp, RxStompConfig} from '@stomp/rx-stomp';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpGobangService implements GobangService {
  game: Game;
  isHost = false;
  rxStomp: RxStomp = new RxStomp();
  errorSubject: Subject<Error>;
  gameMovesSubject: Subject<GameMove>;
  gameStartedSubject: Subject<any>;
  putChessSubject: Subject<any>;

  constructor(private http: HttpClient) {
    this.initSubjects();
  }

  private initSubjects() {
    this.gameMovesSubject = new Subject<GameMove>();
    this.putChessSubject = new ReplaySubject<any>(1);
    this.gameStartedSubject = new ReplaySubject<any>(1);
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
    this.isHost = true;
    return this.http.post(this.urlPrefix('/api/games'), null)
      .pipe(map(resp => {
        this.game = new Game(resp['gameId'], Team.BLACK, resp['token']);
        return this.game;
      }));
  }

  joinGame(id: number): Observable<Game> {
    this.isHost = false;
    const joinGameSubject = new ReplaySubject<Game>(1);
    this.http.post(this.urlPrefix(`/api/games/${id}`), null)
      .subscribe(resp => {
        if (resp['successful']) {
          this.game = new Game(id, Team.WHITE, resp['token']);
          joinGameSubject.next(this.game);
          joinGameSubject.complete();
          this.gameStarted();
        } else {
          joinGameSubject.error(new Error(resp['message']));
        }
      });

    return joinGameSubject;
  }

  private gameStarted() {
    this.game.started = true;
    this.gameStartedSubject.next();
    this.gameStartedSubject.complete();
  }

  connect(): void {
    const config = new RxStompConfig();
    config.brokerURL = 'ws://localhost:8080/gobang-websocket/websocket';
    config.reconnectDelay = 200;
    if (this.rxStomp.active) {
      this.rxStomp.deactivate();
    }
    this.rxStomp.configure(config);
    this.rxStomp.activate();

    this.rxStomp.watch('/topic/games/gameStarted')
      .subscribe(r => {
        console.log('New player has joined.');
        this.gameStartedSubject.next();
        this.gameStartedSubject.complete();
      });

    this.rxStomp.watch('/queue/error')
      .subscribe(resp => {
        const errNo = resp['errNo'];
        switch (errNo) {
          case 4000:
            this.putChessSubject.error(new NotYourTurnError());
            break;
          case 4001:
            this.putChessSubject.error(new GameOverError());
            break;
          case 4002:
            this.putChessSubject.error(new TokenInvalidError());
            break;
        }
      });

    this.rxStomp.watch(`/topic/games/${this.game.id}/newChess`)
      .subscribe(resp => {
        const body = JSON.parse(resp.body);
        const winner = body['winner'] as Team;
        if (winner === Team.NONE) {
          const newMove = new GameMove(body['newMove']['row'], body['newMove']['col'], body['currentTurn'] as Team);
          this.gameMovesSubject.next(newMove);
          if (newMove.team === this.game.yourTeam) {
            this.putChessSubject.next();
            this.putChessSubject.complete();
          }
        } else {
          // TODO Game over, notify
        }
      });
  }

  putChess(row: number, col: number): Observable<any> {
    this.rxStomp.publish({
      destination: `/app/games/${this.game.id}/putChess`,
      body: JSON.stringify({
        token: this.game.token,
        chessPlacement: {row, col}
      })
    });
    return this.putChessSubject;
  }

  private urlPrefix(path: string): string {
    return `http://localhost:8080/${path}`;
  }

  get errorObservable(): Observable<Error> {
    return this.errorSubject;
  }

  get gameMovesObservable(): Observable<GameMove> {
    return this.gameMovesSubject;
  }

  get putChessObservable(): Observable<any> {
    return this.putChessSubject;
  }

  get gameStartedObservable(): Observable<any> {
    return this.gameStartedSubject;
  }

}

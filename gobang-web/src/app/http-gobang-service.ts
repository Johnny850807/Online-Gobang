import {Game, GobangService} from './gobang-service';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {GameMove} from './models';
import {RxStomp, RxStompConfig} from '@stomp/rx-stomp';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpGobangService implements GobangService {

  constructor(private http: HttpClient) {
  }

  game: Game;
  isHost = false;
  rxStomp: RxStomp = new RxStomp();
  errorSubject: Subject<Error>;
  gameMovesSubject: Subject<GameMove>;
  gameStartedObservable: Observable<any>;
  putChessSubject: Subject<any>;

  createGame(): Observable<Game> {
    this.isHost = true;
    return this.http.post<Game>('/api/games', null);
  }

  joinGame(id: number): Observable<Game> {
    this.isHost = false;
    return this.http.post<Game>(`/api/games/${id}`, null);
  }

  connect(): void {
    const config = new RxStompConfig();
    config.brokerURL = 'ws://gobang-websocket';
    config.reconnectDelay = 200;
    this.rxStomp.configure(config);
    this.rxStomp.activate();
    this.gameStartedObservable = this.rxStomp.watch(`topic/games/gameStarted`);
  }

  putChess(row: number, col: number): Observable<any> {
    return undefined;
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


}

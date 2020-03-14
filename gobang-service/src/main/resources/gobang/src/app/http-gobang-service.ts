import {Game, GobangService} from './gobang-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameMoves} from './models';
import {RxStomp, RxStompConfig} from '@stomp/rx-stomp';

export class HttpGobangService implements GobangService {
  game: Game;
  rxStomp: RxStomp = new RxStomp();

  constructor(private http: HttpClient) {
  }

  createGame(): Observable<Game> {
    return this.http.post<Game>('/api/games', null);
  }


  listenToGame(): Observable<GameMoves> {
    const config = new RxStompConfig();
    config.brokerURL = '';
    config.reconnectDelay = 200;
    this.rxStomp.configure(config);
    this.rxStomp.activate();

    return null;  //  this.rxStomp.watch('/app//games/{gameId}');
  }

  putChess(row: number, col: number): Observable<any> {
    return undefined;
  }

}

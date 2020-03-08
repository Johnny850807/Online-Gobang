import {EventEmitter} from '@angular/core';
import {Game, GobangService} from './gobang-service';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {GameRecord} from './models';

export class HttpGobangService implements GobangService {
  game: Game;

  constructor(private http: HttpClient) {
  }

  createGame(): Observable<Game> {
    return this.http.post<Game>('', null);
  }

  putChess(row: number, col: number): Observable<any> {
    return undefined;
  }

  listenToGame(): Observable<GameRecord> {
    return undefined;
  }

}

import {GobangService} from './gobang-service';
import {Howl} from 'howler';
import {Injectable} from '@angular/core';

@Injectable (
  {providedIn: 'root'}
)
export class SoundPlay {
  static putChessSound: HTMLMediaElement = new Howl({src: ['assets/sound/putChess.mp3']});
  static dingDongSound: HTMLMediaElement = new Howl({src: ['assets/sound/dingDong.mp3']});
  gobangService: GobangService;

  subscribe(gobangService: GobangService) {
    this.gobangService = gobangService;
    this.gobangService.putChessObservable.subscribe(r => SoundPlay.putChessSound.play());
    this.gobangService.gameStartedObservable.subscribe(r => SoundPlay.dingDongSound.play());
  }
}

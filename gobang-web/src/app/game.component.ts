import {Component, OnInit} from '@angular/core';
import {GobangService} from './gobang-service';
import {SoundPlay} from './sound-play';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./app.component.css', './game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private gobangService: GobangService,
              private soundPlay: SoundPlay) {
  }

  ngOnInit(): void {
    console.log(`[GameComponent]: ngOnInit`);
    if (!this.gobangService.game) {
      this.gobangService.reset();
      this.soundPlay.subscribe(this.gobangService);
      const gameId = Number(window.location.hash.split('/')[2]);
      console.log(`[GameComponent]: the game id is ${gameId}`);
      this.gobangService.joinGame(gameId)
        .subscribe(game => this.gobangService.connect());
    } else {
      console.log(`[GameComponent]: the game id is ${this.gobangService.game.id}`);
      this.gobangService.connect();
    }
  }

}

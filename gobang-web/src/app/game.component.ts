import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Game, GobangService} from './gobang-service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./app.component.css', './game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private gobangService: GobangService) {
  }

  ngOnInit(): void {
    console.log(`[GameComponent]: ngOnInit`);
    if (!this.gobangService.game) {
      console.log(window.location.pathname.split('/')[2]);
      const gameId = Number(window.location.pathname.split('/')[2]);
      console.log(`[GameComponent]: the game id is ${gameId}`);
      this.gobangService.joinGame(gameId)
        .subscribe(game => this.gobangService.connect());
    } else {
      console.log(`[GameComponent]: the game id is ${this.gobangService.game.id}`);
      this.gobangService.connect();
    }
  }

}

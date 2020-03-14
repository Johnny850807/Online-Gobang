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
    if (!this.gobangService.game) {
      const gameId = Number(window.location.pathname.split('/')[1]);
      this.gobangService.joinGame(gameId);
    }

    this.gobangService.connect();
  }

}

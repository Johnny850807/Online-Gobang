import {Component, Input, OnInit} from '@angular/core';
import {GameNotStartedError, GameOverError, GobangService, NotYourTurnError} from './gobang-service';

@Component({
  selector: 'app-status-message',
  template: `
    <p class="major-dark-font" id="bottom-message">{{message}}</p>
  `,
  styleUrls: ['./app.component.css'],
  styles: [`
    #bottom-message {
      margin-top: 20px;
      text-align: center;
    }
  `]
})
export class StatusMessageComponent implements OnInit {
  static WAITING = 'Wait for another player ...';
  static GAME_NOT_STARTED = 'The game has not been started, please wait for the player to join.';
  static NOT_YOUR_TURN = 'Not your turn!';
  static ITS_YOUR_TURN = 'It\'s your turn';

  message = StatusMessageComponent.WAITING;

  constructor(private gobangService: GobangService) {
  }

  ngOnInit(): void {
    console.log(`[StatusMessageComponent]: ngOnInit`);
    this.gobangService.gameStartedObservable.subscribe(r => {
      this.message = 'New player joined! Game started.';
    });

    this.gobangService.errorObservable.subscribe(err => {
      if (err instanceof GameNotStartedError) {
        this.message = StatusMessageComponent.GAME_NOT_STARTED;
      } else if (err instanceof NotYourTurnError) {
        this.message = StatusMessageComponent.NOT_YOUR_TURN;
      }
    });

    this.gobangService.gameMovesObservable.subscribe(r => {
      if (this.gobangService.game.isYourTurn()) {
        this.message = StatusMessageComponent.ITS_YOUR_TURN;
      }
    });

    this.gobangService.gameOverObservable.subscribe(winner => {
      this.message = `The game is over! The winner is ${winner}`;
    });
  }
}

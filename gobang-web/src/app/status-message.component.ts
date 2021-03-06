import {Component, OnInit} from '@angular/core';
import {GameNotStartedError, GobangService, InvalidPositionError, NotYourTurnError} from './gobang-service';

@Component({
  selector: 'app-status-message',
  template: `
    <p class="major-dark-font" id="bottom-message">{{message}}
      <p-progressSpinner id="spinner" [style]="{width: '30px', height: '30px'}"
                         [strokeWidth]="'4px'"></p-progressSpinner>
    </p>
  `,
  styleUrls: ['./app.component.css'],
  styles: [`
    #bottom-message {
      font-family: "Avenir Book", serif;
      color: var(--primary-darkest-grown);
      font-size: 35px;
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
  static INVALID_POSITION = 'This position is invalid!';

  message = StatusMessageComponent.WAITING;

  constructor(private gobangService: GobangService) {
  }

  ngOnInit(): void {
    console.log(`[StatusMessageComponent]: ngOnInit`);
    this.setShowSpinner(true);
    this.gobangService.gameStartedObservable.subscribe(r => {
      this.message = 'New player joined! Game started.';
      this.setShowSpinner(false);
    });

    this.gobangService.errorObservable.subscribe(err => {
      if (err instanceof GameNotStartedError) {
        this.message = StatusMessageComponent.GAME_NOT_STARTED;
      } else if (err instanceof NotYourTurnError) {
        this.message = StatusMessageComponent.NOT_YOUR_TURN;
      } else if (err instanceof InvalidPositionError) {
        this.message = StatusMessageComponent.INVALID_POSITION;
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


  setShowSpinner(show: boolean) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = show ? 'inline' : 'none';
  }
}

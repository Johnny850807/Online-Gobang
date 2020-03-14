import {Component, Input, OnInit} from '@angular/core';
import {GobangService, NotYourTurnError} from './gobang-service';

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
  static NOT_YOUR_TURN = 'Not your turn!';
  static ITS_YOUR_TURN = 'It\'s your turn';

  message = StatusMessageComponent.WAITING;

  constructor(private gobangService: GobangService) {
  }

  ngOnInit(): void {
    console.log(`[StatusMessageComponent]: ngOnInit`);
    this.gobangService.errorSubject.forEach(err => {
      if (err instanceof NotYourTurnError) {
        this.message = StatusMessageComponent.NOT_YOUR_TURN;
      }
    });

    this.gobangService.gameMovesSubject.forEach(r => {
      if (this.gobangService.game.isYourTurn()) {
        this.message = StatusMessageComponent.ITS_YOUR_TURN;
      }
    });
  }
}

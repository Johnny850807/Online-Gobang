import {Component, Input, OnInit} from '@angular/core';
import {GobangService} from './gobang-service';

enum Status { WAITING, GAME_STARTED}

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
  @Input() status: Status = Status.WAITING;
  isMyTurn = false;

  constructor(private gobangService: GobangService) {
  }

  ngOnInit(): void {
  }

  get message(): string {
    return this.status === Status.WAITING ? 'Wait for another player ...' :
      this.isMyTurn ? 'It\'s your turn' : 'Wait for another player\'s action ...';
  }
}

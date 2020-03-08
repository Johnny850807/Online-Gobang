import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['../app.component.css', './chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  @Input() size = 15;

  ngOnInit(): void {
    const canvas = document.getElementById('chess-board') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const chessBoardImg = new Image();
    chessBoardImg.src = 'assets/img/chessBoard.svg';
    chessBoardImg.onload = () => {
      context.drawImage(chessBoardImg, 0, 0, canvas.width, canvas.height);
      // this.drawAllPoints();
    };
  }

  private drawAllPoints(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.drawCircle('#000000', i, j);
      }
    }
  }

  private drawCircle(chessColor: string, row: number, col: number): void {
    const canvas = document.getElementById('chess-board') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const dx = 66;  // hard-coded parameters
    const dy = 60;
    const w = 37;
    const y = 31;
    const thick = 12;
    context.fillStyle = chessColor;
    context.beginPath();
    context.arc(dx + col * (w + thick), dy + row * (y + thick), 11, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
  }
}

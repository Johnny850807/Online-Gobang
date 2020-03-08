import {Component, OnInit} from '@angular/core';
import {GobangService} from '../gobang-service';
import {BoardService} from '../board-service';
import {GameRecord, Team} from "../models";

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['../app.component.css', './chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  public readonly size = 15;
  public readonly dx = 66;  // hard-coded parameters
  public readonly dy = 60;
  public readonly w = 37;
  public readonly h = 31;
  public readonly thick = 12;

  constructor(private gobangService: GobangService,
              private boardService: BoardService) {
    this.boardService.initBoard(this.size);
  }

  ngOnInit(): void {
    this.initCanvas();
    this.gobangService.listenToGame()
      .forEach(gameRecord => this.renderGameRecord(gameRecord));
  }

  private initCanvas() {
    const canvas = document.getElementById('chess-board') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const chessBoardImg = new Image();
    chessBoardImg.src = 'assets/img/chessBoard.svg';
    chessBoardImg.onload = () => {
      context.drawImage(chessBoardImg, 0, 0, canvas.width, canvas.height);
    };
    canvas.onclick = (e) => {
      const canvasRect = canvas.getBoundingClientRect();
      const clickX = e.clientX - canvasRect.x;
      const clickY = e.clientY - canvasRect.y;
      console.log(`Click at (${clickY}, ${clickX})`);
      const row = Math.floor((clickY - this.dy) / this.h);
      const col = Math.floor((clickX - this.dx) / this.w);
      this.gobangService.putChess(row, col)
        .subscribe(() => console.log('The chess has been put.'));
    };
  }

  // Used for testing if the chess's position calculation is correct
  private drawAllPoints(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.drawCircle('#000000', i, j);
      }
    }
  }

  private renderGameRecord(gameRecord: GameRecord) {
    const chessColor = gameRecord.team === Team.WHITE ? '#ffffff' : '#000000';
    this.drawCircle(chessColor, gameRecord.row, gameRecord.col);
  }

  private drawCircle(chessColor: string, row: number, col: number): void {
    const canvas = document.getElementById('chess-board') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    context.fillStyle = chessColor;
    context.beginPath();
    context.arc(this.dx + col * (this.w + this.thick), this.dy + row * (this.h + this.thick),
      11, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
  }
}

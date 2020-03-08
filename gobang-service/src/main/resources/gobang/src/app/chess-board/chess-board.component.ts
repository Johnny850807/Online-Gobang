import {Component, OnInit} from '@angular/core';
import {Game, GobangService} from '../gobang-service';
import {BoardService} from '../board-service';
import {GameRecord, Team} from '../models';
import {Howl} from 'howler';

class Position {
  constructor(public x: number,
              public y: number) {
  }

  equals(pos: Position): boolean {
    return pos && this.x === pos.x && this.y === pos.y;
  }
}

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
  private readonly selectImg: HTMLImageElement;
  private readonly chessBoardImg: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private latestMousePosition: Position;
  private gameRecords: GameRecord[];
  private putChessSound: HTMLMediaElement;

  constructor(private gobangService: GobangService,
              private boardService: BoardService) {
    this.boardService.initBoard(this.size);
    this.selectImg = new Image();
    this.selectImg.src = 'assets/img/selected.png';
    this.chessBoardImg = new Image();
    this.chessBoardImg.src = 'assets/img/chessBoard.svg';
    this.putChessSound = new Howl({src: ['assets/sound/putChess.mp3']});
  }

  private static roundPosition(pos: Position): Position {
    return new Position(Math.floor(pos.x), Math.floor(pos.y));
  }

  ngOnInit(): void {
    this.gameRecords = [];
    this.canvas = document.getElementById('chess-board') as HTMLCanvasElement;
    this.initCanvas();
    this.gobangService.listenToGame()
      .forEach(gameRecord => this.appendNewGameRecord(gameRecord));
    this.repaint();
  }

  private appendNewGameRecord(gameRecord: GameRecord) {
    this.gameRecords.push(gameRecord);
    this.repaint();
    this.onNewChessPut();
  }

  private initCanvas() {
    this.canvas.onmousemove = (e) => {
      const pos = this.getMousePositionRelativelyToBoard(e.clientX, e.clientY);
      if (!pos.equals(this.latestMousePosition)) {
        this.latestMousePosition = pos;
        this.repaint();
      }
    };
    this.canvas.onclick = (e) => {
      const pos = this.getMousePositionRelativelyToBoard(e.clientX, e.clientY);
      this.gobangService.putChess(pos.y, pos.x)
        .subscribe(() => {
          console.log('The chess has been put.');
        });
    };
  }

  private onNewChessPut() {
    this.putChessSound.play();
  }

  private getMousePositionRelativelyToBoard(clientMouseX: number, clientMouseY: number): Position {
    const canvasRect = this.canvas.getBoundingClientRect();
    const clickX = clientMouseX - canvasRect.x;
    const clickY = clientMouseY - canvasRect.y;
    const pos = this.convertPixelToPos(clickX, clickY);
    console.log(`Convert mouse pos at (${clickY}, ${clickX}) to (${pos.y}, ${pos.x})`);
    return pos;
  }

  // Used for testing if the chess's position calculation is correct
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
    context.fillStyle = chessColor;
    context.beginPath();
    const pixel = this.convertPosToPixel(col, row);
    context.arc(pixel.x, pixel.y, 11, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
  }

  private convertPosToPixel(x: number, y: number): Position {
    return new Position(this.dx + x * (this.w + this.thick),
      this.dy + y * (this.h + this.thick));
  }

  private convertPixelToPos(x: number, y: number): Position {
    const row = Math.floor((y - this.dy) / this.h);
    const col = Math.floor((x - this.dx) / this.w);
    return new Position(col, row);
  }

  private repaint() {
    const context = this.canvas.getContext('2d');
    context.drawImage(this.chessBoardImg, 0, 0, this.canvas.width, this.canvas.height);

    const pixel = this.convertPosToPixel(this.latestMousePosition.x, this.latestMousePosition.y);
    context.drawImage(this.selectImg, pixel.x - this.w / 2, pixel.y - this.h / 2);

    this.gameRecords.forEach(gameRecord => this.renderGameRecord(gameRecord));
  }

  private renderGameRecord(gameRecord: GameRecord) {
    const chessColor = gameRecord.team === Team.WHITE ? '#ffffff' : '#000000';
    this.drawCircle(chessColor, gameRecord.row, gameRecord.col);
  }

}

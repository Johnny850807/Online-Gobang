import {Component, OnInit} from '@angular/core';
import {GobangService} from '../gobang-service';
import {BoardService} from '../board-service';
import {GameMove, Team} from '../models';

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
  // public readonly boardWidth = 820;
  // public readonly boardHeight = 820;
  // public readonly dx = 49;  // hard-coded parameters
  // public readonly dy = 48;
  // public readonly w = 40;
  // public readonly h = 40;
  // public readonly thick = 11;
  public readonly boardWidth = 656;
  public readonly boardHeight = 656;
  public readonly dx = 39;  // hard-coded parameters
  public readonly dy = 38;
  public readonly w = 32;
  public readonly h = 32;
  public readonly thick = 8.7;
  private readonly selectImg: HTMLImageElement;
  private readonly chessBoardImg: HTMLImageElement;
  private readonly whiteChessImg: HTMLImageElement;
  private readonly blackChessImg: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private latestMousePos: Position;
  private gameMoves: GameMove[];

  constructor(private gobangService: GobangService,
              private boardService: BoardService) {
    this.boardService.initBoard(this.size);
    this.selectImg = new Image();
    this.selectImg.src = 'assets/img/selected.png';
    this.chessBoardImg = new Image();
    this.chessBoardImg.src = 'assets/img/chessBoard.png';
    this.blackChessImg = new Image();
    this.blackChessImg.src = 'assets/img/black.png';
    this.whiteChessImg = new Image();
    this.whiteChessImg.src = 'assets/img/white.png';
  }

  ngOnInit(): void {
    console.log(`[ChessBoardComponent]: ngOnInit`);
    this.gameMoves = [];
    this.canvas = document.getElementById('chess-board') as HTMLCanvasElement;
    this.initCanvas();
    this.gobangService.gameMovesObservable
      .forEach(gameRecord => this.appendNewGameMove(gameRecord));
    this.chessBoardImg.onload = () => this.repaint();
  }

  private appendNewGameMove(gameMove: GameMove) {
    this.gameMoves.push(gameMove);
    this.repaint();
  }

  private initCanvas() {
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    this.canvas.onmousemove = (e) => {
      let pos = this.getMousePositionRelativelyToBoard(e.clientX, e.clientY);
      pos = this.adjustPosToBeWithinBoard(pos);
      if (!pos.equals(this.latestMousePos)) {
        this.latestMousePos = pos;
        this.repaint();
      }
    };
    this.canvas.onclick = (e) => {
      const pos = this.getMousePositionRelativelyToBoard(e.clientX, e.clientY);
      this.gobangService.putChess(pos.y, pos.x);
    };
  }

  private getMousePositionRelativelyToBoard(clientMouseX: number, clientMouseY: number): Position {
    const canvasRect = this.canvas.getBoundingClientRect();
    const clickX = clientMouseX - canvasRect.x;
    const clickY = clientMouseY - canvasRect.y;
    const pos = this.convertPixelToPos(clickX, clickY);
    // console.log(`Convert mouse pixels at (${clickY}, ${clickX}) to position (${pos.y}, ${pos.x})`);
    return pos;
  }

  private adjustPosToBeWithinBoard(pos: Position): Position {
    const x = pos.x < 0 ? 0 :
      pos.x >= this.size ? this.size - 1 : pos.x;
    const y = pos.y < 0 ? 0 :
      pos.y >= this.size ? this.size - 1 : pos.y;
    return new Position(x, y);
  }

  private convertPosToPixel(x: number, y: number): Position {
    return new Position(this.dx + x * (this.w + this.thick) + this.thick / 2,
      this.dy + y * (this.h + this.thick) + this.thick / 2);
  }

  private convertPixelToPos(x: number, y: number): Position {
    const row = Math.floor((y - this.dy) / (this.thick + this.h));
    const col = Math.floor((x - this.dx) / (this.thick + this.w));
    return new Position(col, row);
  }

  private repaint() {
    const context = this.canvas.getContext('2d');
    context.drawImage(this.chessBoardImg, 0, 0, this.boardWidth, this.boardHeight);

    if (this.latestMousePos) {
      const pixel = this.convertPosToPixel(this.latestMousePos.x, this.latestMousePos.y);
      context.drawImage(this.selectImg, pixel.x - this.w / 2, pixel.y - this.h / 2, this.w, this.h);
    }

    this.gameMoves.forEach(gameMove => this.renderGameMove(gameMove));
  }

  private renderGameMove(gameMove: GameMove) {
    this.drawChess(gameMove.team, gameMove.row, gameMove.col);
  }

  // Used for testing if the chess's position calculation is correct
  private drawAllPoints(): void {
    let color = '#000000';
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.drawCircle(color, i, j);
        color = color === '#000000' ? '#ffffff' : '#000000';
      }
    }
  }

  private drawChess(team: Team, row: number, col: number) {
    const context = this.canvas.getContext('2d');
    const img = team === Team.WHITE ? this.whiteChessImg : this.blackChessImg;
    const pixel = this.convertPosToPixel(col, row);

    // first draw the shadow
    context.fillStyle = 'rgba(0,0,0,0.29)';
    context.beginPath();
    context.arc(pixel.x + 3, pixel.y + 4, 14, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();

    // then draw the chess onto the shadow
    context.drawImage(img, pixel.x - this.w / 2, pixel.y - this.h / 2, this.w, this.h);
  }

  private drawCircle(color: string, row: number, col: number) {
    const context = this.canvas.getContext('2d');
    context.fillStyle = color;
    context.beginPath();
    const pixel = this.convertPosToPixel(col, row);
    context.arc(pixel.x, pixel.y, 11, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
  }

}


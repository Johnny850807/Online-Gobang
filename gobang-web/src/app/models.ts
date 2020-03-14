export enum Team {NONE, BLACK, WHITE}

export function oppositeTeam(team: any) {
  switch (team) {
    case Team.BLACK:
      return Team.WHITE;
    case Team.WHITE:
      return Team.BLACK;
    default:
      return team;
  }
}


export class GameMove {
  constructor(
    public row: number,
    public col: number,
    public team: Team
  ) {
  }
}

export class Board {
  private readonly tiles: Tile[][];

  constructor(public size: number) {
    console.log(`A Board is init with the size ${size}.`);
    this.tiles = [];

    for (let i = 0; i < size; i++) {
      this.tiles.push([]);
      for (let j = 0; j < size; j++) {
        this.tiles[i].push(new Tile());
      }
    }
  }

  isUsed(row: number, col: number): boolean {
    return !this.tiles[row][col].isUsed();
  }

  set(row: number, col: number, team: Team) {
    this.tiles[row][col].team = team;
  }

  get(row: number, col: number): Tile {
    return this.tiles[row][col];
  }
}

export class Tile {
  team: Team = Team.NONE;

  isUsed(): boolean {
    return this.team === Team.NONE;
  }
}

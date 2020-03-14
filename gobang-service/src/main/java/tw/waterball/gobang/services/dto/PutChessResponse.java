package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Tile;

public class PutChessResponse {
    public GameMoveDTO newMove;
    public Tile.Color currentTurn;
    public Tile.Color winner;

    public PutChessResponse(GameMoveDTO newMove, Tile.Color currentTurn, Tile.Color winner) {
        this.newMove = newMove;
        this.currentTurn = currentTurn;
        this.winner = winner;
    }
}

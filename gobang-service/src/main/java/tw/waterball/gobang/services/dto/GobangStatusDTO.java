package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Tile;

public class GobangStatusDTO {
    public Tile.Color currentTurn;
    public Tile.Color winner;

    public GobangStatusDTO(Tile.Color currentTurn, Tile.Color winner) {
        this.currentTurn = currentTurn;
        this.winner = winner;
    }
}

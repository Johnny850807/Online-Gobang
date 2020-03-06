package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Tile;

public class GobangStatusDTO {
    private final static GobangStatusDTO NO_WINNER = new GobangStatusDTO();
    private Tile.Color winner;

    public static GobangStatusDTO noWinner() {
        return NO_WINNER;
    }

    public GobangStatusDTO() { }

    public GobangStatusDTO(Tile.Color winner) {
        this.winner = winner;
    }

    public Tile.Color getWinner() {
        return winner;
    }

    public boolean hasWinner() {
        return winner != null;
    }
}

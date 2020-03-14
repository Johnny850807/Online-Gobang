package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Tile;

/**
 * @author johnny850807@gmail.com (Waterball))
 */
public class GameMoveDTO {
    public int row;
    public int col;
    public Tile.Color color;

    public GameMoveDTO(int row, int col, Tile.Color color) {
        this.row = row;
        this.col = col;
        this.color = color;
    }
}

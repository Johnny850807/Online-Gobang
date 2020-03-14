package tw.waterball.gobang.model;

import tw.waterball.gobang.Tile;

import javax.persistence.*;
import javax.validation.constraints.PositiveOrZero;

@Entity
public class GameMove {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @PositiveOrZero
    private int placeRow;

    @PositiveOrZero
    private int placeCol;

    @Enumerated(EnumType.STRING)
    private Tile.Color color = Tile.Color.BLACK;

    @ManyToOne
    private GobangGame gobangGame;

    public GameMove() {
    }

    public GameMove(int placeRow, int placeCol, Tile.Color color) {
        this.placeRow = placeRow;
        this.placeCol = placeCol;
        this.color = color;
    }

    public GobangGame getGobangGame() {
        return gobangGame;
    }

    public void setGobangGame(GobangGame gobangGame) {
        this.gobangGame = gobangGame;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getPlaceRow() {
        return placeRow;
    }

    public void setPlaceRow(int row) {
        this.placeRow = row;
    }

    public int getPlaceCol() {
        return placeCol;
    }

    public void setPlaceCol(int col) {
        this.placeCol = col;
    }

    public Tile.Color getColor() {
        return color;
    }

    public void setColor(Tile.Color color) {
        this.color = color;
    }
}

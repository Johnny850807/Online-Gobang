package tw.waterball.gobang.model;

import javax.persistence.*;
import javax.validation.constraints.PositiveOrZero;

@Entity
public class GameRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @PositiveOrZero
    private int placeRow;

    @PositiveOrZero
    private int placeCol;

    @Enumerated(EnumType.STRING)
    private Team team = Team.NONE;

    @ManyToOne
    private Game game;

    public GameRecord() {
    }

    public GameRecord(int placeRow, int placeCol, Team team) {
        this.placeRow = placeRow;
        this.placeCol = placeCol;
        this.team = team;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
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

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}

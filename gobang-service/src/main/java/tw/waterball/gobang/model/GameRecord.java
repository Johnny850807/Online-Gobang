package tw.waterball.gobang.model;

import javax.persistence.*;
import javax.validation.constraints.PositiveOrZero;

@Entity
public class GameRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @PositiveOrZero
    private int row;

    @PositiveOrZero
    private int col;

    @Enumerated(EnumType.STRING)
    private Team team = Team.NONE;

    @ManyToOne
    private Game game;

    public GameRecord() {
    }

    public GameRecord(int row, int col, Team team) {
        this.row = row;
        this.col = col;
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

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}

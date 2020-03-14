package tw.waterball.gobang.model;

import tw.waterball.gobang.Gobang;
import tw.waterball.gobang.Tile;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GobangGame {
    public final static Tile.Color P1_COLOR = Tile.Color.WHITE;
    public final static Tile.Color P2_COLOR = Tile.Color.BLACK;
    public final static int PLAYER_LIMIT = 2;
    public final static int BOARD_SIZE = 15;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @NotNull // the p1 should exist because one must be a host
    private String p1Token;
    private String p2Token;

    @OneToMany(mappedBy = "game", fetch = FetchType.LAZY)
    private List<GameRecord> gameRecords = new ArrayList<>();

    public void addGameRecord(GameRecord record) {
        record.setGobangGame(this);
        gameRecords.add(record);
    }

    public String getP1Token() {
        return p1Token;
    }

    public void setP1Token(String p1Token) {
        this.p1Token = p1Token;
    }

    public String getP2Token() {
        return p2Token;
    }

    public void setP2Token(String p2Token) {
        this.p2Token = p2Token;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getPlayerCount() {
        return p2Token == null ? 1 : 2;
    }

    public List<GameRecord> getGameRecords() {
        return gameRecords;
    }

    public void setGameRecords(List<GameRecord> gameRecords) {
        this.gameRecords = gameRecords;
    }

    public Gobang applyGameRecordsAndGetGobang() {
        Gobang gobang = new Gobang(BOARD_SIZE);

        for (GameRecord gameRecord : gameRecords) {
            Tile.Color color = gameRecord.getTeam() == Team.BLACK ? Tile.Color.BLACK : Tile.Color.WHITE;
            gobang.putChess(gameRecord.getPlaceRow(), gameRecord.getPlaceCol(), color);
        }

        return gobang;
    }
}

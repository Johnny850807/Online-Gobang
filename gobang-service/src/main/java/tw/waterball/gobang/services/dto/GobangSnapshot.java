package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Board;
import tw.waterball.gobang.Gobang;
import tw.waterball.gobang.Tile;


public class GobangSnapshot {
    private Tile.Color turn;
    private Tile.Color winner;
    private String board;

    public GobangSnapshot(Tile.Color turn, Tile.Color winner, String board) {
        this.turn = turn;
        this.winner = winner;
        this.board = board;
    }

    public Tile.Color getWinner() {
        return winner;
    }

    public Tile.Color getTurn() {
        return turn;
    }

    public String getBoard() {
        return board;
    }

    public static GobangSnapshot project(Gobang gobang) {
        StringBuilder stringBuilder = new StringBuilder();
        Board board = gobang.getBoard();

        for (int i = 0; i < board.size(); i++) {
            for (int j = 0; j < board.size(); j++) {
                Tile.Color color = board.get(i, j).getColor();
                stringBuilder.append(color.getSymbol());
            }
            stringBuilder.append("\n");
        }
        return new GobangSnapshot(gobang.getTurn(), gobang.getWinner(), stringBuilder.toString());
    }

}

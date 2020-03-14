package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Board;
import tw.waterball.gobang.Gobang;
import tw.waterball.gobang.model.Team;

import static tw.waterball.gobang.services.dto.Converts.colorToTeam;
import static tw.waterball.gobang.services.dto.Converts.teamToSymbol;

public class GobangSnapshot {
    private Team turn;
    private Team winner;
    private String board;

    public GobangSnapshot(Team turn, Team winner, String board) {
        this.turn = turn;
        this.winner = winner;
        this.board = board;
    }

    public Team getWinner() {
        return winner;
    }

    public Team getTurn() {
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
                Team team = colorToTeam(board.get(i, j).getColor());
                char symbol = teamToSymbol(team);
                stringBuilder.append(symbol);
            }
            stringBuilder.append("\n");
        }
        return new GobangSnapshot(colorToTeam(gobang.getTurn()),
                colorToTeam(gobang.getWinner()), stringBuilder.toString());
    }

}
